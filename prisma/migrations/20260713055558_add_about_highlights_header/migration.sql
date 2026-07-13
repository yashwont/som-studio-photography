/*
  Warnings:

  - Added the required column `highlightsEyebrow` to the `about_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `highlightsTitle` to the `about_content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "about_content" ADD COLUMN     "highlightsEyebrow" TEXT NOT NULL,
ADD COLUMN     "highlightsTitle" TEXT NOT NULL;
