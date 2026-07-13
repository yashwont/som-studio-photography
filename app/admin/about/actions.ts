"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { ABOUT_CONTENT_ID } from "@/src/lib/db/about";
import type { EditAboutContentState } from "./types";

function parseHighlightsInput(raw: string) {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line) => {
    const [title, ...rest] = line.split("|");
    return {
      title: title.trim(),
      description: rest.join("|").trim(),
    };
  });
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
  const highlightsRaw = String(formData.get("highlights") ?? "");
  const ctaEyebrow = String(formData.get("ctaEyebrow") ?? "").trim();
  const ctaTitle = String(formData.get("ctaTitle") ?? "").trim();
  const ctaDescription = String(formData.get("ctaDescription") ?? "").trim();
  const ctaButtonLabel = String(formData.get("ctaButtonLabel") ?? "").trim();

  if (!heroTitle) {
    return { error: "Hero title is required.", success: false };
  }

  if (!storyParagraph1) {
    return { error: "At least the first story paragraph is required.", success: false };
  }

  if (!ctaTitle) {
    return { error: "CTA title is required.", success: false };
  }

  if (!ctaButtonLabel) {
    return { error: "CTA button label is required.", success: false };
  }

  const highlights = parseHighlightsInput(highlightsRaw);

  if (highlights.some((item) => !item.title || !item.description)) {
    return {
      error: "Each highlight line must be in the format \"Title | Description\".",
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
      ctaEyebrow,
      ctaTitle,
      ctaDescription,
      ctaButtonLabel,
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
      ctaEyebrow,
      ctaTitle,
      ctaDescription,
      ctaButtonLabel,
    },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about");

  return { error: null, success: true };
}
