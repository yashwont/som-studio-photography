import type { Service } from "@/src/types/site";

export const services: Service[] = [
  {
    id: "new-born",
    title: "New Born Photography",
    description:
      "Gentle newborn sessions planned with patience, comfort, and soft styling for your baby's first portraits.",
    price: "NRS 12,000",
    highlights: [
      "Baby-safe posing",
      "Soft studio lighting",
      "Family portraits included",
      "Retouched final images",
    ],
    slug: "new-born-photography",
    featured: true,
  },
  {
    id: "kids",
    title: "Kids Photography",
    description:
      "Fun, playful sessions designed to capture children's natural expressions, energy, and personality.",
    price: "NRS 8,000",
    highlights: [
      "Child-friendly studio setup",
      "Props & themed setups available",
      "Natural candid moments",
      "Family group shots available",
    ],
    slug: "kids-photography",
    featured: true,
  },
  {
    id: "maternity",
    title: "Maternity Photography",
    description:
      "Elegant maternity portraits that celebrate this chapter with guided posing and soft, timeless editing.",
    price: "NRS 10,000",
    highlights: [
      "Studio & outdoor options",
      "Comfortable guided sessions",
      "Partner & family included",
      "Soft editorial editing",
    ],
    slug: "maternity-photography",
    featured: true,
  },
  {
    id: "family",
    title: "Family Photography",
    description:
      "Warm family portraits for parents, children, couples, and generations together in studio or on location.",
    price: "NRS 9,000",
    highlights: [
      "Studio & location sessions",
      "Guided group posing",
      "Candid family moments",
      "Retouched final images",
    ],
    slug: "family-photography",
    featured: false,
  },
  {
    id: "graduation",
    title: "Graduation Photography",
    description:
      "Mark your achievement with polished graduation portraits, cap-and-gown images, and family photos.",
    price: "NRS 7,000",
    highlights: [
      "Studio & outdoor options",
      "Cap & gown portraits",
      "Family photos included",
      "Shareable digital gallery",
    ],
    slug: "graduation-photography",
    featured: false,
  },
  {
    id: "portraits",
    title: "Portrait Photography",
    description:
      "Clean, confident portraits for individuals, professionals, couples, and personal branding needs.",
    price: "NRS 5,000",
    highlights: [
      "Professional studio setup",
      "Multiple backdrop options",
      "Creative posing guidance",
      "Retouched final images",
    ],
    slug: "portrait-photography",
    featured: false,
  },
  {
    id: "wedding",
    title: "Wedding Photography",
    description:
      "Timeless wedding coverage from rituals and portraits to candid moments with family and guests.",
    price: "NRS 60,000",
    highlights: [
      "Full-day coverage",
      "Candid & traditional shots",
      "Edited gallery delivered online",
      "Print-ready high-resolution files",
    ],
    slug: "wedding-photography",
    featured: false,
  },
  {
    id: "pre-wedding",
    title: "Pre-Wedding Photography",
    description:
      "Creative pre-wedding portraits that tell your story with location planning, posing, and styling support.",
    price: "NRS 25,000",
    highlights: [
      "Indoor & outdoor locations",
      "Creative direction",
      "Multiple outfit changes",
      "Edited couple portraits",
    ],
    slug: "pre-wedding-photography",
    featured: false,
  },
  {
    id: "events",
    title: "Event Photography",
    description:
      "Professional coverage for ceremonies, birthdays, corporate programs, and social gatherings.",
    price: "NRS 18,000",
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
    id: "product",
    title: "Product Photography",
    description:
      "Clean product images for e-commerce, catalogues, menus, and marketing with detail-focused lighting.",
    price: "NRS 6,000",
    highlights: [
      "White background & lifestyle shots",
      "Detail & close-up photography",
      "Multiple angles per product",
      "E-commerce ready files",
    ],
    slug: "product-photography",
    featured: false,
  },
];

export const featuredServices = services.filter((s) => s.featured);
