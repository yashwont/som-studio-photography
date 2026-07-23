-- DropForeignKey
ALTER TABLE "portfolio_images" DROP CONSTRAINT "portfolio_images_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "portfolio_stories" DROP CONSTRAINT "portfolio_stories_portfolioImageId_fkey";

-- DropForeignKey
ALTER TABLE "portfolio_story_blocks" DROP CONSTRAINT "portfolio_story_blocks_storyId_fkey";

-- DropTable
DROP TABLE "portfolio_categories";

-- DropTable
DROP TABLE "portfolio_images";

-- DropTable
DROP TABLE "portfolio_stories";

-- DropTable
DROP TABLE "portfolio_story_blocks";

-- DropEnum
DROP TYPE "PortfolioStoryBlockType";

