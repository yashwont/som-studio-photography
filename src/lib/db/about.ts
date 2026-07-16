import { prisma } from "@/src/lib/prisma";

export const ABOUT_CONTENT_ID = "about";

export type AboutHighlight = {
  title: string;
  description: string;
};

export type AboutTimelineItem = {
  year: string;
  title: string;
  description: string;
};

export type AboutExperienceStep = {
  title: string;
  description: string;
};

export type AboutStat = {
  value: string;
  label: string;
};

export type AboutContentData = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  quoteText: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyParagraph3: string;
  timelineEyebrow: string;
  timelineTitle: string;
  timeline: AboutTimelineItem[];
  highlightsEyebrow: string;
  highlightsTitle: string;
  highlights: AboutHighlight[];
  experienceEyebrow: string;
  experienceTitle: string;
  experienceSteps: AboutExperienceStep[];
  stats: AboutStat[];
};

export const defaultAboutContent: AboutContentData = {
  heroEyebrow: "About SomStudio",
  heroTitle: "Capturing Kathmandu’s stories since 1995",
  heroSubtitle:
    "Three decades of professional digital studio photography - weddings, portraits, and everyday milestones, photographed one honest frame at a time.",
  quoteText:
    "Every photograph should feel honest, timeless, and worth keeping.",
  storyParagraph1:
    "SomStudioPhotography was established in 1995 A.D. and has grown with over 30 years of experience in professional digital studio photography. Based in Kathmandu, we capture meaningful moments through weddings, portraits, events, products, passport photos, printing, framing, and custom photography services.",
  storyParagraph2:
    "Our studio focuses on a comfortable experience, careful guidance, professional editing, and photographs that feel natural, timeless, and worth keeping.",
  storyParagraph3: "",
  timelineEyebrow: "Our journey",
  timelineTitle: "Three decades in the making.",
  timeline: [
    {
      year: "1995",
      title: "Studio established",
      description:
        "SomStudioPhotography opens its doors in Kathmandu, beginning three decades of studio and portrait work.",
    },
    {
      year: "2000s",
      title: "Studio portraits & events grow",
      description:
        "The studio expands into event coverage and structured studio portrait sessions as more families and couples find us.",
    },
    {
      year: "2010s",
      title: "The shift to digital",
      description:
        "A move to digital photography and modern editing workflows sharpens our turnaround time without losing the studio's eye for detail.",
    },
    {
      year: "Today",
      title: "A complete photography studio",
      description:
        "Weddings, portraits, products, passport photos, printing, and framing - all under one roof, all held to the same standard.",
    },
  ],
  highlightsEyebrow: "Studio values",
  highlightsTitle: "What guides every session",
  highlights: [
    {
      title: "Timeless Quality",
      description:
        "We aim for photographs that still feel meaningful ten, twenty, even thirty years from now - not just images that look good today.",
    },
    {
      title: "Comfortable Studio Experience",
      description:
        "From the first hello to the final frame, every session is paced around your comfort, not the other way around.",
    },
    {
      title: "Professional Editing",
      description:
        "Each photograph is individually reviewed and refined by hand before it ever reaches you.",
    },
    {
      title: "Fast & Reliable Delivery",
      description:
        "Digital galleries, prints, and framing - delivered on a timeline you can actually count on.",
    },
  ],
  experienceEyebrow: "What to expect",
  experienceTitle: "Your session, step by step.",
  experienceSteps: [
    {
      title: "Consultation",
      description:
        "We start with a conversation about what you want, your timeline, and how to prepare.",
    },
    {
      title: "Guided posing",
      description:
        "No experience needed - we direct every session naturally so nothing feels stiff or forced.",
    },
    {
      title: "Comfortable environment",
      description:
        "A relaxed studio, or location, built to put you at ease before the camera ever comes out.",
    },
    {
      title: "Careful editing",
      description:
        "Every photograph is reviewed and refined by hand, never rushed through in bulk.",
    },
    {
      title: "Delivery",
      description:
        "Finished galleries, prints, or framed pieces - delivered the way you actually want them.",
    },
  ],
  stats: [
    { value: "30+", label: "Years of experience" },
    { value: "10+", label: "Photography services" },
    { value: "Studio + Outdoor", label: "Session locations" },
    { value: "Digital + Print", label: "Delivery formats" },
  ],
};

