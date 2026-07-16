"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveHomeContent } from "@/src/lib/db/home";
import type { EditHomeHeroState } from "./types";

function readStringList(formData: FormData, idsKey: string, valuePrefix: string): string[] {
  const ids = formData.getAll(idsKey).map(String);

  return ids
    .map((id) => String(formData.get(`${valuePrefix}__${id}`) ?? "").trim())
    .filter(Boolean);
}

export async function updateHomeHero(
  _previousState: EditHomeHeroState,
  formData: FormData
): Promise<EditHomeHeroState> {
  await requireAdmin();

  const heroWelcomeText = String(formData.get("heroWelcomeText") ?? "").trim();
  const heroTrustPoints = readStringList(formData, "trustPointIds", "trustPoint");

  if (!heroWelcomeText) {
    return { error: "Welcome text is required.", success: false };
  }

  if (heroTrustPoints.length === 0) {
    return { error: "At least one trust point is required.", success: false };
  }

  await saveHomeContent({
    heroWelcomeText,
    heroTrustPoints,
  });

  revalidatePath("/");
  revalidatePath("/admin/home/hero");

  return { error: null, success: true };
}
