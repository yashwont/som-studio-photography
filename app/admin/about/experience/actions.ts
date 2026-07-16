"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveAboutContent, type AboutExperienceStep } from "@/src/lib/db/about";
import type { EditAboutExperienceState } from "./types";

function readExperienceStepsInput(formData: FormData): AboutExperienceStep[] {
  const ids = formData.getAll("stepIds").map(String);

  return ids
    .map((id) => ({
      title: String(formData.get(`title__${id}`) ?? "").trim(),
      description: String(formData.get(`description__${id}`) ?? "").trim(),
    }))
    .filter((item) => item.title || item.description);
}

export async function updateAboutExperience(
  _previousState: EditAboutExperienceState,
  formData: FormData
): Promise<EditAboutExperienceState> {
  await requireAdmin();

  const experienceEyebrow = String(formData.get("experienceEyebrow") ?? "").trim();
  const experienceTitle = String(formData.get("experienceTitle") ?? "").trim();
  const experienceSteps = readExperienceStepsInput(formData);

  if (experienceSteps.some((item) => !item.title || !item.description)) {
    return {
      error: "Each experience step needs both a title and a description.",
      success: false,
    };
  }

  await saveAboutContent({ experienceEyebrow, experienceTitle, experienceSteps });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about/experience");

  return { error: null, success: true };
}
