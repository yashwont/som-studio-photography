"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { ABOUT_CONTENT_ID } from "@/src/lib/db/about";
import type { EditAboutContentState } from "./types";

const HIGHLIGHT_COUNT = 4;
const TIMELINE_COUNT = 4;
const EXPERIENCE_STEP_COUNT = 5;
const STAT_COUNT = 4;

function readHighlightsInput(formData: FormData) {
  return Array.from({ length: HIGHLIGHT_COUNT }, (_, index) => ({
    title: String(formData.get(`highlight-${index}-title`) ?? "").trim(),
    description: String(
      formData.get(`highlight-${index}-description`) ?? ""
    ).trim(),
  }));
}

function readTimelineInput(formData: FormData) {
  return Array.from({ length: TIMELINE_COUNT }, (_, index) => ({
    year: String(formData.get(`timeline-${index}-year`) ?? "").trim(),
    title: String(formData.get(`timeline-${index}-title`) ?? "").trim(),
    description: String(
      formData.get(`timeline-${index}-description`) ?? ""
    ).trim(),
  }));
}

function readExperienceStepsInput(formData: FormData) {
  return Array.from({ length: EXPERIENCE_STEP_COUNT }, (_, index) => ({
    title: String(formData.get(`experience-${index}-title`) ?? "").trim(),
    description: String(
      formData.get(`experience-${index}-description`) ?? ""
    ).trim(),
  }));
}

function readStatsInput(formData: FormData) {
  return Array.from({ length: STAT_COUNT }, (_, index) => ({
    value: String(formData.get(`stat-${index}-value`) ?? "").trim(),
    label: String(formData.get(`stat-${index}-label`) ?? "").trim(),
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
  const quoteText = String(formData.get("quoteText") ?? "").trim();
  const storyParagraph1 = String(formData.get("storyParagraph1") ?? "").trim();
  const storyParagraph2 = String(formData.get("storyParagraph2") ?? "").trim();
  const storyParagraph3 = String(formData.get("storyParagraph3") ?? "").trim();
  const timelineEyebrow = String(formData.get("timelineEyebrow") ?? "").trim();
  const timelineTitle = String(formData.get("timelineTitle") ?? "").trim();
  const highlightsEyebrow = String(formData.get("highlightsEyebrow") ?? "").trim();
  const highlightsTitle = String(formData.get("highlightsTitle") ?? "").trim();
  const experienceEyebrow = String(formData.get("experienceEyebrow") ?? "").trim();
  const experienceTitle = String(formData.get("experienceTitle") ?? "").trim();

  if (!heroTitle) {
    return { error: "Hero title is required.", success: false };
  }

  if (!storyParagraph1) {
    return { error: "At least the first story paragraph is required.", success: false };
  }

  if (!quoteText) {
    return { error: "The hero quote is required.", success: false };
  }

  const highlights = readHighlightsInput(formData);

  if (highlights.some((item) => !item.title || !item.description)) {
    return {
      error: "Each highlight card needs both a title and a description.",
      success: false,
    };
  }

  const timeline = readTimelineInput(formData);

  if (timeline.some((item) => !item.year || !item.title || !item.description)) {
    return {
      error: "Each timeline milestone needs a year, title, and description.",
      success: false,
    };
  }

  const experienceSteps = readExperienceStepsInput(formData);

  if (experienceSteps.some((item) => !item.title || !item.description)) {
    return {
      error: "Each experience step needs both a title and a description.",
      success: false,
    };
  }

  const stats = readStatsInput(formData);

  if (stats.some((item) => !item.value || !item.label)) {
    return {
      error: "Each stat needs both a value and a label.",
      success: false,
    };
  }

  await prisma.aboutContent.upsert({
    where: { id: ABOUT_CONTENT_ID },
    update: {
      heroEyebrow,
      heroTitle,
      heroSubtitle,
      quoteText,
      storyParagraph1,
      storyParagraph2,
      storyParagraph3,
      timelineEyebrow,
      timelineTitle,
      timeline,
      highlightsEyebrow,
      highlightsTitle,
      highlights,
      experienceEyebrow,
      experienceTitle,
      experienceSteps,
      stats,
    },
    create: {
      id: ABOUT_CONTENT_ID,
      heroEyebrow,
      heroTitle,
      heroSubtitle,
      quoteText,
      storyParagraph1,
      storyParagraph2,
      storyParagraph3,
      timelineEyebrow,
      timelineTitle,
      timeline,
      highlightsEyebrow,
      highlightsTitle,
      highlights,
      experienceEyebrow,
      experienceTitle,
      experienceSteps,
      stats,
    },
  });

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/about");

  return { error: null, success: true };
}
