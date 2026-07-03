import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import { processSteps } from "@/src/data/process";
import { absoluteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how to book a photography session at SomStudioPhotography in Kathmandu, Nepal. Five simple steps from inquiry to final gallery delivery.",
  alternates: {
    canonical: absoluteUrl("/process"),
  },
};

const stepDetails: Record<number, string[]> = {
  1: [
    "Share your shoot type, preferred date, and what you have in mind",
    "Contact us via phone, WhatsApp, or the inquiry form on our website",
    "We confirm availability and respond within a few hours during studio hours",
  ],
  2: [
    "A relaxed call or chat to finalise location, timing, and outfit ideas",
    "We'll suggest style references and help narrow down a shoot direction",
    "No question is too small - we want everything clear before the day",
  ],
  3: [
    "Once details are agreed, we lock in your date with a booking confirmation",
    "You receive a summary with everything you need to know for the session",
    "Simple and straightforward - no complicated paperwork or contracts",
  ],
  4: [
    "We guide you throughout so you feel relaxed and natural in front of the camera",
    "No prior posing experience needed - our job is to make it feel effortless",
    "Sessions run on schedule, but we allow breathing room for the best moments",
  ],
  5: [
    "Edited images delivered via a private online gallery within the agreed timeframe",
    "Full-resolution downloads included - ready to print, share, or frame",
    "Optional print products, photo albums, and frames available on request",
  ],
};

export default function ProcessPage() {
  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="How It Works"
        title="A simple, guided process from start to finish."
        subtitle="No confusion, no surprises - just clear steps from your first message to your final gallery."
      />

      <section className="bg-white border-t border-neutral-200">
        <Container>
          <div className="space-y-0 py-20 sm:py-28">
            {processSteps.map((step, index) => (
              <div
                key={step.step}
                className={`grid grid-cols-1 gap-8 py-12 sm:py-14 lg:grid-cols-[auto_1fr] lg:gap-16 ${
                  index < processSteps.length - 1
                    ? "border-b border-neutral-200"
                    : ""
                }`}
              >
                <div className="lg:w-24 lg:text-right">
                  <span className="text-5xl font-bold leading-none text-neutral-200 sm:text-6xl lg:text-7xl">
                    0{step.step}
                  </span>
                </div>

                <div className="max-w-2xl">
                  <div aria-hidden="true" className="mb-4 h-px w-8 bg-gold" />
                  <h2 className="mb-4 text-xl font-bold text-neutral-950 sm:text-2xl">
                    {step.title}
                  </h2>
                  <p className="mb-6 text-base leading-relaxed text-neutral-600">
                    {step.description}
                  </p>

                  <ul className="space-y-2.5">
                    {(stepDetails[step.step] ?? []).map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-3 text-sm text-neutral-500"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-px shrink-0 text-gold/50"
                        >
                          -
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="py-14 text-center sm:py-16">
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-neutral-500">
              From first message to final delivery, we keep the experience
              simple and professional. Every client is handled personally - no
              automated systems, no unanswered messages.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-white border-t border-neutral-200">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Ready to begin?
            </p>
            <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
              Start with a message.
            </h2>
            <p className="max-w-md text-neutral-600">
              Tell us about your shoot and we&rsquo;ll take it from step one.
            </p>
            <Button href="/contact" variant="primary" size="lg">
              Send an Inquiry
            </Button>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
