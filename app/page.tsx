import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Hero from "@/src/components/sections/Hero";
import HomeProof from "@/src/components/sections/HomeProof";
import About from "@/src/components/sections/About";
import PortfolioPreview from "@/src/components/sections/PortfolioPreview";
import Process from "@/src/components/sections/Process";
import LocationVisit from "@/src/components/sections/LocationVisit";
import FinalCTA from "@/src/components/sections/FinalCTA";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { absoluteUrl, defaultDescription } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Photography Studio in Kathmandu",
  description: defaultDescription,
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <ScrollReveal variant="soft-zoom">
          <Hero />
        </ScrollReveal>
        <ScrollReveal variant="rise">
          <HomeProof />
        </ScrollReveal>
        <ScrollReveal variant="tilt-right">
          <About />
        </ScrollReveal>
        <ScrollReveal variant="clip-up">
          <PortfolioPreview />
        </ScrollReveal>
        <ScrollReveal variant="lift-wide">
          <Process />
        </ScrollReveal>
        <ScrollReveal variant="lift-wide">
          <LocationVisit />
        </ScrollReveal>
        <ScrollReveal variant="fade">
          <FinalCTA />
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}
