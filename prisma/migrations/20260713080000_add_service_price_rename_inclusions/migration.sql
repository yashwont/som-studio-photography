-- Add a direct price field to Service and rename highlights -> inclusions.
ALTER TABLE "services" ADD COLUMN "price" DECIMAL(10,2);
ALTER TABLE "services" RENAME COLUMN "highlights" TO "inclusions";
