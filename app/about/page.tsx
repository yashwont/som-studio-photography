import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import { contactInfo } from "@/src/data/contact";

export const metadata: Metadata = {
  title: "About — SomStudioPhotography",
  description:
    "Learn about SomStudioPhotography, a premium photography studio in Kathmandu, Nepal offering professional photography for weddings, portraits, events, and more.",
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
      "Every image is individually selected and carefully refined before delivery. No bulk exports — only the best frames, edited to a consistent standard.",
  },
  {
    title: "Studio & Outdoor",
    description:
      "We work in our private studio and on location across Kathmandu. Controlled lighting or natural settings — we adapt to whatever serves your vision.",
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
      <section className="bg-black">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start py-20 sm:py-28">

            <div className="space-y-6">
              <p className="text-base leading-relaxed text-zinc-400">
                SomStudioPhotography is a professional photography studio based
                in Lazimpat, Kathmandu. We focus on creating timeless images
                for people, families, events, and brands — photographs that
                clients are proud to keep, print, and share long after the
                session is over.
              </p>
              <p className="text-base leading-relaxed text-zinc-400">
                Our approach is straightforward: careful preparation, genuine
                creative direction during the session, and clean polished
                editing afterwards. We don&rsquo;t use a one-size-fits-all
                formula. Every client gets a personalised experience built
                around their comfort, their style, and what they want to
                remember.
              </p>
              <p className="text-base leading-relaxed text-zinc-400">
                We shoot in our private studio and on location across
                Kathmandu, Lalitpur, and beyond. Whether you need a clean
                controlled backdrop or an outdoor setting with character,
                we&rsquo;ll find the right environment for your shoot. From
                the first message to the final gallery, we keep the experience
                simple and professional.
              </p>

              <div className="pt-4 flex items-center gap-3">
                <div aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                  {contactInfo.address}, {contactInfo.city}, {contactInfo.country}
                </span>
              </div>
            </div>

            {/* Studio image placeholder */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-3/4 bg-gradient-to-r from-gold to-transparent"
              />
              <div className="relative h-72 overflow-hidden rounded border border-zinc-800 bg-zinc-900 sm:h-96 lg:h-[480px]">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-zinc-900 to-zinc-950" />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.035]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #fff 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="absolute right-5 top-5 h-5 w-5 border-r border-t border-gold/40"
                />
                <div
                  aria-hidden="true"
                  className="absolute bottom-5 left-5 h-5 w-5 border-b border-l border-gold/40"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700">
                    <span aria-hidden="true" className="text-base leading-none text-zinc-600">◎</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                    Studio Image
                  </p>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute -bottom-px right-0 h-px w-3/4 bg-gradient-to-l from-gold/50 to-transparent"
              />
            </div>

          </div>
        </Container>
      </section>

      {/* Highlights */}
      <section className="bg-zinc-950 border-t border-white/5">
        <Container>
          <div className="py-20 sm:py-28">
            <div className="mb-12 sm:mb-14">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                What to expect
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                How we work with every client.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700"
                >
                  <div aria-hidden="true" className="mb-5 h-px w-6 bg-gold" />
                  <h3 className="mb-2 text-sm font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Studio details */}
      <section className="bg-black border-t border-white/5">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 py-16 sm:py-20">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-600">
                Location
              </p>
              <p className="text-sm text-zinc-300">
                {contactInfo.address}, {contactInfo.city}
              </p>
              <p className="text-sm text-zinc-500">{contactInfo.country}</p>
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-600">
                Studio Hours
              </p>
              {contactInfo.businessHours.map((slot) => (
                <p key={slot.days} className="text-sm text-zinc-500">
                  <span className="text-zinc-300">{slot.days}</span> — {slot.hours}
                </p>
              ))}
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-600">
                Get in Touch
              </p>
              <a
                href={`tel:${contactInfo.phone}`}
                className="block text-sm text-zinc-300 hover:text-white transition-colors"
              >
                {contactInfo.phone}
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="block text-sm text-zinc-500 hover:text-white transition-colors mt-1 break-all"
              >
                {contactInfo.email}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-zinc-950 border-t border-white/5">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 sm:py-20 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Ready to start?
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Let&rsquo;s plan your next session.
            </h2>
            <p className="max-w-md text-zinc-400">
              Reach out and we&rsquo;ll take it from there — no complicated process.
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
