"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { makeRoomForServiceDisplayOrder } from "@/src/lib/db/admin-services";
import { uploadServiceImage } from "@/src/lib/storage/cloudinary";
import type { NewServiceState } from "./types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createService(
  _previousState: NewServiceState,
  formData: FormData
): Promise<NewServiceState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const inclusionsRaw = String(formData.get("inclusions") ?? "");
  const displayOrderRaw = String(formData.get("displayOrder") ?? "");
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

  const baseSlug = slugify(title);

  if (!baseSlug) {
    return { error: "Title must contain at least one letter or number." };
  }

  const displayOrderInput = Number.parseInt(displayOrderRaw, 10);

  if (Number.isNaN(displayOrderInput) || displayOrderInput < 1) {
    return { error: "Display order must be 1 or greater." };
  }

  const displayOrder = displayOrderInput - 1;

  let slug = baseSlug;
  let suffix = 2;

  while (
    await prisma.service.findUnique({ where: { slug }, select: { id: true } })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const photoIds = formData.getAll("photoIds").map(String);
  const imageUrls: string[] = [];

  for (const photoId of photoIds) {
    const file = formData.get(`imageFile__${photoId}`);

    if (file instanceof File && file.size > 0) {
      const uploadResult = await uploadServiceImage(file);

      if (!uploadResult.ok) {
        return { error: uploadResult.error };
      }

      imageUrls.push(uploadResult.url);
    }
  }

  const inclusions = inclusionsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const service = await prisma.$transaction(async (tx) => {
    await makeRoomForServiceDisplayOrder(tx, displayOrder);

    return tx.service.create({
      data: {
        title,
        slug,
        category: category || null,
        description,
        imageUrls,
        price,
        inclusions,
        featured,
        active,
        displayOrder,
      },
      select: { id: true },
    });
  });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");

  redirect(`/admin/services/${service.id}`);
}
