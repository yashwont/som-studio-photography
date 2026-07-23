export type PortfolioImage = {
  src: string;
  alt: string;
};

export type PortfolioServiceInput = {
  id: string;
  title: string;
  slug: string;
  description: string;
  galleryIntro?: string | null;
  galleryClosing?: string | null;
  imageUrls: string[];
};

export type PortfolioCategory = {
  id: string;
  title: string;
  description: string;
  galleryIntro?: string | null;
  galleryClosing?: string | null;
  serviceId?: string;
  images: PortfolioImage[];
};

export const fallbackCategories: PortfolioCategory[] = [
  {
    id: "wedding",
    title: "Wedding",
    description:
      "Rituals, portraits, family moments, and quiet details from full wedding days.",
    images: [
      {
        src: "/images/portfolio/wedding.jpg",
        alt: "Wedding couple photographed during an outdoor portrait session.",
      },
      {
        src: "/images/portfolio/wedding-details.jpg",
        alt: "Wedding details arranged for a close-up photography composition.",
      },
      {
        src: "/images/portfolio/hero-couple.jpg",
        alt: "Couple holding each other during a romantic wedding portrait.",
      },
    ],
  },
  {
    id: "pre-wedding",
    title: "Pre-Wedding",
    description:
      "Styled couple portraits with location planning, posing direction, and cinematic frames.",
    images: [
      {
        src: "/images/portfolio/pre-wedding.jpg",
        alt: "Couple posing together during a pre-wedding photo session.",
      },
      {
        src: "/images/portfolio/hero-couple.jpg",
        alt: "Couple sharing a quiet moment during an outdoor portrait session.",
      },
    ],
  },
  {
    id: "maternity",
    title: "Maternity",
    description:
      "Soft, elegant portraits for expecting mothers and growing families.",
    images: [
      {
        src: "/images/portfolio/maternity.jpg",
        alt: "Expecting mother photographed in a soft maternity portrait.",
      },
      {
        src: "/images/portfolio/studio.jpg",
        alt: "Studio portrait setup with soft lighting for a family session.",
      },
    ],
  },
  {
    id: "kids",
    title: "Kids",
    description:
      "Playful studio portraits built around natural expressions and real personality.",
    images: [
      {
        src: "/images/portfolio/kids.jpg",
        alt: "Child photographed in a playful studio portrait session.",
      },
      {
        src: "/images/portfolio/portraits.jpg",
        alt: "Warm portrait session with clean studio lighting.",
      },
    ],
  },
  {
    id: "graduation",
    title: "Graduation",
    description:
      "Polished portraits for milestones, achievements, and family keepsakes.",
    images: [
      {
        src: "/images/portfolio/graduation.jpg",
        alt: "Graduation portrait photographed with a polished studio style.",
      },
      {
        src: "/images/portfolio/editorial-portrait.jpg",
        alt: "Editorial portrait with confident studio posing.",
      },
    ],
  },
  {
    id: "portraits",
    title: "Portraits",
    description:
      "Clean personal, couple, branding, and professional portraits with guided posing.",
    images: [
      {
        src: "/images/portfolio/portraits.jpg",
        alt: "Professional portrait photographed in a studio setting.",
      },
      {
        src: "/images/portfolio/editorial-portrait.jpg",
        alt: "Editorial portrait using minimal styling and studio light.",
      },
    ],
  },
  {
    id: "events",
    title: "Events",
    description:
      "Documentary coverage for birthdays, ceremonies, corporate programs, and gatherings.",
    images: [
      {
        src: "/images/portfolio/events.jpg",
        alt: "Event photography scene with guests gathered for a celebration.",
      },
      {
        src: "/images/portfolio/event-guest-moments.jpg",
        alt: "Candid guest moment captured during a social event.",
      },
    ],
  },
  {
    id: "product",
    title: "Products",
    description:
      "Sharp product images for catalogues, e-commerce, menus, and brand campaigns.",
    images: [
      {
        src: "/images/portfolio/products.jpg",
        alt: "Clean product photography on a minimal studio background.",
      },
      {
        src: "/images/portfolio/lifestyle-products.jpg",
        alt: "Lifestyle product photography arranged for marketing use.",
      },
    ],
  },
];

function slugFromTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getFallbackForService(service: PortfolioServiceInput) {
  const serviceSlug = slugFromTitle(service.title);

  return (
    fallbackCategories.find(
      (category: PortfolioCategory) =>
        service.slug.includes(category.id) ||
        serviceSlug.includes(category.id) ||
        category.id.includes(service.slug)
    ) ?? null
  );
}

function imageAltFor(service: PortfolioServiceInput, index: number) {
  return `${service.title} portfolio image ${index + 1} by SomStudioPhotography.`;
}

export function buildPortfolioCategories(services: PortfolioServiceInput[]) {
  if (services.length === 0) {
    return fallbackCategories;
  }

  return services.map((service: PortfolioServiceInput) => {
    const fallback = getFallbackForService(service);
    const serviceImages = service.imageUrls.map(
      (src: string, index: number): PortfolioImage => ({
        src,
        alt: imageAltFor(service, index),
      })
    );

    return {
      id: service.slug,
      title: service.title.replace(/ Photography$/i, ""),
      description: service.description,
      galleryIntro: service.galleryIntro ?? null,
      galleryClosing: service.galleryClosing ?? null,
      serviceId: service.id,
      images:
        serviceImages.length > 0
          ? serviceImages
          : fallback?.images ?? fallbackCategories[0].images,
    };
  });
}

export function getHeroImages(categories: PortfolioCategory[]) {
  return categories
    .flatMap((category: PortfolioCategory) => category.images)
    .slice(0, 5);
}
