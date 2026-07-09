-- AlterEnum
ALTER TYPE "InquiryStatus" ADD VALUE 'BOOKED';

-- AlterTable
ALTER TABLE "inquiries" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "packageId" TEXT,
ADD COLUMN     "serviceId" TEXT;

-- CreateIndex
CREATE INDEX "inquiries_serviceId_idx" ON "inquiries"("serviceId");

-- CreateIndex
CREATE INDEX "inquiries_packageId_idx" ON "inquiries"("packageId");

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
