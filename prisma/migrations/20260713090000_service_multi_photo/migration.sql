-- Replace Service.imageUrl (single, nullable) with Service.imageUrls (array)
-- so each service can show a rotating gallery of up to a few photos.
ALTER TABLE "services" ADD COLUMN "imageUrls" TEXT[] NOT NULL DEFAULT '{}';
UPDATE "services" SET "imageUrls" = ARRAY["imageUrl"] WHERE "imageUrl" IS NOT NULL;
ALTER TABLE "services" DROP COLUMN "imageUrl";
