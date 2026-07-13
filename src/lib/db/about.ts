import { prisma } from "@/src/lib/prisma";

export const ABOUT_CONTENT_ID = "about";

export type AboutHighlight = {
  title: string;
  description: string;
};

export type AboutContentData = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyParagraph3: string;
  highlightsEyebrow: string;
  highlightsTitle: string;
  highlights: AboutHighlight[];
};

export const defaultAboutContent: AboutContentData = {
  heroEyebrow: "About the studio",
  heroTitle: "SomStudioPhotography",
  heroSubtitle:
    "A Kathmandu photography studio built for meaningful moments and images worth keeping.",
  storyParagraph1:
    "Established in 1995 A.D. with 30 years of experience, our Professional Digital Studio Photography specializes in capturing timeless moments. Using cutting-edge technology, we create stunning images tailored to your vision.",
  storyParagraph2:
    "Our studio offers a comfortable environment, exceptional customer service, and quick turnaround times. Choose from customizable packages including digital images, prints, albums, and framing. Enhance your photos with our professional editing services.",
  storyParagraph3:
    "Contact us today to schedule your session and turn your vision into cherished memories.",
  highlightsEyebrow: "Client experience",
  highlightsTitle: "What to expect",
  highlights: [
    {
      title: "Client-First Planning",
      description:
        "Every session starts with a conversation. We learn what you want, advise on timing and style, and make sure everything is prepared before the camera comes out.",
    },
    {
      title: "Creative Direction",
      description:
        "You don't need posing experience. We guide you through the session naturally so your images feel authentic, relaxed, and true to who you are.",
    },
    {
      title: "Polished Editing",
      description:
        "Every image is individually selected and carefully refined before delivery. No bulk exports - only the best frames, edited to a consistent standard.",
    },
    {
      title: "Studio & Outdoor",
      description:
        "We work in our private studio and on location across Kathmandu. Controlled lighting or natural settings - we adapt to whatever serves your vision.",
    },
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
    storyParagraph1: record.storyParagraph1,
    storyParagraph2: record.storyParagraph2,
    storyParagraph3: record.storyParagraph3,
    highlightsEyebrow: record.highlightsEyebrow,
    highlightsTitle: record.highlightsTitle,
    highlights: parseHighlights(record.highlights),
  };
}
