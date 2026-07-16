import { prisma } from "@/src/lib/prisma";

/** Everything the story editor page needs: the portfolio item (read-only reference
 * section) plus its optional story and ordered blocks. */
export function getAdminPortfolioImageWithStory(portfolioImageId: string) {
  return prisma.portfolioImage.findUnique({
    where: { id: portfolioImageId },
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
      category: {
        select: { id: true, name: true, slug: true },
      },
      story: {
        include: {
          blocks: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });
}

/** Story-state summary for a single image (used by admin list/detail views). */
export function storyStateFrom(story: {
  service?: string | null;
  location?: string | null;
  style?: string | null;
  setting?: string | null;
  _count: { blocks: number };
} | null): "not-created" | "basic" | "complete" {
  if (!story) {
    return "not-created";
  }

  const hasSessionInfo = Boolean(
    story.service || story.location || story.style || story.setting
  );

  return hasSessionInfo && story._count.blocks > 0 ? "complete" : "basic";
}
