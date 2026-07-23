"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { uploadServiceImage } from "@/src/lib/storage/cloudinary";
import type { PortfolioGalleryState } from "./types";

function revalidatePortfolioGalleryPaths(service: { id: string; slug: string }) {
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${service.slug}`);
  revalidatePath("/admin/portfolio");
  revalidatePath("/admin/portfolio/gallery");
  revalidatePath(`/admin/services/${service.id}`);
  revalidatePath(`/admin/services/${service.id}/edit`);
}

async function collectUploadedImageUrls(
  formData: FormData
): Promise<{ ok: true; imageUrls: string[] } | { ok: false; error: string }> {
  const photoIds = formData.getAll("photoIds").map(String);
  const imageUrls: string[] = [];

  for (const photoId of photoIds) {
    const file = formData.get(`imageFile__${photoId}`);
    const existingUrl = String(
      formData.get(`existingUrl__${photoId}`) ?? ""
    ).trim();

    if (file instanceof File && file.size > 0) {
      const uploadResult = await uploadServiceImage(file);

      if (!uploadResult.ok) {
        return { ok: false, error: uploadResult.error };
      }

      imageUrls.push(uploadResult.url);
    } else if (existingUrl) {
      imageUrls.push(existingUrl);
    }
  }

  return { ok: true, imageUrls };
}

export async function updatePortfolioGallery(
  serviceId: string,
  _previousState: PortfolioGalleryState,
  formData: FormData
): Promise<PortfolioGalleryState> {
  await requireAdmin();

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true, slug: true },
  });

  if (!service) {
    return { error: "Portfolio category not found.", success: null };
  }

  const galleryIntro = String(formData.get("galleryIntro") ?? "").trim();
  const galleryClosing = String(formData.get("galleryClosing") ?? "").trim();

  const topFile = formData.get("topImageFile");
  const topExistingUrl = String(formData.get("topExistingUrl") ?? "").trim();
  let topImageUrl: string | null = null;

  if (topFile instanceof File && topFile.size > 0) {
    const uploadResult = await uploadServiceImage(topFile);

    if (!uploadResult.ok) {
      return { error: uploadResult.error, success: null };
    }

    topImageUrl = uploadResult.url;
  } else if (topExistingUrl) {
    topImageUrl = topExistingUrl;
  }

  const uploaded = await collectUploadedImageUrls(formData);

  if (!uploaded.ok) {
    return { error: uploaded.error, success: null };
  }

  const imageUrls = topImageUrl
    ? [topImageUrl, ...uploaded.imageUrls]
    : uploaded.imageUrls;

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      imageUrls,
      galleryIntro: galleryIntro || null,
      galleryClosing: galleryClosing || null,
    },
  });

  revalidatePortfolioGalleryPaths(service);

  return { error: null, success: "Gallery saved." };
}

export async function deletePortfolioGallery(serviceId: string) {
  await requireAdmin();

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true, slug: true },
  });

  if (!service) {
    return;
  }

  await prisma.service.update({
    where: { id: serviceId },
    data: { imageUrls: [] },
  });

  revalidatePortfolioGalleryPaths(service);
}
