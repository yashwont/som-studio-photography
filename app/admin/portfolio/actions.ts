"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";

export async function deleteCategory(categoryId: string) {
  await requireAdmin();

  await prisma.$transaction(async (tx) => {
    const category = await tx.portfolioCategory.findUnique({
      where: { id: categoryId },
      select: { displayOrder: true },
    });

    if (!category) {
      return;
    }

    await tx.portfolioCategory.delete({ where: { id: categoryId } });

    await tx.portfolioCategory.updateMany({
      where: { displayOrder: { gt: category.displayOrder } },
      data: { displayOrder: { decrement: 1 } },
    });
  });

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin/portfolio");

  redirect("/admin/portfolio");
}
