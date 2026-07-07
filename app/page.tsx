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
import { portfolioCategories as staticPortfolioCategories } from "@/src/data/portfolio";
import { featuredServices as staticFeaturedServices } from "@/src/data/services";
import { testimonials as staticTestimonials } from "@/src/data/testimonials";
import {
  getActivePortfolioImages,
  getFeaturedPortfolioImages,
} from "@/src/lib/db/portfolio";
import { getFeaturedServices } from "@/src/lib/db/services";
import {
  getActiveTestimonials,
  getFeaturedTestimonials,
} from "@/src/lib/db/testimonials";
import { absoluteUrl, defaultDescription } from "@/src/lib/seo";
import type { PortfolioCategory } from "@/src/types/site";
import type { Service } from "@/src/types/site";
import type { Testimonial } from "@/src/types/site";

export const metadata: Metadata = {
  title: "Photography Studio in Kathmandu",
  description: defaultDescription,
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

type DatabaseService = Awaited<ReturnType<typeof getFeaturedServices>>[number];
type DatabasePortfolioImage = Awaited<ReturnType<typeof getFeaturedPortfolioImages>>[number];
type DatabaseTestimonial = Awaited<ReturnType<typeof getFeaturedTestimonials>>[number];

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

function toHomepageTestimonial(testimonial: DatabaseTestimonial): Testimonial {
  return {
    id: testimonial.id,
    name: testimonial.clientName,
    role: testimonial.serviceType,
    content: testimonial.review,
    rating: testimonial.rating,
    service: testimonial.serviceType,
    location: testimonial.location ?? "",
  };
}

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
  const databaseServices = await getFeaturedServices();
  const featuredPortfolioImages = await getFeaturedPortfolioImages();
  const activePortfolioImages =
    featuredPortfolioImages.length > 0 ? [] : await getActivePortfolioImages();
  const featuredTestimonials = await getFeaturedTestimonials();
  const activeTestimonials =
    featuredTestimonials.length > 0 ? [] : await getActiveTestimonials();
  const homepageServices =
    databaseServices.length > 0
      ? databaseServices.map(toHomepageService)
      : staticFeaturedServices;
  const databasePortfolioImages =
    featuredPortfolioImages.length > 0
      ? featuredPortfolioImages
      : activePortfolioImages.slice(0, 5);
  const homepagePortfolioCategories =
    databasePortfolioImages.length > 0
      ? databasePortfolioImages.map(toHomepagePortfolioCategory)
      : staticPortfolioCategories;
  const databaseTestimonials =
    featuredTestimonials.length > 0 ? featuredTestimonials : activeTestimonials.slice(0, 3);
  const homepageTestimonials =
    databaseTestimonials.length > 0
      ? databaseTestimonials.map(toHomepageTestimonial)
      : staticTestimonials;

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
          <PortfolioPreview categories={homepagePortfolioCategories} />
        </ScrollReveal>
        <ScrollReveal variant="lift-wide">
          <Testimonials testimonials={homepageTestimonials} />
        </ScrollReveal>
        <ScrollReveal variant="fade">
          <FinalCTA />
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
