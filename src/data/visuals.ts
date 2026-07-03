import type { SiteImage } from "@/src/types/site";

export const heroImage: SiteImage = {
  src: "/images/visuals/hero.jpg",
  alt: "A couple holding each other during an outdoor wedding portrait session.",
  credit: "Temporary portfolio visual from Unsplash",
};

export const heroGallery: SiteImage[] = [
  heroImage,
  {
    src: "/images/visuals/hero-gallery-2.jpg",
    alt: "A bride and groom walking together after their wedding ceremony.",
    credit: "Temporary portfolio visual from Unsplash",
  },
  {
    src: "/images/visuals/hero-gallery-3.jpg",
    alt: "A couple posing together during a romantic outdoor pre-wedding shoot.",
    credit: "Temporary portfolio visual from Unsplash",
  },
];

export const studioImage: SiteImage = {
  src: "/images/visuals/studio.jpg",
  alt: "A photographer working with professional studio lighting equipment.",
  credit: "Temporary studio visual from Unsplash",
};

export const studioGallery: SiteImage[] = [
  studioImage,
  {
    src: "/images/visuals/studio-gallery-2.jpg",
    alt: "A clean professional portrait with soft natural light.",
    credit: "Temporary studio visual from Unsplash",
  },
  {
    src: "/images/visuals/studio-gallery-3.jpg",
    alt: "A clean product photography composition on a minimal background.",
    credit: "Temporary studio visual from Unsplash",
  },
];
