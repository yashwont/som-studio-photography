"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { uploadPortfolioImage } from "@/src/lib/storage/cloudinary";
import {
  STORY_FIELD_MAX_LENGTHS,
  isStoryBlockType,
  parseStoryBlock,
  splitParagraphs,
} from "@/src/lib/portfolio/story-blocks";
import type { PortfolioImage } from "@/src/types/portfolio";
import type { BlockFieldErrors, SaveStoryState } from "./types";

function trimmed(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optional(value: string): string | null {
  return value ? value : null;
}

function tooLong(value: string, max: number): boolean {
  return value.length > max;
}

/** Resolves one image slot: uploads a new file if provided, otherwise keeps the
 * existing Cloudinary metadata. Returns null for an untouched/empty slot. */
async function resolveImage(
  formData: FormData,
  blockId: string,
  imgId: string
): Promise<
  | { ok: true; image: PortfolioImage | null }
  | { ok: false; error: string }
> {
  const prefix = `${blockId}__${imgId}`;
  const file = formData.get(`imgFile__${prefix}`);
  const alt = trimmed(formData, `imgAlt__${prefix}`);
  const caption = trimmed(formData, `imgCaption__${prefix}`);
  const existingSrc = trimmed(formData, `imgExistingSrc__${prefix}`);
  const existingPublicId = trimmed(formData, `imgExistingPublicId__${prefix}`);
  const existingWidth = Number.parseInt(
    trimmed(formData, `imgExistingWidth__${prefix}`),
    10
  );
  const existingHeight = Number.parseInt(
    trimmed(formData, `imgExistingHeight__${prefix}`),
    10
  );

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

export async function savePortfolioStory(
  imageId: string,
  _previousState: SaveStoryState,
  formData: FormData
): Promise<SaveStoryState> {
  await requireAdmin();

  const portfolioImage = await prisma.portfolioImage.findUnique({
    where: { id: imageId },
    select: { id: true, slug: true, categoryId: true },
  });

  if (!portfolioImage) {
    return { status: "error", message: "Portfolio item not found.", blockErrors: {} };
  }

  const overviewEyebrow = trimmed(formData, "overviewEyebrow");
  const overviewHeading = trimmed(formData, "overviewHeading");
  const overviewParagraphsRaw = String(formData.get("overviewParagraphs") ?? "");
  const overviewParagraphs = splitParagraphs(overviewParagraphsRaw);

  const service = trimmed(formData, "service");
  const location = trimmed(formData, "location");
  const style = trimmed(formData, "style");
  const setting = trimmed(formData, "setting");

  const ctaEyebrow = trimmed(formData, "ctaEyebrow");
  const ctaHeading = trimmed(formData, "ctaHeading");
  const ctaBody = trimmed(formData, "ctaBody");
  const primaryCtaLabel = trimmed(formData, "primaryCtaLabel");
  const secondaryCtaLabel = trimmed(formData, "secondaryCtaLabel");

  const seoTitle = trimmed(formData, "seoTitle");
  const seoDescription = trimmed(formData, "seoDescription");

  const lengthChecks: Array<[string, number, string]> = [
    [overviewEyebrow, STORY_FIELD_MAX_LENGTHS.eyebrow, "Overview eyebrow"],
    [overviewHeading, STORY_FIELD_MAX_LENGTHS.heading, "Overview heading"],
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
      return {
        status: "error",
        message: `${label} must be under ${max} characters.`,
        blockErrors: {},
      };
    }
  }

  for (const paragraph of overviewParagraphs) {
    if (tooLong(paragraph, STORY_FIELD_MAX_LENGTHS.paragraph)) {
      return {
        status: "error",
        message: `Overview paragraphs must be under ${STORY_FIELD_MAX_LENGTHS.paragraph} characters each.`,
        blockErrors: {},
      };
    }
  }

  const blockIds = formData.getAll("blockIds").map(String);
  const blockErrors: Record<string, BlockFieldErrors> = {};

  type PreparedBlock = { type: string; sortOrder: number; data: Record<string, unknown> };
  const preparedBlocks: PreparedBlock[] = [];

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
        data: {
          eyebrow: optional(eyebrow),
          heading: optional(heading),
          paragraphs,
        },
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

      preparedBlocks.push({
        type,
        sortOrder: index,
        data: { layout, image: resolved.image },
      });
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

      preparedBlocks.push({
        type,
        sortOrder: index,
        data: { columns, images },
      });
      continue;
    }
  }

  if (Object.keys(blockErrors).length > 0) {
    return {
      status: "error",
      message: "Fix the highlighted blocks before saving.",
      blockErrors,
    };
  }

  // Final sanity pass: every prepared block must round-trip through the same
  // parser the public page uses, so nothing malformed can ever be persisted.
  for (const block of preparedBlocks) {
    if (!parseStoryBlock(block.type, block.data)) {
      return {
        status: "error",
        message: "One or more blocks are invalid. Please review and try again.",
        blockErrors: {},
      };
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const story = await tx.portfolioStory.upsert({
        where: { portfolioImageId: imageId },
        create: {
          portfolioImageId: imageId,
          overviewEyebrow: optional(overviewEyebrow),
          overviewHeading: optional(overviewHeading),
          overviewParagraphs,
          service: optional(service),
          location: optional(location),
          style: optional(style),
          setting: optional(setting),
          ctaEyebrow: optional(ctaEyebrow),
          ctaHeading: optional(ctaHeading),
          ctaBody: optional(ctaBody),
          primaryCtaLabel: optional(primaryCtaLabel),
          secondaryCtaLabel: optional(secondaryCtaLabel),
          seoTitle: optional(seoTitle),
          seoDescription: optional(seoDescription),
        },
        update: {
          overviewEyebrow: optional(overviewEyebrow),
          overviewHeading: optional(overviewHeading),
          overviewParagraphs,
          service: optional(service),
          location: optional(location),
          style: optional(style),
          setting: optional(setting),
          ctaEyebrow: optional(ctaEyebrow),
          ctaHeading: optional(ctaHeading),
          ctaBody: optional(ctaBody),
          primaryCtaLabel: optional(primaryCtaLabel),
          secondaryCtaLabel: optional(secondaryCtaLabel),
          seoTitle: optional(seoTitle),
          seoDescription: optional(seoDescription),
        },
        select: { id: true },
      });

      await tx.portfolioStoryBlock.deleteMany({ where: { storyId: story.id } });

      if (preparedBlocks.length > 0) {
        await tx.portfolioStoryBlock.createMany({
          data: preparedBlocks.map((block) => ({
            storyId: story.id,
            type: block.type as "TEXT" | "IMAGE" | "GALLERY" | "IMAGE_TEXT",
            sortOrder: block.sortOrder,
            data: block.data as Prisma.InputJsonValue,
          })),
        });
      }
    });
  } catch {
    return {
      status: "error",
      message: "Failed to save the story. Please try again.",
      blockErrors: {},
    };
  }

  revalidatePath(`/portfolio/${portfolioImage.slug}`);
  revalidatePath(`/admin/portfolio/images/${imageId}`);
  revalidatePath(`/admin/portfolio/images/${imageId}/story`);
  revalidatePath(`/admin/portfolio/${portfolioImage.categoryId}`);

  return { status: "success", message: "Story saved.", blockErrors: {} };
}

export async function deletePortfolioStory(imageId: string) {
  await requireAdmin();

  const portfolioImage = await prisma.portfolioImage.findUnique({
    where: { id: imageId },
    select: { slug: true, categoryId: true },
  });

  if (!portfolioImage) {
    return;
  }

  await prisma.portfolioStory.deleteMany({ where: { portfolioImageId: imageId } });

  revalidatePath(`/portfolio/${portfolioImage.slug}`);
  revalidatePath(`/admin/portfolio/images/${imageId}`);
  revalidatePath(`/admin/portfolio/images/${imageId}/story`);
  revalidatePath(`/admin/portfolio/${portfolioImage.categoryId}`);
}
