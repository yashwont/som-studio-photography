"use server";

import { redirect } from "next/navigation";
import { clearAdminSession } from "@/src/lib/auth/session";

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
