"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
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
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const displayOrderRaw = String(formData.get("displayOrder") ?? "");

  if (!name) {
    return { error: "Title is required." };
  }

  const baseSlug = slugify(name);

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
    await prisma.portfolioCategory.findUnique({
      where: { slug },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
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
