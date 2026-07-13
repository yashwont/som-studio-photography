import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { contactInfo } from "../src/data/contact";
import { navLinks, ctaLink } from "../src/data/navigation";
import { portfolioCategories, portfolioWorks } from "../src/data/portfolio";
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
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        shortDescription: service.description,
        fullDescription: service.description,
        highlights: service.highlights,
        featured: service.featured,
        active: true,
        displayOrder: index,
      },
      create: {
        id: service.id,
        title: service.title,
        slug: service.slug,
        shortDescription: service.description,
        fullDescription: service.description,
        highlights: service.highlights,
        featured: service.featured,
        active: true,
        displayOrder: index,
      },
    });

    const packagePrice = priceToDecimal(service.price);

    await prisma.package.upsert({
      where: { id: `${service.id}-standard` },
      update: {
        name: "Standard Session",
        price: packagePrice,
        description: service.description,
        inclusions: service.highlights,
        active: true,
        displayOrder: 0,
        service: {
          connect: { slug: service.slug },
        },
      },
      create: {
        id: `${service.id}-standard`,
        name: "Standard Session",
        price: packagePrice,
        description: service.description,
        inclusions: service.highlights,
        active: true,
        displayOrder: 0,
        service: {
          connect: { slug: service.slug },
        },
      },
    });
  }
}

async function seedPortfolio() {
  for (const [index, category] of portfolioCategories.entries()) {
    await prisma.portfolioCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.title,
        description: category.description,
        displayOrder: index,
      },
      create: {
        id: category.id,
        name: category.title,
        slug: category.slug,
        description: category.description,
        displayOrder: index,
      },
    });
  }

  for (const [index, work] of portfolioWorks.entries()) {
    const category = portfolioCategories.find((item) => item.id === work.categoryId);

    if (!category) {
      throw new Error(`Missing portfolio category for work: ${work.id}`);
    }

    await prisma.portfolioImage.upsert({
      where: { slug: work.id },
      update: {
        title: work.title,
        imageUrl: work.image.src,
        altText: work.image.alt,
        description: work.description,
        featured: work.featured ?? false,
        active: true,
        displayOrder: index,
        category: {
          connect: { slug: category.slug },
        },
      },
      create: {
        id: work.id,
        title: work.title,
        slug: work.id,
        imageUrl: work.image.src,
        altText: work.image.alt,
        description: work.description,
        featured: work.featured ?? false,
        active: true,
        displayOrder: index,
        category: {
          connect: { slug: category.slug },
        },
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
  await seedPortfolio();
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
