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
