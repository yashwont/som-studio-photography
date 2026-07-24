import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import LocationVisit from "@/src/components/sections/LocationVisit";
import { getAboutContent } from "@/src/lib/db/about";
import { getContactInfo } from "@/src/lib/db/contact";
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
  const contact = await getContactInfo();

  return (
    <>
      <Navbar />

      {/* Editorial hero */}
      <section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 gap-12 pb-16 pt-28 sm:pb-20 sm:pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="hero-enter hero-enter-1">
              <div className="mb-5 flex items-center gap-3 text-gold">
                <div aria-hidden="true" className="accent-rule h-px w-10 shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  {content.heroEyebrow}
                </span>
              </div>
              <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl xl:text-6xl">
                {content.heroTitle}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-900">
                {content.heroSubtitle}
              </p>
            </div>

            <div className="hero-enter hero-enter-3 border-t-2 border-gold pt-6 lg:mt-3">
              <p className="font-serif text-2xl italic leading-snug text-neutral-950 sm:text-[1.75rem]">
                &ldquo;{content.quoteText}&rdquo;
              </p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-neutral-500">
                SomStudioPhotography
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Legacy / Since 1995 */}
      <section className="border-t border-neutral-200 bg-neutral-100">
        <Container>
          <ScrollReveal variant="rise" className="grid grid-cols-1 gap-10 py-20 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                <span aria-hidden="true" className="accent-rule h-px w-6" />
                Since 1995
              </p>
              <p className="mt-3 font-serif text-7xl font-semibold leading-none tracking-tight text-neutral-950 sm:text-8xl">
                30+
              </p>
              <p className="mt-2 text-xl font-semibold text-neutral-950 sm:text-2xl">
                Years of Photography
              </p>
            </div>

            <div className="space-y-5 lg:pt-1">
              <p className="text-base leading-relaxed text-neutral-900 sm:text-lg">
                {content.storyParagraph1}
              </p>
              {content.storyParagraph2 && (
                <p className="text-base leading-relaxed text-neutral-900 sm:text-lg">
                  {content.storyParagraph2}
                </p>
              )}
              {content.storyParagraph3 && (
                <p className="text-base leading-relaxed text-neutral-900 sm:text-lg">
                  {content.storyParagraph3}
                </p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <div aria-hidden="true" className="accent-rule h-px w-8 shrink-0" />
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-900">
                  {contact.address}, {contact.city}, {contact.country}
                </span>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Timeline */}
      <section className="border-t border-neutral-200 bg-white">
        <Container>
          <div className="py-20 sm:py-28">
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                {content.timelineEyebrow}
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                {content.timelineTitle}
              </h2>
            </div>

            <div>
              {content.timeline.map((item, index) => (
                <div key={item.year} className="grid grid-cols-[auto_1fr] gap-6 sm:gap-8">
                  <div className="flex flex-col items-center">
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 shrink-0 rounded-full bg-gold"
                    />
                    {index < content.timeline.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="mt-2 w-px flex-1 bg-neutral-200"
                      />
                    )}
                  </div>
                  <div className={index < content.timeline.length - 1 ? "pb-10" : undefined}>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                      {item.year}
                    </p>
                    <h3 className="mt-2 font-serif text-xl font-bold text-neutral-950 sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-900 sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Studio values */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="py-20 sm:py-28">
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                {content.highlightsEyebrow}
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                {content.highlightsTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 divide-y divide-neutral-200 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
              {content.highlights.map((item, index) => (
                <div
                  key={item.title}
                  className="py-8 first:pt-0 sm:px-8 sm:py-0 sm:first:pl-0"
                >
                  <span className="text-xs font-semibold text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-900">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Studio experience */}
      <section className="border-t border-neutral-200 bg-white">
        <Container>
          <div className="py-20 sm:py-28">
            <div className="mb-14 max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                {content.experienceEyebrow}
              </p>
              <h2 className="font-serif text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                {content.experienceTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {content.experienceSteps.map((step, index) => (
                <div key={step.title} className="border-l-2 border-neutral-200 pl-6">
                  <span className="text-3xl font-bold text-neutral-200">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-neutral-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-900">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Trust stats */}
      <section className="border-t border-neutral-200 bg-neutral-100">
        <Container>
          <ScrollReveal variant="rise" className="grid grid-cols-2 divide-y divide-neutral-300/70 py-16 sm:grid-cols-4 sm:divide-y-0 sm:divide-x sm:py-20">
            {content.stats.map((stat) => (
              <div key={stat.label} className="py-6 text-center first:pt-0 sm:px-6 sm:py-0 sm:first:pl-0">
                <p className="font-serif text-4xl font-semibold text-neutral-950 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.15em] text-neutral-600">
                  {stat.label}
                </p>
              </div>
            ))}
          </ScrollReveal>
        </Container>
      </section>

      <LocationVisit contact={contact} />

      {/* Final CTA */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <ScrollReveal variant="fade" className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Let&rsquo;s work together
            </p>
            <h2 className="max-w-xl font-serif text-3xl font-semibold text-neutral-950 sm:text-4xl">
              Ready to create something worth keeping?
            </h2>
            <p className="max-w-md text-neutral-900">
              Tell us about your session and we&rsquo;ll help you plan the
              right photography experience.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact" variant="primary" size="lg">
                Book a Session
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                View Services
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <Footer contact={contact} />
    </>
  );
}
