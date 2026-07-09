"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { uploadPortfolioImage } from "@/src/lib/storage/cloudinary";
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
  await requireAdmin();

  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const manualImageUrl = String(formData.get("imageUrl") ?? "").trim();
  const imageFile = formData.get("imageFile");
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

  let imageUrl = manualImageUrl;

  if (imageFile instanceof File && imageFile.size > 0) {
    const uploadResult = await uploadPortfolioImage(imageFile);

    if (!uploadResult.ok) {
      return { error: uploadResult.error };
    }

    imageUrl = uploadResult.url;
  }

  if (!imageUrl) {
    return { error: "Upload an image or provide an Image URL." };
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
