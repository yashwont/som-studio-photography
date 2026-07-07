import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to check database content.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl),
});

async function main() {
  const counts = {
    services: await prisma.service.count(),
    packages: await prisma.package.count(),
    portfolioCategories: await prisma.portfolioCategory.count(),
    portfolioImages: await prisma.portfolioImage.count(),
    testimonials: await prisma.testimonial.count(),
    siteSettings: await prisma.siteSetting.count(),
    inquiries: await prisma.inquiry.count(),
    bookings: await prisma.booking.count(),
    orders: await prisma.order.count(),
    payments: await prisma.payment.count(),
    adminUsers: await prisma.adminUser.count(),
  };

  console.log(JSON.stringify(counts, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
