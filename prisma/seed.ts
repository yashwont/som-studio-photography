import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { contactInfo } from "../src/data/contact";
import { navLinks, ctaLink } from "../src/data/navigation";
import { services } from "../src/data/services";
import { heroGallery, heroImage, studioGallery, studioImage } from "../src/data/visuals";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const adapter = new PrismaPg(databaseUrl);
const prisma = new PrismaClient({ adapter });

function priceToDecimal(price: string) {
  const numericPrice = price.replace(/[^\d.]/g, "");

  return numericPrice ? Number(numericPrice).toFixed(2) : null;
}

async function seedServicesAndPackages() {
  for (const [index, service] of services.entries()) {
    const price = priceToDecimal(service.price);

    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        description: service.description,
        price,
        inclusions: service.highlights,
        featured: service.featured,
        active: true,
        displayOrder: index,
      },
      create: {
        id: service.id,
        title: service.title,
        slug: service.slug,
        description: service.description,
        price,
        inclusions: service.highlights,
        featured: service.featured,
        active: true,
        displayOrder: index,
      },
    });
  }
}

async function seedSiteSettings() {
  const settings = [
    ["contact.info", contactInfo],
    ["navigation.links", navLinks],
    ["navigation.cta", ctaLink],
    ["visuals.heroImage", heroImage],
    ["visuals.heroGallery", heroGallery],
    ["visuals.studioImage", studioImage],
    ["visuals.studioGallery", studioGallery],
  ] as const;

  for (const [key, value] of settings) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {
        value: JSON.stringify(value),
      },
      create: {
        key,
        value: JSON.stringify(value),
      },
    });
  }
}

async function main() {
  await seedServicesAndPackages();
  await seedSiteSettings();
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
