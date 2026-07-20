"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { STORY_FIELD_MAX_LENGTHS } from "@/src/lib/portfolio/story-blocks";
import type { PortfolioSeoFormState } from "./types";

function trimmed(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optional(value: string): string | null {
  return value ? value : null;
}

export async function updatePortfolioSeo(
  imageId: string,
  _previousState: PortfolioSeoFormState,
  formData: FormData
): Promise<PortfolioSeoFormState> {
  await requireAdmin();

  const seoTitle = trimmed(formData, "seoTitle");
  const seoDescription = trimmed(formData, "seoDescription");

  if (seoTitle.length > STORY_FIELD_MAX_LENGTHS.seoTitle) {
    return {
      status: "error",
      message: `SEO title must be under ${STORY_FIELD_MAX_LENGTHS.seoTitle} characters.`,
    };
  }

  if (seoDescription.length > STORY_FIELD_MAX_LENGTHS.seoDescription) {
    return {
      status: "error",
      message: `Meta description must be under ${STORY_FIELD_MAX_LENGTHS.seoDescription} characters.`,
    };
  }

  const image = await prisma.portfolioImage.findUnique({
    where: { id: imageId },
    select: { slug: true, categoryId: true },
  });

  if (!image) {
    return { status: "error", message: "Portfolio image no longer exists." };
  }

  try {
    await prisma.portfolioStory.upsert({
      where: { portfolioImageId: imageId },
      create: {
        portfolioImageId: imageId,
        seoTitle: optional(seoTitle),
        seoDescription: optional(seoDescription),
      },
      update: {
        seoTitle: optional(seoTitle),
        seoDescription: optional(seoDescription),
      },
    });
  } catch {
    return { status: "error", message: "Failed to save SEO. Please try again." };
  }

  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${image.slug}`);
  revalidatePath("/admin/portfolio");
  revalidatePath("/admin/portfolio/seo");
  revalidatePath(`/admin/portfolio/images/${imageId}`);
  revalidatePath(`/admin/portfolio/images/${imageId}/seo`);
  revalidatePath(`/admin/portfolio/${image.categoryId}`);
  revalidatePath(`/admin/portfolio/${image.categoryId}/edit`);

  return { status: "success", message: "SEO saved." };
}
