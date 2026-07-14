import { prisma } from "@/src/lib/prisma";

export function getPortfolioStoryByImageId(portfolioImageId: string) {
  return prisma.portfolioStory.findUnique({
    where: { portfolioImageId },
    include: {
      blocks: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}
