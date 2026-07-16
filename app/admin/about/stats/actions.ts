"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { saveAboutContent, type AboutStat } from "@/src/lib/db/about";
import type { EditAboutStatsState } from "./types";

function readStatsInput(formData: FormData): AboutStat[] {
  const ids = formData.getAll("statIds").map(String);

  return ids
    .map((id) => ({
      value: String(formData.get(`value__${id}`) ?? "").trim(),
      label: String(formData.get(`label__${id}`) ?? "").trim(),
    }))
    .filter((item) => item.value || item.label);
}

export async function updateAboutStats(
  _previousState: EditAboutStatsState,
  formData: FormData
): Promise<EditAboutStatsState> {
  await requireAdmin();

  const stats = readStatsInput(formData);

  if (stats.some((item) => !item.value || !item.label)) {
    return {
      error: "Each stat needs both a value and a label.",
      success: false,
    };
  }

  await saveAboutContent({ stats });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about/stats");

  return { error: null, success: true };
}
