"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveHomeContent } from "@/src/lib/db/home";
import type { EditHomeFinalCtaState } from "./types";

export async function updateHomeFinalCta(
  _previousState: EditHomeFinalCtaState,
  formData: FormData
): Promise<EditHomeFinalCtaState> {
  await requireAdmin();

  const ctaEyebrow = String(formData.get("ctaEyebrow") ?? "").trim();
  const ctaHeadline = String(formData.get("ctaHeadline") ?? "").trim();
  const ctaSubtitle = String(formData.get("ctaSubtitle") ?? "").trim();

  if (!ctaEyebrow || !ctaHeadline || !ctaSubtitle) {
    return { error: "All fields are required.", success: false };
  }

  await saveHomeContent({ ctaEyebrow, ctaHeadline, ctaSubtitle });

  revalidatePath("/");
  revalidatePath("/admin/home/final-cta");

  return { error: null, success: true };
}
