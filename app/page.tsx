import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Hero from "@/src/components/sections/Hero";
import About from "@/src/components/sections/About";
import Services from "@/src/components/sections/Services";
import PortfolioPreview from "@/src/components/sections/PortfolioPreview";
import Testimonials from "@/src/components/sections/Testimonials";
import FinalCTA from "@/src/components/sections/FinalCTA";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { featuredServices as staticFeaturedServices } from "@/src/data/services";
import { getFeaturedServices } from "@/src/lib/db/services";
import { absoluteUrl, defaultDescription } from "@/src/lib/seo";
import type { Service } from "@/src/types/site";

export const metadata: Metadata = {
  title: "Photography Studio in Kathmandu",
  description: defaultDescription,
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

type DatabaseService = Awaited<ReturnType<typeof getFeaturedServices>>[number];

function formatPrice(service: DatabaseService) {
  const packagePrice = service.packages[0]?.price;

  if (!packagePrice) {
    return "Contact for pricing";
  }

  return `NRS ${packagePrice.toNumber().toLocaleString("en-US")}`;
}

function toHomepageService(service: DatabaseService): Service {
  return {
    id: service.id,
    title: service.title,
    description: service.shortDescription,
    price: formatPrice(service),
    highlights: service.highlights,
    slug: service.slug,
    featured: service.featured,
  };
}

export default async function Home() {
  const databaseServices = await getFeaturedServices();
  const homepageServices =
    databaseServices.length > 0
      ? databaseServices.map(toHomepageService)
      : staticFeaturedServices;

  return (
    <>
      <Navbar />
      <main>
        <ScrollReveal variant="soft-zoom">
          <Hero />
        </ScrollReveal>
        <ScrollReveal variant="tilt-right">
          <About />
        </ScrollReveal>
        <ScrollReveal variant="rise">
          <Services services={homepageServices} />
        </ScrollReveal>
        <ScrollReveal variant="clip-up">
          <PortfolioPreview />
        </ScrollReveal>
        <ScrollReveal variant="lift-wide">
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal variant="fade">
          <FinalCTA />
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
