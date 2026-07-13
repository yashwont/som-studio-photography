-- Consolidate Service.shortDescription/fullDescription into a single Service.description column.
ALTER TABLE "services" RENAME COLUMN "shortDescription" TO "description";
ALTER TABLE "services" DROP COLUMN "fullDescription";
