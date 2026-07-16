"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveAboutContent, type AboutHighlight } from "@/src/lib/db/about";
import type { EditAboutHighlightsState } from "./types";

function readHighlightsInput(formData: FormData): AboutHighlight[] {
  const ids = formData.getAll("highlightIds").map(String);

  return ids
    .map((id) => ({
      title: String(formData.get(`title__${id}`) ?? "").trim(),
      description: String(formData.get(`description__${id}`) ?? "").trim(),
    }))
    .filter((item) => item.title || item.description);
}

export async function updateAboutHighlights(
  _previousState: EditAboutHighlightsState,
  formData: FormData
): Promise<EditAboutHighlightsState> {
  await requireAdmin();

  const highlightsEyebrow = String(formData.get("highlightsEyebrow") ?? "").trim();
  const highlightsTitle = String(formData.get("highlightsTitle") ?? "").trim();
  const highlights = readHighlightsInput(formData);

  if (highlights.some((item) => !item.title || !item.description)) {
    return {
      error: "Each highlight card needs both a title and a description.",
      success: false,
    };
  }

  await saveAboutContent({ highlightsEyebrow, highlightsTitle, highlights });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about/highlights");

  return { error: null, success: true };
}
