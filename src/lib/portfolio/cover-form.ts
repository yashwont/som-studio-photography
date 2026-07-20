// Shared "cover card" (PortfolioImage scalar fields) parsing/validation, used by
// every place that creates or updates a portfolio image: the standalone image
// new/edit actions, and the combined category+image actions. Does not touch
// categoryId - callers own that (it's either a form field or implicit).
import { prisma } from "@/src/lib/prisma";
import { uploadPortfolioImage } from "@/src/lib/storage/cloudinary";

export interface CoverFieldValues {
  title: string;
  slug: string;
  imageUrl: string;
  altText: string;
  description: string | null;
  featured: boolean;
  active: boolean;
  displayOrder: number;
}

export type CoverFormResult =
  | { ok: true; data: CoverFieldValues }
  | { ok: false; message: string };

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function parseCoverForm(
  formData: FormData,
  options: { excludeImageId?: string } = {}
): Promise<CoverFormResult> {
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim() || title;
  const manualImageUrl = String(formData.get("imageUrl") ?? "").trim();
  const imageFile = formData.get("imageFile");
  const altText = String(formData.get("altText") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const displayOrderRaw = String(formData.get("displayOrder") ?? "");
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";

  if (!title) {
    return { ok: false, message: "Title is required." };
  }

  if (!altText) {
    return { ok: false, message: "Alt text is required." };
  }

  const slug = slugify(rawSlug);

  if (!slug) {
    return { ok: false, message: "Title must contain at least one letter or number." };
  }

  const displayOrder = Number.parseInt(displayOrderRaw, 10);

  if (Number.isNaN(displayOrder) || displayOrder < 1) {
    return { ok: false, message: "Display order must be 1 or greater." };
  }

  let imageUrl = manualImageUrl;

  if (imageFile instanceof File && imageFile.size > 0) {
    const uploadResult = await uploadPortfolioImage(imageFile);

    if (!uploadResult.ok) {
      return { ok: false, message: uploadResult.error };
    }

    imageUrl = uploadResult.url;
  }

  if (!imageUrl) {
    return { ok: false, message: "An image is required." };
  }

  const slugConflict = await prisma.portfolioImage.findFirst({
    where: options.excludeImageId
      ? { slug, NOT: { id: options.excludeImageId } }
      : { slug },
    select: { id: true },
  });

  if (slugConflict) {
    return {
      ok: false,
      message: options.excludeImageId
        ? "Another portfolio image already uses this slug."
        : "A portfolio image with this slug already exists.",
    };
  }

  return {
    ok: true,
    data: {
      title,
      slug,
      imageUrl,
      altText,
      description: description || null,
      featured,
      active,
      displayOrder: displayOrder - 1,
    },
  };
}
