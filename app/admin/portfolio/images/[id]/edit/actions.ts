"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { parseCoverForm } from "@/src/lib/portfolio/cover-form";
import { isStoryFormEmpty, parseStoryForm } from "@/src/lib/portfolio/story-form";
import type { PortfolioImageFormState } from "../../_shared/types";

export async function updatePortfolioImageWithStory(
  imageId: string,
  _previousState: PortfolioImageFormState,
  formData: FormData
): Promise<PortfolioImageFormState> {
  await requireAdmin();

  const categoryId = String(formData.get("categoryId") ?? "").trim();

  if (!categoryId) {
    return { status: "error", message: "Category is required.", blockErrors: {} };
  }

  const existingImage = await prisma.portfolioImage.findUnique({
    where: { id: imageId },
    select: { slug: true, categoryId: true },
  });

  if (!existingImage) {
    return { status: "error", message: "Portfolio image no longer exists.", blockErrors: {} };
  }

  const coverResult = await parseCoverForm(formData, { excludeImageId: imageId });

  if (!coverResult.ok) {
    return { status: "error", message: coverResult.message, blockErrors: {} };
  }

  const category = await prisma.portfolioCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    return { status: "error", message: "Selected category does not exist.", blockErrors: {} };
  }

  const storyResult = await parseStoryForm(formData);

  if (!storyResult.ok) {
    return { status: "error", message: storyResult.message, blockErrors: storyResult.blockErrors };
  }

  const existingStory = await prisma.portfolioStory.findUnique({
    where: { portfolioImageId: imageId },
    select: { id: true },
  });
  const shouldWriteStory =
    Boolean(existingStory) || !isStoryFormEmpty(storyResult.fields, storyResult.blocks);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.portfolioImage.update({
        where: { id: imageId },
        data: { categoryId, ...coverResult.data },
      });

      if (shouldWriteStory) {
        const story = await tx.portfolioStory.upsert({
          where: { portfolioImageId: imageId },
          create: { portfolioImageId: imageId, ...storyResult.fields },
          update: { ...storyResult.fields },
          select: { id: true },
        });

        await tx.portfolioStoryBlock.deleteMany({ where: { storyId: story.id } });

        if (storyResult.blocks.length > 0) {
          await tx.portfolioStoryBlock.createMany({
            data: storyResult.blocks.map((block) => ({
              storyId: story.id,
              type: block.type,
              sortOrder: block.sortOrder,
              data: block.data as Prisma.InputJsonValue,
            })),
          });
        }
      }
    });
  } catch {
    return { status: "error", message: "Failed to save. Please try again.", blockErrors: {} };
  }

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${coverResult.data.slug}`);
  revalidatePath("/admin/portfolio");
  revalidatePath(`/admin/portfolio/images/${imageId}`);
  revalidatePath(`/admin/portfolio/${categoryId}`);
  revalidatePath(`/admin/portfolio/${categoryId}/edit`);

  if (existingImage.categoryId !== categoryId) {
    revalidatePath(`/admin/portfolio/${existingImage.categoryId}`);
    revalidatePath(`/admin/portfolio/${existingImage.categoryId}/edit`);
  }

  if (existingImage.slug !== coverResult.data.slug) {
    revalidatePath(`/portfolio/${existingImage.slug}`);
  }

  return { status: "success", message: "Changes saved.", blockErrors: {} };
}

export async function deletePortfolioStory(imageId: string) {
  await requireAdmin();

  const portfolioImage = await prisma.portfolioImage.findUnique({
    where: { id: imageId },
    select: { slug: true, categoryId: true },
  });

  if (!portfolioImage) {
    return;
  }

  await prisma.portfolioStory.deleteMany({ where: { portfolioImageId: imageId } });

  revalidatePath(`/portfolio/${portfolioImage.slug}`);
  revalidatePath(`/admin/portfolio/images/${imageId}`);
  revalidatePath(`/admin/portfolio/${portfolioImage.categoryId}`);
  revalidatePath(`/admin/portfolio/${portfolioImage.categoryId}/edit`);
}
