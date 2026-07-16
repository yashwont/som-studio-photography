"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveAboutContent, type AboutTimelineItem } from "@/src/lib/db/about";
import type { EditAboutTimelineState } from "./types";

function readTimelineInput(formData: FormData): AboutTimelineItem[] {
  const ids = formData.getAll("milestoneIds").map(String);

  return ids
    .map((id) => ({
      year: String(formData.get(`year__${id}`) ?? "").trim(),
      title: String(formData.get(`title__${id}`) ?? "").trim(),
      description: String(formData.get(`description__${id}`) ?? "").trim(),
    }))
    .filter((item) => item.year || item.title || item.description);
}

export async function updateAboutTimeline(
  _previousState: EditAboutTimelineState,
  formData: FormData
): Promise<EditAboutTimelineState> {
  await requireAdmin();

  const timelineEyebrow = String(formData.get("timelineEyebrow") ?? "").trim();
  const timelineTitle = String(formData.get("timelineTitle") ?? "").trim();
  const timeline = readTimelineInput(formData);

  if (timeline.some((item) => !item.year || !item.title || !item.description)) {
    return {
      error: "Each timeline milestone needs a year, title, and description.",
      success: false,
    };
  }

  await saveAboutContent({ timelineEyebrow, timelineTitle, timeline });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about/timeline");

  return { error: null, success: true };
}
