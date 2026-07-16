import { cache } from "react";
import { getSiteSetting, setSiteSetting } from "@/src/lib/db/site-settings";

export const HOME_CONTENT_KEY = "home.content";

export type HomeHighlight = {
  title: string;
  description: string;
};

export type HomeServiceCard = {
  title: string;
  tagline: string;
};

export type HomeReview = {
  quote: string;
  name: string;
  context: string;
  rating: number;
};

export type HomeContentData = {
  heroWelcomeText: string;
  heroTrustPoints: string[];
  heroServiceTags: string[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutParagraph: string;
  aboutLocationTag: string;
  aboutHighlights: HomeHighlight[];
  servicesEyebrow: string;
  servicesTitle: string;
  servicesSubtitle: string;
  serviceCards: HomeServiceCard[];
  reviewsEyebrow: string;
  reviewsTitle: string;
  reviews: HomeReview[];
  googleRating: number | null;
  googleReviewCount: number | null;
  googleReviewsSyncedAt: string | null;
  ctaEyebrow: string;
  ctaHeadline: string;
  ctaSubtitle: string;
};

export const defaultHomeContent: HomeContentData = {
  heroWelcomeText:
    "Welcome to Som Studio - where life's most cherished moments have been captured with elegance, artistry, and heart since 1995. For over three decades, we've had the honor of preserving families' most precious chapters - from the first flutter of maternity to your wedding day and every milestone in between - creating timeless imagery you'll treasure forever.",
  heroTrustPoints: [
    "Studio & outdoor sessions",
    "Guided posing and planning",
    "Edited online gallery delivery",
  ],
  heroServiceTags: [
    "New Born",
    "Kids",
    "Maternity",
    "Family",
    "Weddings",
    "Pre-Wedding",
  ],
  aboutEyebrow: "Studio overview",
  aboutTitle: "About SomStudioPhotography",
  aboutParagraph:
    "With over 30 years of experience since 1995, we are passionate about capturing life's most meaningful moments. Combining creativity with modern photography technology, we deliver high-quality images and a friendly, professional experience. From portraits and events to custom prints and albums, we're here to turn your special moments into lasting memories.",
  aboutLocationTag: "Kathmandu, Nepal",
  aboutHighlights: [
    {
      title: "Professional Guidance",
      description:
        "We walk with you from first inquiry to final delivery, offering clear guidance at every step so nothing feels uncertain.",
    },
    {
      title: "Creative Direction",
      description:
        "Every session is planned with intent - locations, lighting, and timing chosen to bring out natural, authentic moments.",
    },
    {
      title: "Polished Editing",
      description:
        "Each image goes through careful selection and refined editing before being delivered in full resolution.",
    },
    {
      title: "Studio & Outdoor",
      description:
        "We shoot in our private studio or on location across Kathmandu - flexible to your vision and comfort.",
    },
  ],
  servicesEyebrow: "Services",
  servicesTitle: "Our Services",
  servicesSubtitle: "Every story deserves to be told beautifully.",
  serviceCards: [
    { title: "Maternity", tagline: "Celebrating the beauty of new beginnings" },
    { title: "Newborn", tagline: "Tender, delicate moments in the earliest days" },
    { title: "Family & Child", tagline: "Authentic connection, elegantly captured" },
    { title: "Cake Smash", tagline: "Playful milestones with a touch of style" },
    { title: "Portraits", tagline: "Refined imagery that reflects who you are" },
    { title: "Weddings", tagline: "Your love story, artfully documented" },
    { title: "Commercial", tagline: "Polished visuals for brands and businesses" },
    { title: "Web Profile", tagline: "Professional headshots that make a lasting impression" },
  ],
  reviewsEyebrow: "Client reviews",
  reviewsTitle: "What clients are saying",
  reviews: [
    {
      quote:
        "Absolutely stunning photos, so professional and easy to work with. They made the whole session feel effortless.",
      name: "Priya S.",
      context: "Wedding Session",
      rating: 5,
    },
    {
      quote:
        "Best studio in Kathmandu, hands down. The team made us feel so comfortable the entire time.",
      name: "Rajesh T.",
      context: "Family Portraits",
      rating: 5,
    },
    {
      quote:
        "From the first consultation to the final gallery, everything felt effortless. Highly recommend.",
      name: "Anisha K.",
      context: "Maternity Session",
      rating: 5,
    },
  ],
  googleRating: null,
  googleReviewCount: null,
  googleReviewsSyncedAt: null,
  ctaEyebrow: "Booking inquiry",
  ctaHeadline: "Plan your next photoshoot",
  ctaSubtitle:
    "Tell us about your session, preferred date, and style. We'll help you choose the right package, timing, and shoot plan.",
};

function parseString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function parseNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function parseStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

function parseAboutHighlights(value: unknown): HomeHighlight[] {
  if (!Array.isArray(value)) {
    return defaultHomeContent.aboutHighlights;
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

  return highlights.length > 0 ? highlights : defaultHomeContent.aboutHighlights;
}

function parseServiceCards(value: unknown): HomeServiceCard[] {
  if (!Array.isArray(value)) {
    return defaultHomeContent.serviceCards;
  }

  const cards = value
    .filter(
      (item): item is { title: unknown; tagline: unknown } =>
        typeof item === "object" && item !== null
    )
    .map((item) => ({
      title: String((item as { title?: unknown }).title ?? ""),
      tagline: String((item as { tagline?: unknown }).tagline ?? ""),
    }))
    .filter((item) => item.title || item.tagline);

  return cards.length > 0 ? cards : defaultHomeContent.serviceCards;
}

function parseReviews(value: unknown): HomeReview[] {
  if (!Array.isArray(value)) {
    return defaultHomeContent.reviews;
  }

  const reviews = value
    .filter(
      (item): item is { quote: unknown; name: unknown; context: unknown; rating: unknown } =>
        typeof item === "object" && item !== null
    )
    .map((item) => {
      const ratingRaw = Number((item as { rating?: unknown }).rating);
      const rating = Number.isFinite(ratingRaw)
        ? Math.min(5, Math.max(1, Math.round(ratingRaw)))
        : 5;

      return {
        quote: String((item as { quote?: unknown }).quote ?? ""),
        name: String((item as { name?: unknown }).name ?? ""),
        context: String((item as { context?: unknown }).context ?? ""),
        rating,
      };
    })
    .filter((item) => item.quote || item.name);

  return reviews.length > 0 ? reviews : defaultHomeContent.reviews;
}

/** Reads home.content from SiteSetting, falling back to defaultHomeContent
 * for the whole object or any individual field that is missing/malformed. */
export const getHomeContent = cache(async (): Promise<HomeContentData> => {
  const setting = await getSiteSetting(HOME_CONTENT_KEY);

  if (!setting) {
    return defaultHomeContent;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(setting.value);
  } catch {
    return defaultHomeContent;
  }

  if (!parsed || typeof parsed !== "object") {
    return defaultHomeContent;
  }

  const candidate = parsed as Record<string, unknown>;

  return {
    heroWelcomeText: parseString(candidate.heroWelcomeText, defaultHomeContent.heroWelcomeText),
    heroTrustPoints: parseStringArray(candidate.heroTrustPoints, defaultHomeContent.heroTrustPoints),
    heroServiceTags: parseStringArray(candidate.heroServiceTags, defaultHomeContent.heroServiceTags),
    aboutEyebrow: parseString(candidate.aboutEyebrow, defaultHomeContent.aboutEyebrow),
    aboutTitle: parseString(candidate.aboutTitle, defaultHomeContent.aboutTitle),
    aboutParagraph: parseString(candidate.aboutParagraph, defaultHomeContent.aboutParagraph),
    aboutLocationTag: parseString(candidate.aboutLocationTag, defaultHomeContent.aboutLocationTag),
    aboutHighlights: parseAboutHighlights(candidate.aboutHighlights),
    servicesEyebrow: parseString(candidate.servicesEyebrow, defaultHomeContent.servicesEyebrow),
    servicesTitle: parseString(candidate.servicesTitle, defaultHomeContent.servicesTitle),
    servicesSubtitle: parseString(candidate.servicesSubtitle, defaultHomeContent.servicesSubtitle),
    serviceCards: parseServiceCards(candidate.serviceCards),
    reviewsEyebrow: parseString(candidate.reviewsEyebrow, defaultHomeContent.reviewsEyebrow),
    reviewsTitle: parseString(candidate.reviewsTitle, defaultHomeContent.reviewsTitle),
    reviews: parseReviews(candidate.reviews),
    googleRating: parseNullableNumber(candidate.googleRating),
    googleReviewCount: parseNullableNumber(candidate.googleReviewCount),
    googleReviewsSyncedAt: parseNullableString(candidate.googleReviewsSyncedAt),
    ctaEyebrow: parseString(candidate.ctaEyebrow, defaultHomeContent.ctaEyebrow),
    ctaHeadline: parseString(candidate.ctaHeadline, defaultHomeContent.ctaHeadline),
    ctaSubtitle: parseString(candidate.ctaSubtitle, defaultHomeContent.ctaSubtitle),
  };
});

/** Saves a partial update to the Home content, merging it onto whatever is
 * currently stored so that a section-specific admin page (e.g. just the
 * Final CTA) never clobbers fields owned by another section. */
export async function saveHomeContent(partial: Partial<HomeContentData>): Promise<void> {
  const current = await getHomeContent();
  const next: HomeContentData = { ...current, ...partial };

  await setSiteSetting(HOME_CONTENT_KEY, JSON.stringify(next));
}
