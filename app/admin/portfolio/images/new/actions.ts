"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import type { NewPortfolioImageState } from "./types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createPortfolioImage(
  _previousState: NewPortfolioImageState,
  formData: FormData
): Promise<NewPortfolioImageState> {
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

  const category = await prisma.portfolioCategory.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

  if (!category) {
    return { error: "Selected category does not exist." };
  }

  const slugConflict = await prisma.portfolioImage.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (slugConflict) {
    return { error: "A portfolio image with this slug already exists." };
  }

  const image = await prisma.portfolioImage.create({
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
    select: { id: true },
  });

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${slug}`);
  revalidatePath("/admin/portfolio");
  revalidatePath("/admin/portfolio/images");
  revalidatePath(`/admin/portfolio/${categoryId}`);

  redirect(`/admin/portfolio/images/${image.id}`);
}
