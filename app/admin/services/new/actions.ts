"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
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
  const imageFile = formData.get("imageFile");
  const highlightsRaw = String(formData.get("highlights") ?? "");
  const displayOrderRaw = String(formData.get("displayOrder") ?? "");
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";

  if (!title) {
    return { error: "Title is required." };
  }

  if (!description) {
    return { error: "Description is required." };
  }

  const baseSlug = slugify(title);

  if (!baseSlug) {
    return { error: "Title must contain at least one letter or number." };
  }

  const displayOrder = Number.parseInt(displayOrderRaw, 10);

  if (Number.isNaN(displayOrder)) {
    return { error: "Display order must be a number." };
  }

  let slug = baseSlug;
  let suffix = 2;

  while (
    await prisma.service.findUnique({ where: { slug }, select: { id: true } })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  let imageUrl: string | null = null;

  if (imageFile instanceof File && imageFile.size > 0) {
    const uploadResult = await uploadServiceImage(imageFile);

    if (!uploadResult.ok) {
      return { error: uploadResult.error };
    }

    imageUrl = uploadResult.url;
  }

  const highlights = highlightsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const service = await prisma.service.create({
    data: {
      title,
      slug,
      category: category || null,
      description,
      imageUrl,
      highlights,
      featured,
      active,
      displayOrder,
    },
    select: { id: true },
  });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");

  redirect(`/admin/services/${service.id}`);
}
