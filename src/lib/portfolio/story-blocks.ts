// Shared block-data parsing/validation, used by both:
// - src/lib/portfolio/display.ts (Prisma -> public PortfolioBlock, lenient: skip malformed)
// - src/lib/portfolio/story-form.ts (form input -> Prisma `data` JSON, strict)
//
// Keeping one parser means the admin can never save a block shape the public renderer
// (or the admin editor, reloading its own data) can't understand.
import type { PortfolioBlock, PortfolioImage } from "@/src/types/portfolio";

export const STORY_FIELD_MAX_LENGTHS = {
  eyebrow: 120,
  heading: 200,
  paragraph: 2000,
  altText: 300,
  caption: 300,
  sessionDetail: 200,
  ctaLabel: 60,
  ctaHeading: 300,
  ctaBody: 600,
  seoTitle: 90,
  seoDescription: 320,
} as const;

export const STORY_BLOCK_TYPES = ["TEXT", "IMAGE", "GALLERY", "IMAGE_TEXT"] as const;
export type StoryBlockTypeValue = (typeof STORY_BLOCK_TYPES)[number];

export function isStoryBlockType(value: string): value is StoryBlockTypeValue {
  return (STORY_BLOCK_TYPES as readonly string[]).includes(value);
}

function trimOrUndefined(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/** Textarea content -> paragraph array, splitting on blank lines. */
export function splitParagraphs(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** Paragraph array -> textarea content, for populating an edit form. */
export function joinParagraphs(paragraphs: string[]): string {
  return paragraphs.join("\n\n");
}

function normalizeParagraphs(candidate: unknown): string[] {
  if (!Array.isArray(candidate)) {
    return [];
  }

  return candidate
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
}

export function normalizePortfolioImage(candidate: unknown): PortfolioImage | null {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const value = candidate as Record<string, unknown>;
  const id = typeof value.id === "string" && value.id ? value.id : null;
  const src = typeof value.src === "string" ? value.src.trim() : "";
  const alt = typeof value.alt === "string" ? value.alt.trim() : "";

  if (!id || !src || !alt) {
    return null;
  }

  const width = typeof value.width === "number" && Number.isFinite(value.width) ? value.width : undefined;
  const height = typeof value.height === "number" && Number.isFinite(value.height) ? value.height : undefined;

  return {
    id,
    src,
    alt,
    caption: trimOrUndefined(value.caption),
    publicId: trimOrUndefined(value.publicId),
    width,
    height,
  };
}

/**
 * Converts a stored block (type + JSON data) into the public PortfolioBlock shape.
 * Returns null for anything malformed so one bad block can never crash the page -
 * callers should filter out nulls rather than throw.
 */
export function parseStoryBlock(type: string, data: unknown): PortfolioBlock | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const value = data as Record<string, unknown>;

  switch (type) {
    case "TEXT": {
      const paragraphs = normalizeParagraphs(value.paragraphs);

      if (paragraphs.length === 0) {
        return null;
      }

      return {
        type: "text",
        eyebrow: trimOrUndefined(value.eyebrow),
        heading: trimOrUndefined(value.heading),
        paragraphs,
      };
    }

    case "IMAGE": {
      const image = normalizePortfolioImage(value.image);
      const layout = value.layout;

      if (!image || (layout !== "full" && layout !== "wide" && layout !== "portrait")) {
        return null;
      }

      return { type: "image", image, layout };
    }

    case "GALLERY": {
      const columns = value.columns === 3 ? 3 : value.columns === 2 ? 2 : null;
      const rawImages = Array.isArray(value.images) ? value.images : [];
      const images = rawImages
        .map(normalizePortfolioImage)
        .filter((image): image is PortfolioImage => image !== null);

      if (!columns || images.length < 2) {
        return null;
      }

      return { type: "gallery", columns, images };
    }

    case "IMAGE_TEXT": {
      const image = normalizePortfolioImage(value.image);
      const imagePosition =
        value.imagePosition === "left" ? "left" : value.imagePosition === "right" ? "right" : null;
      const paragraphs = normalizeParagraphs(value.paragraphs);

      if (!image || !imagePosition || paragraphs.length === 0) {
        return null;
      }

      return {
        type: "imageText",
        image,
        imagePosition,
        eyebrow: trimOrUndefined(value.eyebrow),
        heading: trimOrUndefined(value.heading),
        paragraphs,
      };
    }

    default:
      return null;
  }
}
