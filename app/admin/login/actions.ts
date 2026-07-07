"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { verifyPassword } from "@/src/lib/auth/password";
import { setAdminSession } from "@/src/lib/auth/session";
import type { AdminLoginState } from "./types";

export async function loginAdmin(
  _previousState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Invalid email or password." };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!admin || !admin.active) {
    return { error: "Invalid email or password." };
  }

  const passwordMatches = await verifyPassword(password, admin.passwordHash);

  if (!passwordMatches) {
    return { error: "Invalid email or password." };
  }

  await setAdminSession(admin.id);
  redirect("/admin");
}
