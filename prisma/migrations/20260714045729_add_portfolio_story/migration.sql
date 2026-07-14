-- CreateEnum
CREATE TYPE "PortfolioStoryBlockType" AS ENUM ('TEXT', 'IMAGE', 'GALLERY', 'IMAGE_TEXT');

-- CreateTable
CREATE TABLE "portfolio_stories" (
    "id" TEXT NOT NULL,
    "portfolioImageId" TEXT NOT NULL,
    "overviewEyebrow" TEXT,
    "overviewHeading" TEXT,
    "overviewParagraphs" JSONB,
    "service" TEXT,
    "location" TEXT,
    "style" TEXT,
    "setting" TEXT,
    "ctaEyebrow" TEXT,
    "ctaHeading" TEXT,
    "ctaBody" TEXT,
    "primaryCtaLabel" TEXT,
    "secondaryCtaLabel" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_story_blocks" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "type" "PortfolioStoryBlockType" NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_story_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_stories_portfolioImageId_key" ON "portfolio_stories"("portfolioImageId");

-- CreateIndex
CREATE INDEX "portfolio_story_blocks_storyId_sortOrder_idx" ON "portfolio_story_blocks"("storyId", "sortOrder");

-- AddForeignKey
ALTER TABLE "portfolio_stories" ADD CONSTRAINT "portfolio_stories_portfolioImageId_fkey" FOREIGN KEY ("portfolioImageId") REFERENCES "portfolio_images"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_story_blocks" ADD CONSTRAINT "portfolio_story_blocks_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "portfolio_stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
