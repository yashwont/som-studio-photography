"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveHomeContent, type HomeHighlight } from "@/src/lib/db/home";
import type { EditHomeAboutTeaserState } from "./types";

function readHighlights(formData: FormData): HomeHighlight[] {
  const ids = formData.getAll("highlightIds").map(String);

  return ids
    .map((id) => ({
      title: String(formData.get(`title__${id}`) ?? "").trim(),
      description: String(formData.get(`description__${id}`) ?? "").trim(),
    }))
    .filter((item) => item.title || item.description);
}

export async function updateHomeAboutTeaser(
  _previousState: EditHomeAboutTeaserState,
  formData: FormData
): Promise<EditHomeAboutTeaserState> {
  await requireAdmin();

  const aboutParagraph = String(formData.get("aboutParagraph") ?? "").trim();
  const aboutLocationTag = String(formData.get("aboutLocationTag") ?? "").trim();
  const aboutHighlights = readHighlights(formData);

  if (!aboutParagraph || !aboutLocationTag) {
    return { error: "All fields are required.", success: false };
  }

  if (aboutHighlights.length === 0) {
    return { error: "At least one highlight card is required.", success: false };
  }

  if (aboutHighlights.some((item) => !item.title || !item.description)) {
    return {
      error: "Each highlight card needs both a title and a description.",
      success: false,
    };
  }

  await saveHomeContent({
    aboutParagraph,
    aboutLocationTag,
    aboutHighlights,
  });

  revalidatePath("/");
  revalidatePath("/admin/home/about-teaser");

  return { error: null, success: true };
}
