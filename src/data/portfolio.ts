import type { PortfolioCategory, PortfolioWork } from "@/src/types/site";

export const portfolioCategories: PortfolioCategory[] = [
  {
    id: "wedding",
    title: "Weddings",
    description: "Beautiful wedding moments captured with care and artistry.",
    slug: "weddings",
    image: {
      src: "/images/portfolio/wedding.jpg",
      alt: "A wedding couple embracing while holding a bouquet.",
      credit: "Photo by Moose Photos on Pexels",
    },
  },
  {
    id: "pre-wedding",
    title: "Pre-Wedding",
    description: "Love stories told through creative pre-wedding sessions.",
    slug: "pre-wedding",
    image: {
      src: "/images/portfolio/pre-wedding.jpg",
      alt: "A couple in traditional attire posing outdoors during a pre-wedding shoot.",
      credit: "Photo by Christy Chacko on Pexels",
    },
  },
  {
    id: "portraits",
    title: "Portraits",
    description: "Timeless studio and outdoor portraits for every occasion.",
    slug: "portraits",
    image: {
      src: "/images/portfolio/portraits.jpg",
      alt: "A confident studio portrait of a man in a beige blazer.",
      credit: "Photo by Duy's House of Photo on Pexels",
    },
  },
  {
    id: "events",
    title: "Events",
    description: "Corporate events, ceremonies, and celebrations.",
    slug: "events",
    image: {
      src: "/images/portfolio/events.jpg",
      alt: "A group of colleagues celebrating together at a corporate event.",
      credit: "Photo by Yan Krukau on Pexels",
    },
  },
  {
    id: "maternity",
    title: "Maternity",
    description: "The glow and joy of expecting, beautifully documented.",
    slug: "maternity",
    image: {
      src: "/images/portfolio/maternity.jpg",
      alt: "A pregnant woman posing outdoors during a summer maternity photoshoot.",
      credit: "Photo by Dhemer Goncalves on Pexels",
    },
  },
  {
    id: "kids",
    title: "Kids",
    description: "Playful, candid moments that parents will treasure forever.",
    slug: "kids",
    image: {
      src: "/images/portfolio/kids.jpg",
      alt: "A playful studio portrait of a young child.",
      credit: "Photo by Poppy Martinez on Pexels",
    },
  },
  {
    id: "graduation",
    title: "Graduation",
    description: "Mark your milestone with striking, polished portraits worth framing.",
    slug: "graduation",
    image: {
      src: "/images/portfolio/graduation.jpg",
      alt: "Graduates celebrating together in academic gowns outdoors.",
      credit: "Photo by Max Anderson on Pexels",
    },
  },
  {
    id: "products",
    title: "Products",
    description: "Clean, compelling product images for brands and businesses.",
    slug: "products",
    image: {
      src: "/images/portfolio/products.jpg",
      alt: "An elegant perfume bottle with a water splash against a blue background.",
      credit: "Photo by Bolarinwa Olasunkanmi on Pexels",
    },
  },
];

const heroCoupleImage = {
  src: "/images/portfolio/hero-couple.jpg",
  alt: "A couple embracing during an outdoor wedding portrait session.",
  credit: "Temporary portfolio visual from Unsplash",
};

const portfolioStudioImage = {
  src: "/images/portfolio/studio.jpg",
  alt: "A photographer working with professional studio lighting equipment.",
  credit: "Temporary portfolio visual from Unsplash",
};

const weddingDetailsImage = {
  src: "/images/portfolio/wedding-details.jpg",
  alt: "Wedding rings and floral details arranged for a detail photograph.",
  credit: "Temporary portfolio visual from Unsplash",
};

const preWeddingGalleryImage = {
  src: "/images/visuals/hero-gallery-3.jpg",
  alt: "A couple posing together during a romantic outdoor pre-wedding shoot.",
  credit: "Temporary portfolio visual from Unsplash",
};

const editorialPortraitImage = {
  src: "/images/portfolio/editorial-portrait.jpg",
  alt: "A softly lit editorial-style portrait.",
  credit: "Temporary portfolio visual from Unsplash",
};

const eventGuestMomentsImage = {
  src: "/images/portfolio/event-guest-moments.jpg",
  alt: "Guests enjoying a lively event with warm stage lighting.",
  credit: "Temporary portfolio visual from Unsplash",
};

