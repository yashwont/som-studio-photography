/*
  Warnings:

  - Added the required column `experienceEyebrow` to the `about_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experienceSteps` to the `about_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experienceTitle` to the `about_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quoteText` to the `about_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stats` to the `about_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeline` to the `about_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timelineEyebrow` to the `about_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timelineTitle` to the `about_content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "about_content" ADD COLUMN     "experienceEyebrow" TEXT NOT NULL,
ADD COLUMN     "experienceSteps" JSONB NOT NULL,
ADD COLUMN     "experienceTitle" TEXT NOT NULL,
ADD COLUMN     "quoteText" TEXT NOT NULL,
ADD COLUMN     "stats" JSONB NOT NULL,
ADD COLUMN     "timeline" JSONB NOT NULL,
ADD COLUMN     "timelineEyebrow" TEXT NOT NULL,
ADD COLUMN     "timelineTitle" TEXT NOT NULL;
