/*
  Warnings:

  - You are about to drop the column `ctaButtonLabel` on the `about_content` table. All the data in the column will be lost.
  - You are about to drop the column `ctaDescription` on the `about_content` table. All the data in the column will be lost.
  - You are about to drop the column `ctaEyebrow` on the `about_content` table. All the data in the column will be lost.
  - You are about to drop the column `ctaTitle` on the `about_content` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "about_content" DROP COLUMN "ctaButtonLabel",
DROP COLUMN "ctaDescription",
DROP COLUMN "ctaEyebrow",
DROP COLUMN "ctaTitle";
