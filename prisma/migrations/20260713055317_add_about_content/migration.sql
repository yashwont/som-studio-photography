-- CreateTable
CREATE TABLE "about_content" (
    "id" TEXT NOT NULL,
    "heroEyebrow" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "storyParagraph1" TEXT NOT NULL,
    "storyParagraph2" TEXT NOT NULL,
    "storyParagraph3" TEXT NOT NULL,
    "highlights" JSONB NOT NULL,
    "ctaEyebrow" TEXT NOT NULL,
    "ctaTitle" TEXT NOT NULL,
    "ctaDescription" TEXT NOT NULL,
    "ctaButtonLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_content_pkey" PRIMARY KEY ("id")
);