function parseHighlights(value: unknown): AboutHighlight[] {
  if (!Array.isArray(value)) {
    return defaultAboutContent.highlights;
  }

  const highlights = value
    .filter(
      (item): item is { title: unknown; description: unknown } =>
        typeof item === "object" && item !== null
    )
    .map((item) => ({
      title: String((item as { title?: unknown }).title ?? ""),
      description: String((item as { description?: unknown }).description ?? ""),
    }))
    .filter((item) => item.title || item.description);

  return highlights.length > 0 ? highlights : defaultAboutContent.highlights;
}

function parseTimeline(value: unknown): AboutTimelineItem[] {
  if (!Array.isArray(value)) {
    return defaultAboutContent.timeline;
  }

  const timeline = value
    .filter(
      (item): item is { year: unknown; title: unknown; description: unknown } =>
        typeof item === "object" && item !== null
    )
    .map((item) => ({
      year: String((item as { year?: unknown }).year ?? ""),
      title: String((item as { title?: unknown }).title ?? ""),
      description: String((item as { description?: unknown }).description ?? ""),
    }))
    .filter((item) => item.year || item.title || item.description);

  return timeline.length > 0 ? timeline : defaultAboutContent.timeline;
}

function parseExperienceSteps(value: unknown): AboutExperienceStep[] {
  if (!Array.isArray(value)) {
    return defaultAboutContent.experienceSteps;
  }

  const steps = value
    .filter(
      (item): item is { title: unknown; description: unknown } =>
        typeof item === "object" && item !== null
    )
    .map((item) => ({
      title: String((item as { title?: unknown }).title ?? ""),
      description: String((item as { description?: unknown }).description ?? ""),
    }))
    .filter((item) => item.title || item.description);

  return steps.length > 0 ? steps : defaultAboutContent.experienceSteps;
}

function parseStats(value: unknown): AboutStat[] {
  if (!Array.isArray(value)) {
    return defaultAboutContent.stats;
  }

  const stats = value
    .filter(
      (item): item is { value: unknown; label: unknown } =>
        typeof item === "object" && item !== null
    )
    .map((item) => ({
      value: String((item as { value?: unknown }).value ?? ""),
      label: String((item as { label?: unknown }).label ?? ""),
    }))
    .filter((item) => item.value || item.label);

  return stats.length > 0 ? stats : defaultAboutContent.stats;
}

export async function getAboutContent(): Promise<AboutContentData> {
  const record = await prisma.aboutContent.findUnique({
    where: { id: ABOUT_CONTENT_ID },
  });

  if (!record) {
    return defaultAboutContent;
  }

  return {
    heroEyebrow: record.heroEyebrow,
    heroTitle: record.heroTitle,
    heroSubtitle: record.heroSubtitle,
    quoteText: record.quoteText,
    storyParagraph1: record.storyParagraph1,
    storyParagraph2: record.storyParagraph2,
    storyParagraph3: record.storyParagraph3,
    timelineEyebrow: record.timelineEyebrow,
    timelineTitle: record.timelineTitle,
    timeline: parseTimeline(record.timeline),
    highlightsEyebrow: record.highlightsEyebrow,
    highlightsTitle: record.highlightsTitle,
    highlights: parseHighlights(record.highlights),
    experienceEyebrow: record.experienceEyebrow,
    experienceTitle: record.experienceTitle,
    experienceSteps: parseExperienceSteps(record.experienceSteps),
    stats: parseStats(record.stats),
  };
}

/** Saves a partial update to the About content, merging it onto whatever is
 * currently stored so that a section-specific admin page (e.g. just the
 * Timeline) never clobbers fields owned by another section. */
export async function saveAboutContent(partial: Partial<AboutContentData>): Promise<void> {
  const current = await getAboutContent();
  const next: AboutContentData = { ...current, ...partial };

  await prisma.aboutContent.upsert({
    where: { id: ABOUT_CONTENT_ID },
    update: next,
    create: { id: ABOUT_CONTENT_ID, ...next },
  });
}
