"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { parseCoverForm } from "@/src/lib/portfolio/cover-form";
import { isStoryFormEmpty, parseStoryForm } from "@/src/lib/portfolio/story-form";
import type { PortfolioImageFormState } from "../_shared/types";

export async function createPortfolioImageWithStory(
  _previousState: PortfolioImageFormState,
  formData: FormData
): Promise<PortfolioImageFormState> {
  await requireAdmin();

  const categoryId = String(formData.get("categoryId") ?? "").trim();

  if (!categoryId) {
    return { status: "error", message: "Category is required.", blockErrors: {} };
  }

  const coverResult = await parseCoverForm(formData);

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

  try {
    await prisma.$transaction(async (tx) => {
      const image = await tx.portfolioImage.create({
        data: { categoryId, ...coverResult.data },
        select: { id: true },
      });

      if (!isStoryFormEmpty(storyResult.fields, storyResult.blocks)) {
        const story = await tx.portfolioStory.create({
          data: { portfolioImageId: image.id, ...storyResult.fields },
          select: { id: true },
        });

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
    return { status: "error", message: "Failed to create. Please try again.", blockErrors: {} };
  }

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${coverResult.data.slug}`);
  revalidatePath("/admin/portfolio");
  revalidatePath(`/admin/portfolio/${categoryId}`);
  revalidatePath(`/admin/portfolio/${categoryId}/edit`);

  // Every image is now created inline on its category's edit page (the
  // "+ Add another image" card) - land back there so the new image shows up
  // in the list, instead of the old standalone image view page.
  redirect(`/admin/portfolio/${categoryId}/edit`);
}
