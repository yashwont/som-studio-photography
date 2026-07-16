import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Hero from "@/src/components/sections/Hero";
import About from "@/src/components/sections/About";
import Services from "@/src/components/sections/Services";
import PortfolioPreview from "@/src/components/sections/PortfolioPreview";
import FinalCTA from "@/src/components/sections/FinalCTA";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { portfolioCategories as staticPortfolioCategories } from "@/src/data/portfolio";
import {
  getActivePortfolioImages,
  getFeaturedPortfolioImages,
} from "@/src/lib/db/portfolio";
import { getContactInfo } from "@/src/lib/db/contact";
import { getHomeContent } from "@/src/lib/db/home";
import { absoluteUrl, defaultDescription } from "@/src/lib/seo";
import type { PortfolioCategory } from "@/src/types/site";

export const metadata: Metadata = {
  title: "Photography Studio in Kathmandu",
  description: defaultDescription,
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

type DatabasePortfolioImage = Awaited<ReturnType<typeof getFeaturedPortfolioImages>>[number];

function toHomepagePortfolioCategory(
  portfolioImage: DatabasePortfolioImage
): PortfolioCategory {
  return {
    id: portfolioImage.category.id,
    title: portfolioImage.category.name,
    description: portfolioImage.category.description ?? "",
    slug: portfolioImage.category.slug,
    image: {
      src: portfolioImage.imageUrl,
      alt: portfolioImage.altText,
    },
  };
}

export default async function Home() {
  const contact = await getContactInfo();
  const homeContent = await getHomeContent();
  const featuredPortfolioImages = await getFeaturedPortfolioImages();
  const activePortfolioImages =
    featuredPortfolioImages.length > 0 ? [] : await getActivePortfolioImages();
  const databasePortfolioImages =
    featuredPortfolioImages.length > 0
      ? featuredPortfolioImages
      : activePortfolioImages.slice(0, 5);
  const homepagePortfolioCategories =
    databasePortfolioImages.length > 0
      ? databasePortfolioImages.map(toHomepagePortfolioCategory)
      : staticPortfolioCategories;

  return (
    <>
      <Navbar />
      <main>
        <ScrollReveal variant="soft-zoom">
          <Hero contact={contact} content={homeContent} />
        </ScrollReveal>
        <ScrollReveal variant="tilt-right">
          <About content={homeContent} />
        </ScrollReveal>
        <ScrollReveal variant="rise">
          <Services content={homeContent} />
        </ScrollReveal>
        <ScrollReveal variant="clip-up">
          <PortfolioPreview categories={homepagePortfolioCategories} />
        </ScrollReveal>
        <ScrollReveal variant="fade">
          <FinalCTA content={homeContent} />
        </ScrollReveal>
      </main>
      <Footer contact={contact} />
    </>
  );
}
