"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveContactInfo } from "@/src/lib/db/contact";
import type { EditMapInfoState } from "./types";

export async function updateMapInfo(
  _previousState: EditMapInfoState,
  formData: FormData
): Promise<EditMapInfoState> {
  await requireAdmin();

  const mapUrl = String(formData.get("mapUrl") ?? "").trim();
  const mapEmbedUrl = String(formData.get("mapEmbedUrl") ?? "").trim();

  await saveContactInfo({ mapUrl, mapEmbedUrl });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/admin/settings/map");

  return { error: null, success: true };
}
