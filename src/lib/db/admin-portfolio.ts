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
