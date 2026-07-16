"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveContactInfo } from "@/src/lib/db/contact";
import type { EditFooterState } from "./types";

export async function updateFooter(
  _previousState: EditFooterState,
  formData: FormData
): Promise<EditFooterState> {
  await requireAdmin();

  const footerDescription = String(formData.get("footerDescription") ?? "").trim();

  if (!footerDescription) {
    return { error: "Footer description is required.", success: false };
  }

  await saveContactInfo({ footerDescription });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/admin/settings/footer");

  return { error: null, success: true };
}
