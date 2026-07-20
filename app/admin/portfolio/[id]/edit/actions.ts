"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { parseCoverForm } from "@/src/lib/portfolio/cover-form";
import { isStoryFormEmpty, parseStoryForm } from "@/src/lib/portfolio/story-form";
import type { PortfolioImageFormState } from "../../images/_shared/types";

export async function saveCategoryWithImage(
  categoryId: string,
  _previousState: PortfolioImageFormState,
  formData: FormData
): Promise<PortfolioImageFormState> {
  await requireAdmin();

  const category = await prisma.portfolioCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    return { status: "error", message: "Portfolio story no longer exists.", blockErrors: {} };
  }

  const categoryName = String(formData.get("categoryName") ?? "").trim();
  const categoryDescription = String(formData.get("categoryDescription") ?? "").trim();
  const categoryDisplayOrderRaw = String(formData.get("categoryDisplayOrder") ?? "");
  const existingImageId = String(formData.get("imageId") ?? "").trim() || null;

  if (!categoryName) {
    return { status: "error", message: "Title is required.", blockErrors: {} };
  }

  const categoryDisplayOrder = Number.parseInt(categoryDisplayOrderRaw, 10);

  if (Number.isNaN(categoryDisplayOrder) || categoryDisplayOrder < 1) {
    return {
      status: "error",
      message: "Display order must be 1 or greater.",
      blockErrors: {},
    };
  }

  const coverResult = await parseCoverForm(
    formData,
    existingImageId ? { excludeImageId: existingImageId } : {}
  );

  if (!coverResult.ok) {
    return { status: "error", message: coverResult.message, blockErrors: {} };
  }

  const storyResult = await parseStoryForm(formData, { includeSeo: false });

  if (!storyResult.ok) {
    return { status: "error", message: storyResult.message, blockErrors: storyResult.blockErrors };
  }

  const existingStory = existingImageId
    ? await prisma.portfolioStory.findUnique({
        where: { portfolioImageId: existingImageId },
        select: { id: true },
      })
    : null;
  const shouldWriteStory =
    Boolean(existingStory) || !isStoryFormEmpty(storyResult.fields, storyResult.blocks);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.portfolioCategory.update({
        where: { id: categoryId },
        data: {
          name: categoryName,
          description: categoryDescription || null,
          displayOrder: categoryDisplayOrder - 1,
        },
      });

      const image = existingImageId
        ? await tx.portfolioImage.update({
            where: { id: existingImageId },
            data: coverResult.data,
            select: { id: true },
          })
        : await tx.portfolioImage.create({
            data: { categoryId, ...coverResult.data },
            select: { id: true },
          });

      if (shouldWriteStory) {
        const story = await tx.portfolioStory.upsert({
          where: { portfolioImageId: image.id },
          create: { portfolioImageId: image.id, ...storyResult.fields },
          update: {
            overviewEyebrow: storyResult.fields.overviewEyebrow,
            overviewHeading: storyResult.fields.overviewHeading,
            overviewParagraphs: storyResult.fields.overviewParagraphs,
            heroEyebrow: storyResult.fields.heroEyebrow,
            studio: storyResult.fields.studio,
            service: storyResult.fields.service,
            location: storyResult.fields.location,
            style: storyResult.fields.style,
            setting: storyResult.fields.setting,
            ctaEyebrow: storyResult.fields.ctaEyebrow,
            ctaHeading: storyResult.fields.ctaHeading,
            ctaBody: storyResult.fields.ctaBody,
            primaryCtaLabel: storyResult.fields.primaryCtaLabel,
            secondaryCtaLabel: storyResult.fields.secondaryCtaLabel,
          },
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
  revalidatePath(`/admin/portfolio/${categoryId}`);

  // A brand-new image was just created for this category - redirect back to this
  // same edit page so the reload picks up its real id (the hidden `imageId` field
  // would otherwise still be empty on the next save, creating a duplicate image).
  if (!existingImageId) {
    redirect(`/admin/portfolio/${categoryId}/edit`);
  }

  return { status: "success", message: "Changes saved.", blockErrors: {} };
}
