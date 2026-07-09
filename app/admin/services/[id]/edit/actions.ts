"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import type { EditServiceState } from "./types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function updateService(
  serviceId: string,
  _previousState: EditServiceState,
  formData: FormData
): Promise<EditServiceState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const fullDescription = String(formData.get("fullDescription") ?? "").trim();
  const highlightsRaw = String(formData.get("highlights") ?? "");
  const displayOrderRaw = String(formData.get("displayOrder") ?? "");
  const featured = formData.get("featured") === "on";
  const active = formData.get("active") === "on";

  if (!title) {
    return { error: "Title is required." };
  }

  if (!rawSlug) {
    return { error: "Slug is required." };
  }

  if (!shortDescription) {
    return { error: "Short description is required." };
  }

  const slug = slugify(rawSlug);

  if (!slug) {
    return { error: "Slug must contain at least one letter or number." };
  }

  const displayOrder = Number.parseInt(displayOrderRaw, 10);

  if (Number.isNaN(displayOrder)) {
    return { error: "Display order must be a number." };
  }

  const slugConflict = await prisma.service.findFirst({
    where: {
      slug,
      NOT: { id: serviceId },
    },
    select: { id: true },
  });

  if (slugConflict) {
    return { error: "Another service already uses this slug." };
  }

  const highlights = highlightsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      title,
      slug,
      category: category || null,
      shortDescription,
      fullDescription: fullDescription || null,
      highlights,
      featured,
      active,
      displayOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${serviceId}`);

  redirect(`/admin/services/${serviceId}`);
}
