"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { parseCoverForm, slugify } from "@/src/lib/portfolio/cover-form";
import { isStoryFormEmpty, parseStoryForm } from "@/src/lib/portfolio/story-form";
import type { PortfolioImageFormState } from "../images/_shared/types";

async function generateUniqueCategorySlug(name: string): Promise<string | null> {
  const baseSlug = slugify(name);

  if (!baseSlug) {
    return null;
  }

  let slug = baseSlug;
  let suffix = 2;

  while (
    await prisma.portfolioCategory.findUnique({ where: { slug }, select: { id: true } })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function createCategoryWithImage(
  _previousState: PortfolioImageFormState,
  formData: FormData
): Promise<PortfolioImageFormState> {
  await requireAdmin();

  const categoryName = String(formData.get("categoryName") ?? "").trim();
  const categoryDescription = String(formData.get("categoryDescription") ?? "").trim();
  const categoryDisplayOrderRaw = String(formData.get("categoryDisplayOrder") ?? "");

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

  const categorySlug = await generateUniqueCategorySlug(categoryName);

  if (!categorySlug) {
    return {
      status: "error",
      message: "Title must contain at least one letter or number.",
      blockErrors: {},
    };
  }

  const coverResult = await parseCoverForm(formData);

  if (!coverResult.ok) {
    return { status: "error", message: coverResult.message, blockErrors: {} };
  }

  const storyResult = await parseStoryForm(formData, { includeSeo: false });

  if (!storyResult.ok) {
    return { status: "error", message: storyResult.message, blockErrors: storyResult.blockErrors };
  }

  let newCategoryId: string;

  try {
    newCategoryId = await prisma.$transaction(async (tx) => {
      const category = await tx.portfolioCategory.create({
        data: {
          name: categoryName,
          slug: categorySlug,
          description: categoryDescription || null,
          displayOrder: categoryDisplayOrder - 1,
        },
        select: { id: true },
      });

      const image = await tx.portfolioImage.create({
        data: { categoryId: category.id, ...coverResult.data },
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

      return category.id;
    });
  } catch {
    return { status: "error", message: "Failed to create. Please try again.", blockErrors: {} };
  }

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${coverResult.data.slug}`);
  revalidatePath("/admin/portfolio");

  redirect(`/admin/portfolio/${newCategoryId}`);
}