const lifestyleProductsImage = {
  src: "/images/portfolio/lifestyle-products.jpg",
  alt: "A clean lifestyle product photograph of headphones.",
  credit: "Temporary portfolio visual from Unsplash",
};

const studioProductGalleryImage = {
  src: "/images/visuals/studio-gallery-3.jpg",
  alt: "A clean product photography composition on a minimal background.",
  credit: "Temporary portfolio visual from Unsplash",
};

export const portfolioWorks: PortfolioWork[] = [
  {
    id: "heritage-wedding-story",
    categoryId: "wedding",
    title: "Heritage Wedding Story",
    description:
      "A warm wedding series focused on rituals, family portraits, and quiet in-between moments.",
    location: "Kathmandu",
    featured: true,
    image: portfolioCategories[0].image,
    gallery: [heroCoupleImage, weddingDetailsImage],
  },
  {
    id: "golden-hour-couple",
    categoryId: "pre-wedding",
    title: "Golden Hour Couple Session",
    description:
      "A relaxed outdoor pre-wedding session with natural posing and soft evening light.",
    location: "Lalitpur",
    featured: true,
    image: portfolioCategories[1].image,
    gallery: [heroCoupleImage, preWeddingGalleryImage],
  },
  {
    id: "studio-profile-portraits",
    categoryId: "portraits",
    title: "Studio Profile Portraits",
    description:
      "Clean portraits for professional profiles, personal branding, and family keepsakes.",
    location: "Basundhara Studio",
    featured: true,
    image: portfolioCategories[2].image,
    gallery: [portfolioStudioImage, editorialPortraitImage],
  },
  {
    id: "corporate-evening",
    categoryId: "events",
    title: "Corporate Evening Coverage",
    description:
      "Event coverage balancing guest interactions, stage moments, decor, and group photos.",
    location: "Kathmandu",
    image: portfolioCategories[3].image,
    gallery: [eventGuestMomentsImage],
  },
  {
    id: "soft-maternity-session",
    categoryId: "maternity",
    title: "Soft Maternity Session",
    description:
      "Gentle maternity portraits planned around comfort, calm direction, and family connection.",
    location: "Studio & Outdoor",
    image: portfolioCategories[4].image,
    gallery: [portfolioStudioImage],
  },
  {
    id: "kids-milestone-portraits",
    categoryId: "kids",
    title: "Kids Milestone Portraits",
    description:
      "Playful portraits built around patience, movement, and genuine expressions.",
    location: "Basundhara Studio",
    image: portfolioCategories[5].image,
    gallery: [portfolioCategories[2].image],
  },
  {
    id: "graduation-day-portraits",
    categoryId: "graduation",
    title: "Graduation Day Portraits",
    description:
      "Polished graduation portraits with individual, family, and formal looks.",
    location: "Kathmandu",
    image: portfolioCategories[6].image,
    gallery: [editorialPortraitImage],
  },
  {
    id: "clean-product-catalogue",
    categoryId: "products",
    title: "Clean Product Catalogue",
    description:
      "Minimal product images for catalogues, online stores, and social media campaigns.",
    location: "Studio",
    image: portfolioCategories[7].image,
    gallery: [lifestyleProductsImage, studioProductGalleryImage],
  },
  {
    id: "wedding-details",
    categoryId: "wedding",
    title: "Wedding Details & Decor",
    description:
      "Detail-focused coverage of rings, decor, florals, tables, and venue atmosphere.",
    location: "Kathmandu",
    image: weddingDetailsImage,
    gallery: [portfolioCategories[0].image],
  },
  {
    id: "editorial-portrait",
    categoryId: "portraits",
    title: "Editorial Portrait Study",
    description:
      "A portrait set shaped with simple styling, careful light, and confident direction.",
    location: "Studio",
    image: editorialPortraitImage,
    gallery: [portfolioCategories[2].image, portfolioStudioImage],
  },
  {
    id: "event-guest-moments",
    categoryId: "events",
    title: "Guest Moments",
    description:
      "Candid guest coverage that preserves the energy and people behind the event.",
    location: "Kathmandu",
    image: eventGuestMomentsImage,
    gallery: [portfolioCategories[3].image],
  },
  {
    id: "lifestyle-products",
    categoryId: "products",
    title: "Lifestyle Product Set",
    description:
      "Brand-friendly product photos with clean styling, props, and controlled light.",
    location: "Studio",
    image: lifestyleProductsImage,
    gallery: [portfolioCategories[7].image, studioProductGalleryImage],
  },
];
