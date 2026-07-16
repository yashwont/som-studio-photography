"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";

export async function deletePortfolioImage(imageId: string) {
  await requireAdmin();

  const result = await prisma.$transaction(async (tx) => {
    const image = await tx.portfolioImage.findUnique({
      where: { id: imageId },
      select: { displayOrder: true, categoryId: true, slug: true },
    });

    if (!image) {
      return null;
    }

    await tx.portfolioImage.delete({ where: { id: imageId } });

    await tx.portfolioImage.updateMany({
      where: { categoryId: image.categoryId, displayOrder: { gt: image.displayOrder } },
      data: { displayOrder: { decrement: 1 } },
    });

    return image;
  });

  if (!result) {
    redirect("/admin/portfolio");
  }

  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${result.slug}`);
  revalidatePath("/admin/portfolio");
  revalidatePath(`/admin/portfolio/${result.categoryId}`);
  revalidatePath(`/admin/portfolio/${result.categoryId}/edit`);

  redirect(`/admin/portfolio/${result.categoryId}/edit`);
}
