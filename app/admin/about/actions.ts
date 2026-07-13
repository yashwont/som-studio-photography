"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { ABOUT_CONTENT_ID } from "@/src/lib/db/about";
import type { EditAboutContentState } from "./types";

const HIGHLIGHT_COUNT = 4;

function readHighlightsInput(formData: FormData) {
  return Array.from({ length: HIGHLIGHT_COUNT }, (_, index) => ({
    title: String(formData.get(`highlight-${index}-title`) ?? "").trim(),
    description: String(
      formData.get(`highlight-${index}-description`) ?? ""
    ).trim(),
  }));
}

export async function updateAboutContent(
  _previousState: EditAboutContentState,
  formData: FormData
): Promise<EditAboutContentState> {
  await requireAdmin();

  const heroEyebrow = String(formData.get("heroEyebrow") ?? "").trim();
  const heroTitle = String(formData.get("heroTitle") ?? "").trim();
  const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
  const storyParagraph1 = String(formData.get("storyParagraph1") ?? "").trim();
  const storyParagraph2 = String(formData.get("storyParagraph2") ?? "").trim();
  const storyParagraph3 = String(formData.get("storyParagraph3") ?? "").trim();
  const highlightsEyebrow = String(formData.get("highlightsEyebrow") ?? "").trim();
  const highlightsTitle = String(formData.get("highlightsTitle") ?? "").trim();
  if (!heroTitle) {
    return { error: "Hero title is required.", success: false };
  }

  if (!storyParagraph1) {
    return { error: "At least the first story paragraph is required.", success: false };
  }

  const highlights = readHighlightsInput(formData);

  if (highlights.some((item) => !item.title || !item.description)) {
    return {
      error: "Each highlight card needs both a title and a description.",
      success: false,
    };
  }

  await prisma.aboutContent.upsert({
    where: { id: ABOUT_CONTENT_ID },
    update: {
      heroEyebrow,
      heroTitle,
      heroSubtitle,
      storyParagraph1,
      storyParagraph2,
      storyParagraph3,
      highlightsEyebrow,
      highlightsTitle,
      highlights,
    },
    create: {
      id: ABOUT_CONTENT_ID,
      heroEyebrow,
      heroTitle,
      heroSubtitle,
      storyParagraph1,
      storyParagraph2,
      storyParagraph3,
      highlightsEyebrow,
      highlightsTitle,
      highlights,
    },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about");

  return { error: null, success: true };
}
