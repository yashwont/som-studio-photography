import { joinParagraphs, normalizePortfolioImage } from "@/src/lib/portfolio/story-blocks";

export interface EditableImageDraft {
  /** Stable key used both as the React key and as the `<imgId>` segment of every
   * field name for this image slot (imgAlt__<blockId>__<imgId>, etc). */
  clientId: string;
  alt: string;
  caption: string;
  existingSrc: string;
  existingPublicId: string;
  existingWidth: string;
  existingHeight: string;
}

export interface TextBlockDraft {
  clientId: string;
  type: "TEXT";
  eyebrow: string;
  heading: string;
  /** Textarea content - paragraphs separated by a blank line. */
  paragraphs: string;
}

export interface ImageBlockDraft {
  clientId: string;
  type: "IMAGE";
  layout: "full" | "wide" | "portrait";
  image: EditableImageDraft;
}

export interface GalleryBlockDraft {
  clientId: string;
  type: "GALLERY";
  columns: 2 | 3;
  images: EditableImageDraft[];
}

export interface ImageTextBlockDraft {
  clientId: string;
  type: "IMAGE_TEXT";
  imagePosition: "left" | "right";
  eyebrow: string;
  heading: string;
  paragraphs: string;
  image: EditableImageDraft;
}

export type EditableBlock =
  | TextBlockDraft
  | ImageBlockDraft
  | GalleryBlockDraft
  | ImageTextBlockDraft;

export interface StoryOverviewDraft {
  eyebrow: string;
  heading: string;
  /** Textarea content - paragraphs separated by a blank line. */
  paragraphs: string;
}

export interface SessionDetailsDraft {
  studio: string;
  service: string;
  location: string;
  style: string;
  setting: string;
}

export interface StoryCtaDraft {
  eyebrow: string;
  heading: string;
  body: string;
  primaryLabel: string;
  secondaryLabel: string;
}

export interface StorySeoDraft {
  title: string;
  description: string;
}

function generateClientId(): string {
  return crypto.randomUUID();
}

export function createEmptyImageDraft(): EditableImageDraft {
  return {
    clientId: generateClientId(),
    alt: "",
    caption: "",
    existingSrc: "",
    existingPublicId: "",
    existingWidth: "",
    existingHeight: "",
  };
}

export function createEmptyTextBlock(): TextBlockDraft {
  return {
    clientId: generateClientId(),
    type: "TEXT",
    eyebrow: "",
    heading: "",
    paragraphs: "",
  };
}

export function createEmptyImageBlock(): ImageBlockDraft {
  return {
    clientId: generateClientId(),
    type: "IMAGE",
    layout: "full",
    image: createEmptyImageDraft(),
  };
}

export function createEmptyGalleryBlock(): GalleryBlockDraft {
  return {
    clientId: generateClientId(),
    type: "GALLERY",
    columns: 2,
    images: [createEmptyImageDraft(), createEmptyImageDraft()],
  };
}

export function createEmptyImageTextBlock(): ImageTextBlockDraft {
  return {
    clientId: generateClientId(),
    type: "IMAGE_TEXT",
    imagePosition: "left",
    eyebrow: "",
    heading: "",
    paragraphs: "",
    image: createEmptyImageDraft(),
  };
}

export function addGalleryImage(block: GalleryBlockDraft): GalleryBlockDraft {
  return { ...block, images: [...block.images, createEmptyImageDraft()] };
}

export function duplicateBlock(block: EditableBlock): EditableBlock {
  const cloneImage = (image: EditableImageDraft): EditableImageDraft => ({
    ...image,
    clientId: generateClientId(),
  });

  switch (block.type) {
    case "TEXT":
      return { ...block, clientId: generateClientId() };
    case "IMAGE":
      return { ...block, clientId: generateClientId(), image: cloneImage(block.image) };
    case "IMAGE_TEXT":
      return { ...block, clientId: generateClientId(), image: cloneImage(block.image) };
    case "GALLERY":
      return {
        ...block,
        clientId: generateClientId(),
        images: block.images.map(cloneImage),
      };
    default:
      return block;
  }
}

