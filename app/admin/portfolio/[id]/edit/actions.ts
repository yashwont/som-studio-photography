"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import type { EditPortfolioCategoryState } from "./types";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function updatePortfolioCategory(
  categoryId: string,
  _previousState: EditPortfolioCategoryState,
  formData: FormData
): Promise<EditPortfolioCategoryState> {
  await requireAdmin();

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

  const slugConflict = await prisma.portfolioCategory.findFirst({
    where: {
      slug,
      NOT: { id: categoryId },
    },
    select: { id: true },
  });

  if (slugConflict) {
    return { error: "Another category already uses this slug." };
  }

  await prisma.portfolioCategory.update({
    where: { id: categoryId },
    data: {
      name,
      slug,
      description: description || null,
      displayOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");
  revalidatePath(`/admin/portfolio/${categoryId}`);

  redirect(`/admin/portfolio/${categoryId}`);
}
