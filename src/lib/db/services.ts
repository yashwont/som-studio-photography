import { prisma } from "@/src/lib/prisma";

export function getActiveServices() {
  return prisma.service.findMany({
    where: {
      active: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export function getFeaturedServices() {
  return prisma.service.findMany({
    where: {
      active: true,
      featured: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export function getServiceBySlug(slug: string) {
  return prisma.service.findFirst({
    where: {
      slug,
      active: true,
    },
  });
}
