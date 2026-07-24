import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Hero from "@/src/components/sections/Hero";
import About from "@/src/components/sections/About";
import Services from "@/src/components/sections/Services";
import FinalCTA from "@/src/components/sections/FinalCTA";
import StudioReel from "@/src/components/sections/StudioReel";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { getContactInfo } from "@/src/lib/db/contact";
import { getHomeContent } from "@/src/lib/db/home";
import { getActiveServices } from "@/src/lib/db/services";
import {
  buildPortfolioCategories,
  type PortfolioImage,
} from "@/src/lib/portfolio/public-portfolio";
import { absoluteUrl, defaultDescription } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Photography Studio in Kathmandu",
  description: defaultDescription,
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default async function Home() {
  const [contact, homeContent, services] = await Promise.all([
    getContactInfo(),
    getHomeContent(),
    getActiveServices(),
  ]);

  // One cover shot per portfolio category feeds the homepage film reel.
  const reelImages: PortfolioImage[] = buildPortfolioCategories(services)
    .map((category) => category.images[0])
    .filter((image): image is PortfolioImage => Boolean(image))
    .slice(0, 10);

  return (
    <>
      <Navbar />
      <main>
        <ScrollReveal variant="fade">
          <Hero contact={contact} content={homeContent} />
        </ScrollReveal>
        <ScrollReveal variant="rise">
          <About content={homeContent} />
        </ScrollReveal>
        <ScrollReveal variant="rise">
          <Services content={homeContent} />
        </ScrollReveal>
        <ScrollReveal variant="rise">
          <StudioReel images={reelImages} />
        </ScrollReveal>
        <ScrollReveal variant="fade">
          <FinalCTA content={homeContent} />
        </ScrollReveal>
      </main>
      <Footer contact={contact} />
    </>
  );
}
