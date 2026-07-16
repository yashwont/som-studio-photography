"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveContactInfo } from "@/src/lib/db/contact";
import type { ContactInfo } from "@/src/types/site";
import type { EditSocialLinksState } from "./types";

function readSocialLinksInput(formData: FormData): ContactInfo["socialLinks"] {
  const ids = formData.getAll("linkIds").map(String);

  return ids
    .map((id) => ({
      platform: String(formData.get(`platform__${id}`) ?? "").trim(),
      label: String(formData.get(`label__${id}`) ?? "").trim(),
      href: String(formData.get(`href__${id}`) ?? "").trim(),
    }))
    .filter((link) => link.platform || link.label || link.href);
}

export async function updateSocialLinks(
  _previousState: EditSocialLinksState,
  formData: FormData
): Promise<EditSocialLinksState> {
  await requireAdmin();

  const socialLinks = readSocialLinksInput(formData);

  if (socialLinks.some((link) => !link.platform || !link.label || !link.href)) {
    return {
      error: "Each social link needs a platform, label, and URL.",
      success: false,
    };
  }

  await saveContactInfo({ socialLinks });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/admin/settings/social-links");

  return { error: null, success: true };
}
