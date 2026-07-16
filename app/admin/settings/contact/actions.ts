"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveContactInfo } from "@/src/lib/db/contact";
import type { EditContactDetailsState } from "./types";

export async function updateContactDetails(
  _previousState: EditContactDetailsState,
  formData: FormData
): Promise<EditContactDetailsState> {
  await requireAdmin();

  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();

  if (!phone) {
    return { error: "Phone number is required.", success: false };
  }

  if (!whatsapp) {
    return { error: "WhatsApp number is required.", success: false };
  }

  if (!email) {
    return { error: "Email is required.", success: false };
  }

  if (!address || !city || !country) {
    return { error: "Address, city, and country are all required.", success: false };
  }

  await saveContactInfo({ phone, whatsapp, email, address, city, country });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/admin/settings/contact");

  return { error: null, success: true };
}
