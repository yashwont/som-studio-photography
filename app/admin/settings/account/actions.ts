"use server";

import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { hashPassword, verifyPassword } from "@/src/lib/auth/password";
import type { ChangePasswordState } from "./types";

const MIN_PASSWORD_LENGTH = 8;

export async function updatePassword(
  _previousState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const admin = await requireAdmin();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword) {
    return { error: "Current password is required.", success: false };
  }

  if (!newPassword) {
    return { error: "New password is required.", success: false };
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      success: false,
    };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match.", success: false };
  }

  const currentPasswordMatches = await verifyPassword(currentPassword, admin.passwordHash);

  if (!currentPasswordMatches) {
    return { error: "Current password is incorrect.", success: false };
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  });

  return { error: null, success: true };
}
