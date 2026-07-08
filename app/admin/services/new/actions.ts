"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
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

  const slugConflict = await prisma.service.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (slugConflict) {
    return { error: "A service with this slug already exists." };
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
      shortDescription,
      fullDescription: fullDescription || null,
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
