// One-off (but safely re-runnable) migration of the newborn portfolio story that used
// to live as hardcoded TypeScript in src/data/portfolio-stories.ts, now that
// PortfolioStory/PortfolioStoryBlock are the runtime source of truth for the public
// detail page. Run with: npx tsx prisma/migrate-newborn-story.ts
//
// Idempotent: re-running finds the same PortfolioImage by slug, upserts its
// PortfolioStory by portfolioImageId (unique), and replaces its blocks
// (delete-then-recreate) rather than duplicating them.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "@prisma/client";

const adapter = new PrismaPg(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({ adapter });

const NEWBORN_SLUG = "new-born-studio-portraits";

async function main() {
  const portfolioImage = await prisma.portfolioImage.findUnique({
    where: { slug: NEWBORN_SLUG },
    select: { id: true },
  });

  if (!portfolioImage) {
    throw new Error(
      `Could not find a portfolio image with slug "${NEWBORN_SLUG}" - nothing to migrate.`
    );
  }

  const story = await prisma.portfolioStory.upsert({
    where: { portfolioImageId: portfolioImage.id },
    create: {
      portfolioImageId: portfolioImage.id,
      overviewEyebrow: "The Session",
      overviewHeading: "Calm, unhurried, and led by the baby",
      overviewParagraphs: [
        "This newborn portrait session was designed around comfort, patience, and simplicity. We used soft studio lighting and minimal styling to keep the attention on the baby's expressions, tiny details, and connection with the family.",
        "The session included individual newborn portraits, close-up details, and relaxed family photographs. Every part of the shoot was completed at the baby's pace, allowing time for feeding, settling, and comforting whenever needed.",
      ],
      service: "Newborn Photography",
      location: "Basundhara Studio, Kathmandu",
      style: "Soft & Natural",
      setting: "Indoor Studio",
      ctaHeading:
        "Let us create calm, meaningful portraits of your baby's earliest days and your family's new beginning.",
    },
    update: {
      overviewEyebrow: "The Session",
      overviewHeading: "Calm, unhurried, and led by the baby",
      overviewParagraphs: [
        "This newborn portrait session was designed around comfort, patience, and simplicity. We used soft studio lighting and minimal styling to keep the attention on the baby's expressions, tiny details, and connection with the family.",
        "The session included individual newborn portraits, close-up details, and relaxed family photographs. Every part of the shoot was completed at the baby's pace, allowing time for feeding, settling, and comforting whenever needed.",
      ],
      service: "Newborn Photography",
      location: "Basundhara Studio, Kathmandu",
      style: "Soft & Natural",
      setting: "Indoor Studio",
      ctaHeading:
        "Let us create calm, meaningful portraits of your baby's earliest days and your family's new beginning.",
    },
    select: { id: true },
  });

  const blocks: { type: "TEXT" | "IMAGE_TEXT"; data: Prisma.InputJsonValue }[] = [
    {
      type: "IMAGE_TEXT",
      data: {
        imagePosition: "right",
        eyebrow: "Behind The Scenes",
        heading: "Ready before you arrive",
        paragraphs: [
          "Every newborn session starts with the studio prepared in advance - soft, even lighting, warmed wraps and backdrops, and a quiet room so baby can settle in without disruption.",
        ],
        image: {
          id: "newborn-studio-setup",
          src: "/images/portfolio/studio.jpg",
          alt: "A photographer adjusting a camera to prepare for a portrait session.",
        },
      },
    },
    {
      type: "TEXT",
      data: {
        eyebrow: "The Experience",
        heading: "Paced entirely around baby",
        paragraphs: [
          "There is no rush during a newborn session. We build in time for feeding, soothing, and settling between poses, so every portrait feels natural rather than forced.",
        ],
      },
    },
  ];

  await prisma.$transaction(async (tx) => {
    await tx.portfolioStoryBlock.deleteMany({ where: { storyId: story.id } });
    await tx.portfolioStoryBlock.createMany({
      data: blocks.map((block, index) => ({
        storyId: story.id,
        type: block.type,
        sortOrder: index,
        data: block.data,
      })),
    });
  });

  console.log(
    `Migrated newborn story (portfolioImageId=${portfolioImage.id}, storyId=${story.id}, ${blocks.length} blocks).`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
