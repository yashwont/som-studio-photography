import { prisma } from "@/src/lib/prisma";

export function getPortfolioCategories() {
  return prisma.portfolioCategory.findMany({
    include: {
      images: {
        where: {
          active: true,
        },
        orderBy: {
          displayOrder: "asc",
        },
      },
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export function getFeaturedPortfolioImages() {
  return prisma.portfolioImage.findMany({
    where: {
      active: true,
      featured: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export function getActivePortfolioImages() {
  return prisma.portfolioImage.findMany({
    where: {
      active: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}

export function getPortfolioImageBySlug(slug: string) {
  return prisma.portfolioImage.findFirst({
    where: {
      slug,
      active: true,
    },
    include: {
      category: true,
    },
  });
}

export function getPortfolioImagesByCategorySlug(slug: string) {
  return prisma.portfolioImage.findMany({
    where: {
      active: true,
      category: {
        slug,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      displayOrder: "asc",
    },
  });
}
