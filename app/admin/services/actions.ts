"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";

export async function deleteService(serviceId: string) {
  await requireAdmin();

  await prisma.service.delete({ where: { id: serviceId } });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/services");

  redirect("/admin/services");
}
