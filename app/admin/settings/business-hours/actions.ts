"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveContactInfo } from "@/src/lib/db/contact";
import type { ContactInfo } from "@/src/types/site";
import type { EditBusinessHoursState } from "./types";

function readBusinessHoursInput(formData: FormData): ContactInfo["businessHours"] {
  const ids = formData.getAll("rowIds").map(String);

  return ids
    .map((id) => ({
      days: String(formData.get(`days__${id}`) ?? "").trim(),
      hours: String(formData.get(`hours__${id}`) ?? "").trim(),
    }))
    .filter((entry) => entry.days || entry.hours);
}

export async function updateBusinessHours(
  _previousState: EditBusinessHoursState,
  formData: FormData
): Promise<EditBusinessHoursState> {
  await requireAdmin();

  const businessHours = readBusinessHoursInput(formData);

  if (businessHours.some((entry) => !entry.days || !entry.hours)) {
    return {
      error: "Each business hours row needs both days and hours.",
      success: false,
    };
  }

  await saveContactInfo({ businessHours });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/admin/settings/business-hours");

  return { error: null, success: true };
}
