import type { Service } from "@/src/types/site";

export const services: Service[] = [
  {
    id: "wedding",
    title: "Wedding Photography",
    description:
      "Timeless coverage of your wedding day — from the first look to the final dance. Every emotion, beautifully preserved.",
    highlights: [
      "Full-day coverage",
      "Candid & traditional shots",
      "Edited gallery delivered online",
      "Print-ready high-resolution files",
    ],
    slug: "wedding-photography",
    featured: true,
  },
  {
    id: "pre-wedding",
    title: "Pre-Wedding Photography",
    description:
      "Tell your love story before the big day. Creative, relaxed sessions at locations that mean the most to you.",
    highlights: [
      "Indoor & outdoor locations",
      "Creative direction & posing guidance",
      "Multiple outfit changes",
      "Same-week preview delivery",
    ],
    slug: "pre-wedding-photography",
    featured: true,
  },
  {
    id: "event",
    title: "Event Photography",
    description:
      "Professional coverage for corporate events, ceremonies, celebrations, and gatherings of all sizes.",
    highlights: [
      "Corporate & social events",
      "Quick turnaround delivery",
      "Editorial-style coverage",
      "Group & candid shots",
    ],
    slug: "event-photography",
    featured: false,
  },
  {
    id: "studio-portrait",
    title: "Studio Portrait",
    description:
      "Polished portraits for professionals, families, and individuals. Controlled lighting, premium results.",
    highlights: [
      "Professional studio setup",
      "Multiple backdrop options",
      "Individual & group portraits",
      "Retouched final images",
    ],
    slug: "studio-portrait",
    featured: true,
  },
  {
    id: "maternity",
    title: "Maternity Photoshoot",
    description:
      "Celebrate the journey to motherhood with elegant, heartfelt images that capture this beautiful chapter.",
    highlights: [
      "Studio & outdoor options",
      "Comfortable, guided sessions",
      "Partner & family included",
      "Soft, editorial editing style",
    ],
    slug: "maternity-photoshoot",
    featured: false,
  },
  {
    id: "graduation",
    title: "Graduation Photoshoot",
    description:
      "Mark your achievement with striking portraits. A session as memorable as the milestone itself.",
    highlights: [
      "Indoor & outdoor settings",
      "Cap & gown and casual looks",
      "Same-day preview available",
      "Shareable digital gallery",
    ],
    slug: "graduation-photoshoot",
    featured: false,
  },
  {
    id: "kids",
    title: "Kids Photoshoot",
    description:
      "Fun, playful sessions designed to capture children's natural personalities. Patience and creativity guaranteed.",
    highlights: [
      "Child-friendly studio environment",
      "Props & themed setups available",
      "Natural & candid moments",
      "Family group shots included",
    ],
    slug: "kids-photoshoot",
    featured: false,
  },
  {
    id: "product",
    title: "Product Photography",
    description:
      "High-quality product images for e-commerce, catalogues, and marketing. Clean, detailed, conversion-focused.",
    highlights: [
      "White background & lifestyle shots",
      "Detail & close-up photography",
      "Multiple angles per product",
      "E-commerce ready files",
    ],
    slug: "product-photography",
    featured: false,
  },
  {
    id: "passport",
    title: "Passport Photo",
    description:
      "Compliant passport and visa photos taken and printed on the spot. Fast, professional, and hassle-free.",
    highlights: [
      "Government-specification compliant",
      "Printed in-studio same day",
      "Multiple countries' formats accepted",
      "Digital copy provided",
    ],
    slug: "passport-photo",
    featured: false,
  },
  {
    id: "printing-framing",
    title: "Printing & Framing",
    description:
      "Turn your favourite images into premium prints. Fine art paper, canvas, frames, and custom album options.",
    highlights: [
      "Fine art & metallic prints",
      "Canvas & framed prints",
      "Custom photo albums",
      "Large format available",
    ],
    slug: "printing-framing",
    featured: false,
  },
  {
    id: "custom",
    title: "Others / Custom Requests",
    description:
      "Have a unique vision? We are happy to discuss custom photography projects tailored to your specific needs.",
    highlights: [
      "Flexible scheduling",
      "Creative collaboration",
      "Custom packages available",
      "Contact us to discuss",
    ],
    slug: "custom-requests",
    featured: false,
  },
];

export const featuredServices = services.filter((s) => s.featured);
