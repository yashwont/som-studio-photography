"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import type { NewPortfolioCategoryState } from "./types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createPortfolioCategory(
  _previousState: NewPortfolioCategoryState,
  formData: FormData
): Promise<NewPortfolioCategoryState> {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const displayOrderRaw = String(formData.get("displayOrder") ?? "");

  if (!name) {
    return { error: "Name is required." };
  }

  if (!rawSlug) {
    return { error: "Slug is required." };
  }

  const slug = slugify(rawSlug);

  if (!slug) {
    return { error: "Slug must contain at least one letter or number." };
  }

  const displayOrder = Number.parseInt(displayOrderRaw, 10);

  if (Number.isNaN(displayOrder)) {
    return { error: "Display order must be a number." };
  }

  const slugConflict = await prisma.portfolioCategory.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (slugConflict) {
    return { error: "A portfolio category with this slug already exists." };
  }

  const category = await prisma.portfolioCategory.create({
    data: {
      name,
      slug,
      description: description || null,
      displayOrder,
    },
    select: { id: true },
  });

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");

  redirect(`/admin/portfolio/${category.id}`);
}
