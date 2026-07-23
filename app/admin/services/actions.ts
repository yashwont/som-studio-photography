"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";

export async function deleteService(serviceId: string) {
  await requireAdmin();

  await prisma.$transaction(async (tx) => {
    const service = await tx.service.findUnique({
      where: { id: serviceId },
      select: { displayOrder: true },
    });

    if (!service) {
      return;
    }

    await tx.service.delete({ where: { id: serviceId } });

    await tx.service.updateMany({
      where: { displayOrder: { gt: service.displayOrder } },
      data: { displayOrder: { decrement: 1 } },
    });
  });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/admin/services");
  revalidatePath("/admin/portfolio");

  redirect("/admin/services");
}
