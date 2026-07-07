import type { AdminUser } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { getAdminSession } from "./session";

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const session = await getAdminSession();

  if (!session) {
    return null;
  }

  return prisma.adminUser.findFirst({
    where: {
      id: session.adminId,
      active: true,
    },
  });
}

export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}
