import { parseStoryBlock } from "@/src/lib/portfolio/story-blocks";
import type { PortfolioStoryContent } from "@/src/types/portfolio";

// The "New Born" category/title copy in the database predates a copy fix requested for
// the portfolio detail pages ("Newborn" as one word). Rather than rename the live
// category/slug (which would change existing URLs), normalize the wording at render time.
const NEW_BORN_PATTERN = /\bNew Born\b/g;

export function toNewbornSpelling(value: string): string;
export function toNewbornSpelling(value: string | null | undefined): string | null | undefined;
export function toNewbornSpelling(value: string | null | undefined) {
  return value ? value.replace(NEW_BORN_PATTERN, "Newborn") : value;
}

/** Shape returned by `getPortfolioStoryByImageId` - kept structural (not imported
 * from the db layer) to avoid a display <-> db import cycle. */
export interface PrismaPortfolioStoryWithBlocks {
  overviewEyebrow: string | null;
  overviewHeading: string | null;
  overviewParagraphs: unknown;
  service: string | null;
  location: string | null;
  style: string | null;
  setting: string | null;
  ctaEyebrow: string | null;
  ctaHeading: string | null;
  ctaBody: string | null;
  primaryCtaLabel: string | null;
  secondaryCtaLabel: string | null;
  blocks: { type: string; data: unknown }[];
}

/**
 * Converts a Prisma PortfolioStory (+ ordered blocks) into the public
 * PortfolioStoryContent shape the story components render. Malformed blocks are
 * dropped rather than thrown, so one bad record can never take down the page.
 */
export function buildPortfolioStoryContent(
  story: PrismaPortfolioStoryWithBlocks | null
): PortfolioStoryContent | undefined {
  if (!story) {
    return undefined;
  }

  const storyParagraphs = Array.isArray(story.overviewParagraphs)
    ? story.overviewParagraphs.filter(
        (paragraph): paragraph is string =>
          typeof paragraph === "string" && paragraph.trim().length > 0
      )
    : [];

  const blocks = story.blocks
    .map((block) => parseStoryBlock(block.type, block.data))
    .filter((block) => block !== null);

  const sessionDetails =
    story.service || story.location || story.style || story.setting
      ? {
          service: story.service ?? undefined,
          location: story.location ?? undefined,
          style: story.style ?? undefined,
          setting: story.setting ?? undefined,
        }
      : undefined;

  return {
    storyEyebrow: story.overviewEyebrow ?? undefined,
    storyHeading: story.overviewHeading ?? undefined,
    storyParagraphs,
    sessionDetails,
    blocks,
    ctaEyebrow: story.ctaEyebrow ?? undefined,
    ctaHeading: story.ctaHeading ?? undefined,
    ctaBody: story.ctaBody ?? undefined,
    primaryCtaLabel: story.primaryCtaLabel ?? undefined,
    secondaryCtaLabel: story.secondaryCtaLabel ?? undefined,
  };
}
