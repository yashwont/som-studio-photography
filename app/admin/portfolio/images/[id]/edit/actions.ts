"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import type { EditPortfolioImageState } from "./types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function updatePortfolioImage(
  imageId: string,
  _previousState: EditPortfolioImageState,
  formData: FormData
): Promise<EditPortfolioImageState> {
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const altText = String(formData.get("altText") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const displayOrderRaw = String(formData.get("displayOrder") ?? "");
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";

  if (!categoryId) {
    return { error: "Category is required." };
  }

  if (!title) {
    return { error: "Title is required." };
  }

  if (!rawSlug) {
    return { error: "Slug is required." };
  }

  if (!imageUrl) {
    return { error: "Image URL is required." };
  }

  if (!altText) {
    return { error: "Alt text is required." };
  }

  const slug = slugify(rawSlug);

  if (!slug) {
    return { error: "Slug must contain at least one letter or number." };
  }

  const displayOrder = Number.parseInt(displayOrderRaw, 10);

  if (Number.isNaN(displayOrder)) {
    return { error: "Display order must be a number." };
  }

  const existingImage = await prisma.portfolioImage.findUnique({
    where: { id: imageId },
    select: { slug: true, categoryId: true },
  });

  if (!existingImage) {
    return { error: "Portfolio image no longer exists." };
  }

  const category = await prisma.portfolioCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    return { error: "Selected category does not exist." };
  }

  const slugConflict = await prisma.portfolioImage.findFirst({
    where: {
      slug,
      NOT: { id: imageId },
    },
    select: { id: true },
  });

  if (slugConflict) {
    return { error: "Another portfolio image already uses this slug." };
  }

  await prisma.portfolioImage.update({
    where: { id: imageId },
    data: {
      categoryId,
      title,
      slug,
      imageUrl,
      altText,
      description: description || null,
      featured,
      active,
      displayOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${slug}`);
  revalidatePath("/admin/portfolio");
  revalidatePath("/admin/portfolio/images");
  revalidatePath(`/admin/portfolio/images/${imageId}`);
  revalidatePath(`/admin/portfolio/${categoryId}`);

  if (existingImage.categoryId !== categoryId) {
    revalidatePath(`/admin/portfolio/${existingImage.categoryId}`);
  }

  if (existingImage.slug !== slug) {
    revalidatePath(`/portfolio/${existingImage.slug}`);
  }

  redirect(`/admin/portfolio/images/${imageId}`);
}
