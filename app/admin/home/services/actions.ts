"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveHomeContent, type HomeServiceCard } from "@/src/lib/db/home";
import type { EditHomeServicesState } from "./types";

function readServiceCards(formData: FormData): HomeServiceCard[] {
  const ids = formData.getAll("cardIds").map(String);

  return ids
    .map((id) => ({
      title: String(formData.get(`cardTitle__${id}`) ?? "").trim(),
      tagline: String(formData.get(`cardTagline__${id}`) ?? "").trim(),
    }))
    .filter((item) => item.title || item.tagline);
}

export async function updateHomeServices(
  _previousState: EditHomeServicesState,
  formData: FormData
): Promise<EditHomeServicesState> {
  await requireAdmin();

  const servicesEyebrow = String(formData.get("servicesEyebrow") ?? "").trim();
  const servicesTitle = String(formData.get("servicesTitle") ?? "").trim();
  const servicesSubtitle = String(formData.get("servicesSubtitle") ?? "").trim();
  const serviceCards = readServiceCards(formData);

  if (!servicesEyebrow || !servicesTitle || !servicesSubtitle) {
    return { error: "Eyebrow, title, and subtitle are all required.", success: false };
  }

  if (serviceCards.length === 0) {
    return { error: "At least one service card is required.", success: false };
  }

  if (serviceCards.some((item) => !item.title || !item.tagline)) {
    return { error: "Each service card needs both a title and a tagline.", success: false };
  }

  await saveHomeContent({
    servicesEyebrow,
    servicesTitle,
    servicesSubtitle,
    serviceCards,
  });

  revalidatePath("/");
  revalidatePath("/admin/home/services");

  return { error: null, success: true };
}
