"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import type { EditPortfolioCategoryState } from "./types";

export async function updatePortfolioCategory(
  categoryId: string,
  _previousState: EditPortfolioCategoryState,
  formData: FormData
): Promise<EditPortfolioCategoryState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const displayOrderRaw = String(formData.get("displayOrder") ?? "");

  if (!name) {
    return { error: "Title is required." };
  }

  const displayOrder = Number.parseInt(displayOrderRaw, 10);

  if (Number.isNaN(displayOrder)) {
    return { error: "Display order must be a number." };
  }

  // The slug is set once at creation and stays stable here - it's used for the
  // public URL anchor and for matching services to a portfolio category, so
  // renaming the title should not silently change it.
  await prisma.portfolioCategory.update({
    where: { id: categoryId },
    data: {
      name,
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
