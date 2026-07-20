// Shared story-field/block parsing for the combined portfolio image + story admin
// form. Used by both the "new" and "[id]/edit" server actions so a single portfolio
// item can be created/updated (cover card + editorial story) in one submit.
import { uploadPortfolioImage } from "@/src/lib/storage/cloudinary";
import {
  STORY_FIELD_MAX_LENGTHS,
  isStoryBlockType,
  parseStoryBlock,
  splitParagraphs,
} from "@/src/lib/portfolio/story-blocks";
import type { PortfolioImage } from "@/src/types/portfolio";

export interface BlockFieldErrors {
  general?: string;
  paragraphs?: string;
  image?: string;
  images?: Record<string, string>;
}

export interface StoryFieldValues {
  overviewEyebrow: string | null;
  overviewHeading: string | null;
  overviewParagraphs: string[];
  heroEyebrow: string | null;
  studio: string | null;
  service: string | null;
  location: string | null;
  style: string | null;
  setting: string | null;
  ctaEyebrow: string | null;
  ctaHeading: string | null;
  ctaBody: string | null;
  primaryCtaLabel: string | null;
  secondaryCtaLabel: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

export type PreparedStoryBlock = {
  type: "TEXT" | "IMAGE" | "GALLERY" | "IMAGE_TEXT";
  sortOrder: number;
  data: Record<string, unknown>;
};

export type StoryFormResult =
  | { ok: true; fields: StoryFieldValues; blocks: PreparedStoryBlock[] }
  | { ok: false; message: string; blockErrors: Record<string, BlockFieldErrors> };

export type StoryFormOptions = {
  includeSeo?: boolean;
};

function trimmed(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optional(value: string): string | null {
  return value ? value : null;
}

function tooLong(value: string, max: number): boolean {
  return value.length > max;
}

export function isStoryFormEmpty(
  fields: StoryFieldValues,
  blocks: PreparedStoryBlock[]
): boolean {
  if (blocks.length > 0) {
    return false;
  }

  return Object.values(fields).every((value) =>
    Array.isArray(value) ? value.length === 0 : value === null
  );
}

/** Resolves one image slot: uploads a new file if provided, otherwise keeps the
 * existing Cloudinary metadata. Returns null for an untouched/empty slot. */
async function resolveImage(
  formData: FormData,
  blockId: string,
  imgId: string
): Promise<{ ok: true; image: PortfolioImage | null } | { ok: false; error: string }> {
  const prefix = `${blockId}__${imgId}`;
  const file = formData.get(`imgFile__${prefix}`);
  const alt = trimmed(formData, `imgAlt__${prefix}`);
  const caption = trimmed(formData, `imgCaption__${prefix}`);
  const existingSrc = trimmed(formData, `imgExistingSrc__${prefix}`);
  const existingPublicId = trimmed(formData, `imgExistingPublicId__${prefix}`);
  const existingWidth = Number.parseInt(trimmed(formData, `imgExistingWidth__${prefix}`), 10);
  const existingHeight = Number.parseInt(trimmed(formData, `imgExistingHeight__${prefix}`), 10);

  const hasFile = file instanceof File && file.size > 0;

  if (!hasFile && !existingSrc) {
    return { ok: true, image: null };
  }

  if (tooLong(alt, STORY_FIELD_MAX_LENGTHS.altText)) {
    return { ok: false, error: `Alt text must be under ${STORY_FIELD_MAX_LENGTHS.altText} characters.` };
  }

  if (!alt) {
    return { ok: false, error: "Alt text is required for every image." };
  }

  if (hasFile && file instanceof File) {
    const uploadResult = await uploadPortfolioImage(file);

    if (!uploadResult.ok) {
      return { ok: false, error: uploadResult.error };
    }

    return {
      ok: true,
      image: {
        id: imgId,
        src: uploadResult.url,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        alt,
        caption: caption || undefined,
      },
    };
  }

  return {
    ok: true,
    image: {
      id: imgId,
      src: existingSrc,
      publicId: existingPublicId || undefined,
      width: Number.isFinite(existingWidth) ? existingWidth : undefined,
      height: Number.isFinite(existingHeight) ? existingHeight : undefined,
      alt,
      caption: caption || undefined,
    },
  };
}

export async function parseStoryForm(
  formData: FormData,
  options: StoryFormOptions = {}
): Promise<StoryFormResult> {
  const includeSeo = options.includeSeo ?? true;
  const overviewEyebrow = trimmed(formData, "overviewEyebrow");
  const overviewHeading = trimmed(formData, "overviewHeading");
  const overviewParagraphsRaw = String(formData.get("overviewParagraphs") ?? "");
  const overviewParagraphs = splitParagraphs(overviewParagraphsRaw);

  const heroEyebrow = trimmed(formData, "heroEyebrow");
  const studio = trimmed(formData, "studio");

  const service = trimmed(formData, "service");
  const location = trimmed(formData, "location");
  const style = trimmed(formData, "style");
  const setting = trimmed(formData, "setting");

  const ctaEyebrow = trimmed(formData, "ctaEyebrow");
  const ctaHeading = trimmed(formData, "ctaHeading");
  const ctaBody = trimmed(formData, "ctaBody");
  const primaryCtaLabel = trimmed(formData, "primaryCtaLabel");
  const secondaryCtaLabel = trimmed(formData, "secondaryCtaLabel");

  const seoTitle = includeSeo ? trimmed(formData, "seoTitle") : "";
  const seoDescription = includeSeo ? trimmed(formData, "seoDescription") : "";

  const lengthChecks: Array<[string, number, string]> = [
    [overviewEyebrow, STORY_FIELD_MAX_LENGTHS.eyebrow, "Overview eyebrow"],
    [overviewHeading, STORY_FIELD_MAX_LENGTHS.heading, "Overview heading"],
    [heroEyebrow, STORY_FIELD_MAX_LENGTHS.eyebrow, "Hero eyebrow"],
    [studio, STORY_FIELD_MAX_LENGTHS.sessionDetail, "Studio"],
    [service, STORY_FIELD_MAX_LENGTHS.sessionDetail, "Service"],
    [location, STORY_FIELD_MAX_LENGTHS.sessionDetail, "Location"],
    [style, STORY_FIELD_MAX_LENGTHS.sessionDetail, "Style"],
    [setting, STORY_FIELD_MAX_LENGTHS.sessionDetail, "Setting"],
    [ctaEyebrow, STORY_FIELD_MAX_LENGTHS.eyebrow, "CTA eyebrow"],
    [ctaHeading, STORY_FIELD_MAX_LENGTHS.ctaHeading, "CTA heading"],
    [ctaBody, STORY_FIELD_MAX_LENGTHS.ctaBody, "CTA description"],
    [primaryCtaLabel, STORY_FIELD_MAX_LENGTHS.ctaLabel, "Primary button label"],
    [secondaryCtaLabel, STORY_FIELD_MAX_LENGTHS.ctaLabel, "Secondary button label"],
    [seoTitle, STORY_FIELD_MAX_LENGTHS.seoTitle, "SEO title"],
    [seoDescription, STORY_FIELD_MAX_LENGTHS.seoDescription, "Meta description"],
  ];

  for (const [value, max, label] of lengthChecks) {
    if (tooLong(value, max)) {
      return { ok: false, message: `${label} must be under ${max} characters.`, blockErrors: {} };
    }
  }

  for (const paragraph of overviewParagraphs) {
    if (tooLong(paragraph, STORY_FIELD_MAX_LENGTHS.paragraph)) {
      return {
        ok: false,
        message: `Overview paragraphs must be under ${STORY_FIELD_MAX_LENGTHS.paragraph} characters each.`,
        blockErrors: {},
      };
    }
  }

  const blockIds = formData.getAll("blockIds").map(String);
  const blockErrors: Record<string, BlockFieldErrors> = {};
  const preparedBlocks: PreparedStoryBlock[] = [];

  for (let index = 0; index < blockIds.length; index++) {
    const blockId = blockIds[index];
    const type = trimmed(formData, `blockType__${blockId}`);

    if (!isStoryBlockType(type)) {
      blockErrors[blockId] = { general: "Unknown block type." };
      continue;
    }

    if (type === "TEXT") {
      const eyebrow = trimmed(formData, `blockEyebrow__${blockId}`);
      const heading = trimmed(formData, `blockHeading__${blockId}`);
      const paragraphsRaw = String(formData.get(`blockParagraphs__${blockId}`) ?? "");
      const paragraphs = splitParagraphs(paragraphsRaw);

      if (paragraphs.length === 0) {
        blockErrors[blockId] = { paragraphs: "At least one paragraph is required." };
        continue;
      }

      preparedBlocks.push({
        type,
        sortOrder: index,
        data: { eyebrow: optional(eyebrow), heading: optional(heading), paragraphs },
      });
      continue;
    }

    if (type === "IMAGE") {
      const layout = trimmed(formData, `blockLayout__${blockId}`);

      if (layout !== "full" && layout !== "wide" && layout !== "portrait") {
        blockErrors[blockId] = { general: "Invalid image layout." };
        continue;
      }

      const imgId = trimmed(formData, `imgId__${blockId}`);
      const resolved = await resolveImage(formData, blockId, imgId);

      if (!resolved.ok) {
        blockErrors[blockId] = { image: resolved.error };
        continue;
      }

      if (!resolved.image) {
        blockErrors[blockId] = { image: "An image is required for this block." };
        continue;
      }

      preparedBlocks.push({ type, sortOrder: index, data: { layout, image: resolved.image } });
      continue;
    }

    if (type === "IMAGE_TEXT") {
      const imagePosition = trimmed(formData, `blockImagePosition__${blockId}`);

      if (imagePosition !== "left" && imagePosition !== "right") {
        blockErrors[blockId] = { general: "Invalid image position." };
        continue;
      }

      const eyebrow = trimmed(formData, `blockEyebrow__${blockId}`);
      const heading = trimmed(formData, `blockHeading__${blockId}`);
      const paragraphsRaw = String(formData.get(`blockParagraphs__${blockId}`) ?? "");
      const paragraphs = splitParagraphs(paragraphsRaw);

      if (paragraphs.length === 0) {
        blockErrors[blockId] = { paragraphs: "At least one paragraph is required." };
        continue;
      }

      const imgId = trimmed(formData, `imgId__${blockId}`);
      const resolved = await resolveImage(formData, blockId, imgId);

      if (!resolved.ok) {
        blockErrors[blockId] = { image: resolved.error };
        continue;
      }

      if (!resolved.image) {
        blockErrors[blockId] = { image: "An image is required for this block." };
        continue;
      }

      preparedBlocks.push({
        type,
        sortOrder: index,
        data: {
          imagePosition,
          eyebrow: optional(eyebrow),
          heading: optional(heading),
          paragraphs,
          image: resolved.image,
        },
      });
      continue;
    }

    if (type === "GALLERY") {
      const columnsRaw = trimmed(formData, `blockColumns__${blockId}`);
      const columns = columnsRaw === "3" ? 3 : columnsRaw === "2" ? 2 : null;

      if (!columns) {
        blockErrors[blockId] = { general: "Invalid column count." };
        continue;
      }

      const imgIds = formData.getAll(`imgOrder__${blockId}`).map(String);
      const images: PortfolioImage[] = [];
      const imageErrors: Record<string, string> = {};

      for (const imgId of imgIds) {
        const resolved = await resolveImage(formData, blockId, imgId);

        if (!resolved.ok) {
          imageErrors[imgId] = resolved.error;
          continue;
        }

        if (resolved.image) {
          images.push(resolved.image);
        }
      }

      if (Object.keys(imageErrors).length > 0) {
        blockErrors[blockId] = { images: imageErrors };
        continue;
      }

      if (images.length < 2) {
        blockErrors[blockId] = { general: "A gallery needs at least two images." };
        continue;
      }

      preparedBlocks.push({ type, sortOrder: index, data: { columns, images } });
      continue;
    }
  }

  if (Object.keys(blockErrors).length > 0) {
    return { ok: false, message: "Fix the highlighted blocks before saving.", blockErrors };
  }

  // Final sanity pass: every prepared block must round-trip through the same
  // parser the public page uses, so nothing malformed can ever be persisted.
  for (const block of preparedBlocks) {
    if (!parseStoryBlock(block.type, block.data)) {
      return {
        ok: false,
        message: "One or more blocks are invalid. Please review and try again.",
        blockErrors: {},
      };
    }
  }

  return {
    ok: true,
    fields: {
      overviewEyebrow: optional(overviewEyebrow),
      overviewHeading: optional(overviewHeading),
      overviewParagraphs,
      heroEyebrow: optional(heroEyebrow),
      studio: optional(studio),
      service: optional(service),
      location: optional(location),
      style: optional(style),
      setting: optional(setting),
      ctaEyebrow: optional(ctaEyebrow),
      ctaHeading: optional(ctaHeading),
      ctaBody: optional(ctaBody),
      primaryCtaLabel: optional(primaryCtaLabel),
      secondaryCtaLabel: optional(secondaryCtaLabel),
      seoTitle: includeSeo ? optional(seoTitle) : null,
      seoDescription: includeSeo ? optional(seoDescription) : null,
    },
    blocks: preparedBlocks,
  };
}
