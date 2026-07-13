import { prisma } from "@/src/lib/prisma";

export function getAdminPortfolioCategories() {
  return prisma.portfolioCategory.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { images: true },
      },
    },
  });
}

export function getAdminPortfolioCategoryById(id: string) {
  return prisma.portfolioCategory.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
      images: {
        orderBy: {
          displayOrder: "asc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          imageUrl: true,
          featured: true,
          active: true,
          displayOrder: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}

export function getAdminPortfolioCategoriesForSelect() {
  return prisma.portfolioCategory.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}

export function getAdminPortfolioImageById(id: string) {
  return prisma.portfolioImage.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      altText: true,
      description: true,
      featured: true,
      active: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}
