"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveAboutContent } from "@/src/lib/db/about";
import type { EditAboutHeroState } from "./types";

export async function updateAboutHero(
  _previousState: EditAboutHeroState,
  formData: FormData
): Promise<EditAboutHeroState> {
  await requireAdmin();

  const heroEyebrow = String(formData.get("heroEyebrow") ?? "").trim();
  const heroTitle = String(formData.get("heroTitle") ?? "").trim();
  const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
  const quoteText = String(formData.get("quoteText") ?? "").trim();

  if (!heroTitle) {
    return { error: "Hero title is required.", success: false };
  }

  if (!quoteText) {
    return { error: "The hero quote is required.", success: false };
  }

  await saveAboutContent({ heroEyebrow, heroTitle, heroSubtitle, quoteText });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about/hero");

  return { error: null, success: true };
}
