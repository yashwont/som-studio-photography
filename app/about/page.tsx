import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import AboutShowcase from "@/src/components/sections/AboutShowcase";
import LocationVisit from "@/src/components/sections/LocationVisit";
import { contactInfo } from "@/src/data/contact";
import { getAboutContent } from "@/src/lib/db/about";
import { absoluteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SomStudioPhotography, a premium photography studio in Kathmandu, Nepal offering professional photography for weddings, portraits, events, and more.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
};

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
      />

      {/* Studio story */}
      <section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start py-20 sm:py-28">

            <div className="space-y-6">
              <p className="text-base leading-relaxed text-neutral-900">
                {content.storyParagraph1}
              </p>
              {content.storyParagraph2 && (
                <p className="text-base leading-relaxed text-neutral-900">
                  {content.storyParagraph2}
                </p>
              )}
              {content.storyParagraph3 && (
                <p className="text-base leading-relaxed text-neutral-900">
                  {content.storyParagraph3}
                </p>
              )}

              <div className="pt-4 flex items-center gap-3">
                <div aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-900">
                  {contactInfo.address}, {contactInfo.city}, {contactInfo.country}
                </span>
              </div>
            </div>

            <AboutShowcase />

          </div>
        </Container>
      </section>

      {/* Highlights */}
      <ScrollReveal variant="clip-up">
        <section className="bg-neutral-50 border-t border-neutral-200">
          <Container>
            <div className="py-20 sm:py-28">
            <div className="mb-12 sm:mb-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                {content.highlightsEyebrow}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                {content.highlightsTitle}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {content.highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded border border-neutral-200 bg-neutral-50 p-6 transition-colors hover:border-neutral-300"
                >
                  <div aria-hidden="true" className="mb-5 h-px w-6 bg-gold" />
                  <h3 className="mb-2 text-sm font-semibold text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-900">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            </div>
          </Container>
        </section>
      </ScrollReveal>

      <ScrollReveal variant="rise">
        <LocationVisit />
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal variant="fade">
        <section className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 sm:py-20 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
              Ready to start?
            </p>
            <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
              Let&rsquo;s plan your next session.
            </h2>
            <p className="max-w-md text-neutral-900">
              Reach out and we&rsquo;ll take it from there - no complicated process.
            </p>
            <Button href="/contact" variant="primary" size="lg">
              Book a Session
            </Button>
          </div>
        </Container>
        </section>
      </ScrollReveal>

      <Footer />
    </>
  );
}
