import { prisma } from "@/src/lib/prisma";

export function getActiveTestimonials() {
  return prisma.testimonial.findMany({
    where: {
      active: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export function getFeaturedTestimonials() {
  return prisma.testimonial.findMany({
    where: {
      active: true,
      featured: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}