export function blockTypeLabel(type: EditableBlock["type"]): string {
  switch (type) {
    case "TEXT":
      return "Text";
    case "IMAGE":
      return "Single Image";
    case "GALLERY":
      return "Gallery";
    case "IMAGE_TEXT":
      return "Image + Text";
    default:
      return type;
  }
}

export function blockPreviewText(block: EditableBlock): string {
  switch (block.type) {
    case "TEXT":
      return block.heading || block.paragraphs.slice(0, 80) || "Empty text block";
    case "IMAGE":
      return block.image.alt || "No alt text yet";
    case "IMAGE_TEXT":
      return block.heading || block.image.alt || "Empty image + text block";
    case "GALLERY":
      return `${block.images.length} image${block.images.length === 1 ? "" : "s"}, ${block.columns} columns`;
    default:
      return "";
  }
}

function draftFromRawImage(raw: unknown): EditableImageDraft | null {
  const image = normalizePortfolioImage(raw);

  if (!image) {
    return null;
  }

  return {
    clientId: image.id,
    alt: image.alt,
    caption: image.caption ?? "",
    existingSrc: image.src,
    existingPublicId: image.publicId ?? "",
    existingWidth: image.width !== undefined ? String(image.width) : "",
    existingHeight: image.height !== undefined ? String(image.height) : "",
  };
}

/** Converts persisted PortfolioStoryBlock rows into editable drafts for the editor's
 * initial state. Malformed rows are skipped (mirrors the public adapter's leniency). */
export function draftsFromStoryBlocks(
  blocks: { id: string; type: string; data: unknown }[]
): EditableBlock[] {
  const drafts: EditableBlock[] = [];

  for (const block of blocks) {
    const data =
      block.data && typeof block.data === "object"
        ? (block.data as Record<string, unknown>)
        : {};

    if (block.type === "TEXT") {
      const paragraphs = Array.isArray(data.paragraphs)
        ? data.paragraphs.filter((p): p is string => typeof p === "string")
        : [];
      drafts.push({
        clientId: block.id,
        type: "TEXT",
        eyebrow: typeof data.eyebrow === "string" ? data.eyebrow : "",
        heading: typeof data.heading === "string" ? data.heading : "",
        paragraphs: joinParagraphs(paragraphs),
      });
    } else if (block.type === "IMAGE") {
      const image = draftFromRawImage(data.image);
      if (!image) continue;
      const layout =
        data.layout === "wide" || data.layout === "portrait" ? data.layout : "full";
      drafts.push({ clientId: block.id, type: "IMAGE", layout, image });
    } else if (block.type === "GALLERY") {
      const rawImages = Array.isArray(data.images) ? data.images : [];
      const images = rawImages
        .map(draftFromRawImage)
        .filter((image): image is EditableImageDraft => image !== null);
      if (images.length === 0) continue;
      const columns = data.columns === 3 ? 3 : 2;
      drafts.push({ clientId: block.id, type: "GALLERY", columns, images });
    } else if (block.type === "IMAGE_TEXT") {
      const image = draftFromRawImage(data.image);
      if (!image) continue;
      const paragraphs = Array.isArray(data.paragraphs)
        ? data.paragraphs.filter((p): p is string => typeof p === "string")
        : [];
      const imagePosition = data.imagePosition === "right" ? "right" : "left";
      drafts.push({
        clientId: block.id,
        type: "IMAGE_TEXT",
        imagePosition,
        eyebrow: typeof data.eyebrow === "string" ? data.eyebrow : "",
        heading: typeof data.heading === "string" ? data.heading : "",
        paragraphs: joinParagraphs(paragraphs),
        image,
      });
    }
  }

  return drafts;
}
