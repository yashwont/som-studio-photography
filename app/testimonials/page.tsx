import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import { testimonials } from "@/src/data/testimonials";
import type { Testimonial } from "@/src/types/site";

export const metadata: Metadata = {
  title: "Client Stories — SomStudioPhotography",
  description:
    "Read what clients say about SomStudioPhotography in Kathmandu, Nepal. Real reviews for wedding, portrait, maternity, graduation, event, and product photography.",
};

const stats = [
  { value: "5 ★", label: "Average client rating" },
  { value: "10+", label: "Service categories covered" },
  { value: "KTM · LTP · BKT", label: "Kathmandu, Lalitpur, Bhaktapur" },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex flex-col rounded border border-zinc-800 bg-zinc-900 p-6 sm:p-7">
      <div
        className="mb-5 flex gap-0.5"
        aria-label={`Rating: ${testimonial.rating} out of 5`}
      >
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <span key={i} aria-hidden="true" className="text-sm text-gold">
            ★
          </span>
        ))}
      </div>

      <blockquote className="mb-6 flex-1 text-sm leading-relaxed text-zinc-300">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      <footer className="border-t border-zinc-800 pt-5">
        <div className="mb-1 flex items-center gap-3">
          <div aria-hidden="true" className="h-px w-5 shrink-0 bg-gold" />
          <span className="text-sm font-semibold text-white">
            {testimonial.name}
          </span>
        </div>
        <p className="pl-8 text-xs text-zinc-500">
          {testimonial.role} &middot; {testimonial.service}
        </p>
        <p className="mt-0.5 pl-8 text-xs text-zinc-600">
          {testimonial.location}
        </p>
      </footer>
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="Client Stories"
        title="What our clients say."
        subtitle="Real words from real people across Kathmandu, Lalitpur, and Bhaktapur."
      />

      {/* Stats band */}
      <section className="bg-black border-t border-white/5">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/5 py-12 sm:py-14">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 py-6 sm:py-0 text-center"
              >
                <span className="text-2xl font-bold text-white sm:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs text-zinc-600 uppercase tracking-[0.15em]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials grid */}
      <section className="bg-zinc-950 border-t border-white/5">
        <Container>
          <div className="py-20 sm:py-28">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
            <p className="mt-14 text-center text-sm text-zinc-600">
              Every session is planned with care, comfort, and attention to detail.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-black border-t border-white/5">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 sm:py-20 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Ready to add your own story?
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Book your session today.
            </h2>
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
