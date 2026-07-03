import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Hero from "@/src/components/sections/Hero";
import HomeProof from "@/src/components/sections/HomeProof";
import Trust from "@/src/components/sections/Trust";
import About from "@/src/components/sections/About";
import Services from "@/src/components/sections/Services";
import PortfolioPreview from "@/src/components/sections/PortfolioPreview";
import Process from "@/src/components/sections/Process";
import Testimonials from "@/src/components/sections/Testimonials";
import LocationVisit from "@/src/components/sections/LocationVisit";
import FinalCTA from "@/src/components/sections/FinalCTA";
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
        <Hero />
        <HomeProof />
        <Trust />
        <About />
        <Services />
        <PortfolioPreview />
        <Process />
        <Testimonials />
        <LocationVisit />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
