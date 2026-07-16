"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveAboutContent } from "@/src/lib/db/about";
import type { EditAboutStoryState } from "./types";

export async function updateAboutStory(
  _previousState: EditAboutStoryState,
  formData: FormData
): Promise<EditAboutStoryState> {
  await requireAdmin();

  const storyParagraph1 = String(formData.get("storyParagraph1") ?? "").trim();
  const storyParagraph2 = String(formData.get("storyParagraph2") ?? "").trim();
  const storyParagraph3 = String(formData.get("storyParagraph3") ?? "").trim();

  if (!storyParagraph1) {
    return { error: "At least the first story paragraph is required.", success: false };
  }

  await saveAboutContent({ storyParagraph1, storyParagraph2, storyParagraph3 });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about/story");

  return { error: null, success: true };
}
