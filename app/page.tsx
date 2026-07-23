import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Hero from "@/src/components/sections/Hero";
import About from "@/src/components/sections/About";
import Services from "@/src/components/sections/Services";
import FinalCTA from "@/src/components/sections/FinalCTA";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { getContactInfo } from "@/src/lib/db/contact";
import { getHomeContent } from "@/src/lib/db/home";
import { absoluteUrl, defaultDescription } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Photography Studio in Kathmandu",
  description: defaultDescription,
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default async function Home() {
  const contact = await getContactInfo();
  const homeContent = await getHomeContent();

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
        <ScrollReveal variant="fade">
          <FinalCTA content={homeContent} />
        </ScrollReveal>
      </main>
      <Footer contact={contact} />
    </>
  );
}
