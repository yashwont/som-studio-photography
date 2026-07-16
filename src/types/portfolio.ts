// Structured content for a single portfolio detail page. This layers on top of the
// PortfolioImage/PortfolioCategory database records (title, slug, cover image, category)
// via the `PortfolioStory`/`PortfolioStoryBlock` Prisma models (see prisma/schema.prisma)
// and src/lib/portfolio/display.ts, which adapts Prisma records into this shape.

export interface PortfolioImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  /** Cloudinary public ID, when the image was uploaded through the story editor. */
  publicId?: string;
  width?: number;
  height?: number;
}

export type PortfolioBlock =
  | {
      type: "text";
      eyebrow?: string;
      heading?: string;
      paragraphs: string[];
    }
  | {
      type: "image";
      image: PortfolioImage;
      layout: "full" | "wide" | "portrait";
    }
  | {
      type: "gallery";
      columns: 2 | 3;
      images: PortfolioImage[];
    }
  | {
      type: "imageText";
      image: PortfolioImage;
      imagePosition: "left" | "right";
      eyebrow?: string;
      heading?: string;
      paragraphs: string[];
    };

export interface PortfolioSessionDetails {
  studio?: string;
  service?: string;
  location?: string;
  style?: string;
  setting?: string;
  sessionType?: string;
}

export interface PortfolioStoryContent {
  /** Overrides the hero banner's eyebrow (Section 1). Falls back to "{category} Photography". */
  heroEyebrow?: string;
  storyEyebrow?: string;
  storyHeading?: string;
  storyParagraphs: string[];
  sessionDetails?: PortfolioSessionDetails;
  blocks: PortfolioBlock[];
  /** Overrides for the booking CTA (Section 6). Falls back to a generic template. */
  ctaEyebrow?: string;
  ctaHeading?: string;
  ctaBody?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
}
