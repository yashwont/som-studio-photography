"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveContactInfo } from "@/src/lib/db/contact";
import type { EditAfterInquiryState } from "./types";

export async function updateAfterInquiry(
  _previousState: EditAfterInquiryState,
  formData: FormData
): Promise<EditAfterInquiryState> {
  await requireAdmin();

  const steps: [string, string, string] = [
    String(formData.get("step1") ?? "").trim(),
    String(formData.get("step2") ?? "").trim(),
    String(formData.get("step3") ?? "").trim(),
  ];

  if (steps.some((step) => !step)) {
    return { error: "All three steps are required.", success: false };
  }

  await saveContactInfo({ afterInquirySteps: steps });

  revalidatePath("/contact");
  revalidatePath("/admin/settings/after-inquiry");

  return { error: null, success: true };
}
