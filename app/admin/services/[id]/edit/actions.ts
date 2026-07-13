"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { uploadServiceImage } from "@/src/lib/storage/cloudinary";
import type { EditServiceState } from "./types";

const PHOTO_SLOT_COUNT = 4;

export async function updateService(
  serviceId: string,
  _previousState: EditServiceState,
  formData: FormData
): Promise<EditServiceState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const inclusionsRaw = String(formData.get("inclusions") ?? "");
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";

  if (!title) {
    return { error: "Title is required." };
  }

  if (!description) {
    return { error: "Description is required." };
  }

  let price: number | null = null;

  if (priceRaw) {
    const parsedPrice = Number(priceRaw);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return { error: "Price must be a valid non-negative number." };
    }

    price = parsedPrice;
  }

  const existingService = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { imageUrls: true },
  });

  if (!existingService) {
    return { error: "Service not found." };
  }

  const imageUrls: (string | null)[] = [];

  for (let i = 0; i < PHOTO_SLOT_COUNT; i++) {
    const file = formData.get(`imageFile${i}`);
    const removeRequested = formData.get(`removePhoto${i}`) === "on";

    if (file instanceof File && file.size > 0) {
      const uploadResult = await uploadServiceImage(file);

      if (!uploadResult.ok) {
        return { error: uploadResult.error };
      }

      imageUrls.push(uploadResult.url);
    } else if (removeRequested) {
      imageUrls.push(null);
    } else {
      imageUrls.push(existingService.imageUrls[i] ?? null);
    }
  }

  const compactImageUrls = imageUrls.filter(
    (url): url is string => url !== null
  );

  const inclusions = inclusionsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      title,
      category: category || null,
      description,
      price,
      imageUrls: compactImageUrls,
      inclusions,
      featured,
      active,
    },
  });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${serviceId}`);

  redirect(`/admin/services/${serviceId}`);
}
