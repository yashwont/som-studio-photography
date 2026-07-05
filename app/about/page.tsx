import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import Trust from "@/src/components/sections/Trust";
import AboutShowcase from "@/src/components/sections/AboutShowcase";
import LocationVisit from "@/src/components/sections/LocationVisit";
import { contactInfo } from "@/src/data/contact";
import { absoluteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about SomStudioPhotography, a premium photography studio in Kathmandu, Nepal offering professional photography for weddings, portraits, events, and more.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
};

const highlights = [
  {
    title: "Client-First Planning",
    description:
      "Every session starts with a conversation. We learn what you want, advise on timing and style, and make sure everything is prepared before the camera comes out.",
  },
  {
    title: "Creative Direction",
    description:
      "You don't need posing experience. We guide you through the session naturally so your images feel authentic, relaxed, and true to who you are.",
  },
  {
    title: "Polished Editing",
    description:
      "Every image is individually selected and carefully refined before delivery. No bulk exports - only the best frames, edited to a consistent standard.",
  },
  {
    title: "Studio & Outdoor",
    description:
      "We work in our private studio and on location across Kathmandu. Controlled lighting or natural settings - we adapt to whatever serves your vision.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="Our Story"
        title="Built for meaningful moments."
        subtitle="A photography studio in Kathmandu, Nepal, focused on images worth keeping."
      />

      {/* Studio story */}
      <section className="bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start py-20 sm:py-28">

            <div className="space-y-6">
              <p className="text-base leading-relaxed text-neutral-600">
                SomStudioPhotography is a professional photography studio based
                in Basundhara, Kathmandu. We focus on creating timeless images
                for people, families, events, and brands - photographs that
                clients are proud to keep, print, and share long after the
                session is over.
              </p>
              <p className="text-base leading-relaxed text-neutral-600">
                Our approach is straightforward: careful preparation, genuine
                creative direction during the session, and clean polished
                editing afterwards. We don&rsquo;t use a one-size-fits-all
                formula. Every client gets a personalised experience built
                around their comfort, their style, and what they want to
                remember.
              </p>
              <p className="text-base leading-relaxed text-neutral-600">
                We shoot in our private studio and on location across
                Kathmandu, Lalitpur, and beyond. Whether you need a clean
                controlled backdrop or an outdoor setting with character,
                we&rsquo;ll find the right environment for your shoot. From
                the first message to the final gallery, we keep the experience
                simple and professional.
              </p>

              <div className="pt-4 flex items-center gap-3">
                <div aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
                <span className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {contactInfo.address}, {contactInfo.city}, {contactInfo.country}
                </span>
              </div>
            </div>

            <AboutShowcase />

          </div>
        </Container>
      </section>

      {/* Highlights */}
      <section className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="py-20 sm:py-28">
            <div className="mb-12 sm:mb-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                What to expect
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                How we work with every client.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded border border-neutral-200 bg-neutral-50 p-6 transition-colors hover:border-neutral-300"
                >
                  <div aria-hidden="true" className="mb-5 h-px w-6 bg-gold" />
                  <h3 className="mb-2 text-sm font-semibold text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Studio details */}
      <section className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-16 sm:py-20">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.15em] text-brand">
                Location
              </p>
              <p className="text-sm text-neutral-700">
                {contactInfo.address}, {contactInfo.city}
              </p>
              <p className="text-sm text-neutral-500">{contactInfo.country}</p>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.15em] text-brand">
                Studio Hours
              </p>
              {contactInfo.businessHours.map((slot) => (
                <p key={slot.days} className="text-sm text-neutral-500">
                  <span className="text-neutral-700">{slot.days}</span> - {slot.hours}
                </p>
              ))}
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.15em] text-brand">
                Get in Touch
              </p>
              <a
                href={`tel:${contactInfo.phone}`}
                className="block text-sm text-neutral-700 hover:text-neutral-950 transition-colors"
              >
                {contactInfo.phone}
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="block text-sm text-neutral-500 hover:text-neutral-950 transition-colors mt-1 break-all"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Trust />
      <LocationVisit />

      {/* CTA */}
      <section className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 sm:py-20 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Ready to start?
            </p>
            <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
              Let&rsquo;s plan your next session.
            </h2>
            <p className="max-w-md text-neutral-600">
              Reach out and we&rsquo;ll take it from there - no complicated process.
            </p>
            <Button href="/contact" variant="primary" size="lg">
              Book a Session
            </Button>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
