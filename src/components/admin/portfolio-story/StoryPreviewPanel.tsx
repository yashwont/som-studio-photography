"use client";

import PortfolioHero from "@/src/components/portfolio/PortfolioHero";
import PortfolioOverview from "@/src/components/portfolio/PortfolioOverview";
import PortfolioStoryRenderer from "@/src/components/portfolio/PortfolioStoryRenderer";
import PortfolioBookingCTA from "@/src/components/portfolio/PortfolioBookingCTA";
import { LightboxProvider } from "@/src/components/portfolio/GalleryLightbox";
import { splitParagraphs } from "@/src/lib/portfolio/story-blocks";
import type {
  PortfolioBlock,
  PortfolioImage as PublicPortfolioImage,
  PortfolioSessionDetails,
} from "@/src/types/portfolio";
import type {
  EditableBlock,
  EditableImageDraft,
  SessionDetailsDraft,
  StoryCtaDraft,
  StoryOverviewDraft,
} from "./types";

// This panel renders the *actual* public story components against the editor's
// current in-memory state, so "preview" never drifts from the real page. New,
// not-yet-uploaded images show a neutral placeholder until saved (we don't lift
// blob preview URLs out of each image field for this).
const PLACEHOLDER_IMAGE = "/images/visuals/studio.jpg";

function toPublicImage(image: EditableImageDraft): PublicPortfolioImage {
  return {
    id: image.clientId,
    src: image.existingSrc || PLACEHOLDER_IMAGE,
    alt: image.alt || "Untitled image",
    caption: image.caption || undefined,
  };
}

function toPublicBlock(block: EditableBlock): PortfolioBlock | null {
  switch (block.type) {
    case "TEXT": {
      const paragraphs = splitParagraphs(block.paragraphs);
      if (paragraphs.length === 0) return null;
      return {
        type: "text",
        eyebrow: block.eyebrow || undefined,
        heading: block.heading || undefined,
        paragraphs,
      };
    }
    case "IMAGE":
      return { type: "image", image: toPublicImage(block.image), layout: block.layout };
    case "IMAGE_TEXT": {
      const paragraphs = splitParagraphs(block.paragraphs);
      if (paragraphs.length === 0) return null;
      return {
        type: "imageText",
        image: toPublicImage(block.image),
        imagePosition: block.imagePosition,
        eyebrow: block.eyebrow || undefined,
        heading: block.heading || undefined,
        paragraphs,
      };
    }
    case "GALLERY":
      if (block.images.length < 2) return null;
      return {
        type: "gallery",
        columns: block.columns,
        images: block.images.map(toPublicImage),
      };
    default:
      return null;
  }
}

export default function StoryPreviewPanel({
  categoryName,
  categorySlug,
  title,
  summary,
  coverImageSrc,
  coverImageAlt,
  overview,
  sessionDetails,
  blocks,
  cta,
}: {
  categoryName: string;
  categorySlug: string;
  title: string;
  summary: string;
  coverImageSrc: string;
  coverImageAlt: string;
  overview: StoryOverviewDraft;
  sessionDetails: SessionDetailsDraft;
  blocks: EditableBlock[];
  cta: StoryCtaDraft;
}) {
  const coverImage: PublicPortfolioImage = {
    id: "preview-cover",
    src: coverImageSrc,
    alt: coverImageAlt,
  };
  const publicBlocks = blocks
    .map(toPublicBlock)
    .filter((block): block is PortfolioBlock => block !== null);
  const lightboxImages: PublicPortfolioImage[] = [
    coverImage,
    ...publicBlocks.flatMap((block) => {
      if (block.type === "gallery") return block.images;
      if (block.type === "image" || block.type === "imageText") return [block.image];
      return [];
    }),
  ];

  const hasSessionDetails = Boolean(
    sessionDetails.service ||
      sessionDetails.location ||
      sessionDetails.style ||
      sessionDetails.setting
  );
  const publicSessionDetails: PortfolioSessionDetails | undefined = hasSessionDetails
    ? {
        service: sessionDetails.service || undefined,
        location: sessionDetails.location || undefined,
        style: sessionDetails.style || undefined,
        setting: sessionDetails.setting || undefined,
      }
    : undefined;

  const overviewParagraphs = splitParagraphs(overview.paragraphs);

  return (
    <div className="overflow-hidden rounded border border-neutral-800">
      <div className="border-b border-neutral-800 bg-neutral-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
        Live preview (new images show a placeholder until saved)
      </div>
      <div className="max-h-[80vh] overflow-y-auto bg-white">
        <LightboxProvider images={lightboxImages}>
          <PortfolioHero
            categoryName={categoryName}
            categorySlug={categorySlug}
            title={title}
            summary={summary}
            sessionDetails={publicSessionDetails}
            coverImage={coverImage}
          />
          <PortfolioOverview
            eyebrow={overview.eyebrow || "The Session"}
            heading={overview.heading || undefined}
            paragraphs={overviewParagraphs.length > 0 ? overviewParagraphs : [summary]}
            sessionDetails={publicSessionDetails}
          />
          {publicBlocks.length > 0 && <PortfolioStoryRenderer blocks={publicBlocks} />}
        </LightboxProvider>
        <PortfolioBookingCTA
          categoryName={categoryName}
          workTitle={title}
          eyebrow={cta.eyebrow || undefined}
          heading={cta.heading || undefined}
          body={cta.body || undefined}
          primaryLabel={cta.primaryLabel || undefined}
          secondaryLabel={cta.secondaryLabel || undefined}
        />
      </div>
    </div>
  );
}
