import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import { getActiveTestimonials } from "@/src/lib/db/testimonials";
import { absoluteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Client Stories",
  description:
    "Read what clients say about SomStudioPhotography in Kathmandu, Nepal. Real reviews for wedding, portrait, maternity, graduation, event, and product photography.",
  alternates: {
    canonical: absoluteUrl("/testimonials"),
  },
};

const stats = [
  { value: "5/5", label: "Average client rating" },
  { value: "10+", label: "Service categories covered" },
  { value: "KTM / LTP / BKT", label: "Kathmandu, Lalitpur, Bhaktapur" },
];

type DatabaseTestimonial = Awaited<ReturnType<typeof getActiveTestimonials>>[number];

function TestimonialCard({ testimonial }: { testimonial: DatabaseTestimonial }) {
  return (
    <div className="flex flex-col rounded border border-neutral-200 bg-neutral-50 p-6 sm:p-7">
      <div
        className="mb-5 flex gap-0.5"
        aria-label={`Rating: ${testimonial.rating} out of 5`}
      >
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <span key={i} aria-hidden="true" className="text-sm text-gold">
            &#9733;
          </span>
        ))}
      </div>

      <blockquote className="mb-6 flex-1 text-sm leading-relaxed text-neutral-700">
        &ldquo;{testimonial.review}&rdquo;
      </blockquote>

      <footer className="border-t border-neutral-200 pt-5">
        <div className="mb-1 flex items-center gap-3">
          <div aria-hidden="true" className="h-px w-5 shrink-0 bg-gold" />
          <span className="text-sm font-semibold text-neutral-950">
            {testimonial.clientName}
          </span>
        </div>
        <p className="pl-8 text-xs text-neutral-500">
          {testimonial.serviceType}
        </p>
        {testimonial.location && (
          <p className="mt-0.5 pl-8 text-xs text-neutral-400">
            {testimonial.location}
          </p>
        )}
      </footer>
    </div>
  );
}

function EmptyTestimonialsFallback() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded border border-neutral-200 bg-white px-6 py-10 text-center">
      <p className="text-base leading-relaxed text-neutral-600">
        Client stories are being updated. Please contact us to learn more about our work.
      </p>
      <Button href="/contact" variant="primary" size="md">
        Contact Us
      </Button>
    </div>
  );
}

export default async function TestimonialsPage() {
  const testimonials = await getActiveTestimonials();

  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="Reviews"
        title="Client stories"
        subtitle="Real words from real people across Kathmandu, Lalitpur, and Bhaktapur."
        animated={false}
      />

      <section className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="grid grid-cols-1 divide-y divide-white/5 py-12 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-14">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 py-6 text-center sm:py-0"
              >
                <span className="text-2xl font-bold text-neutral-950 sm:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-[0.15em] text-brand">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="py-20 sm:py-28">
            <p className="mx-auto mb-14 max-w-2xl text-center text-base leading-relaxed text-neutral-600 sm:mb-16">
              These are unedited words from real clients across Kathmandu,
              Lalitpur, and Bhaktapur, shared after their sessions, prints,
              and gallery deliveries. We ask every client for honest feedback
              because it shapes how we plan future shoots and refine our
              editing style.
            </p>
            {testimonials.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial: DatabaseTestimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>
            ) : (
              <EmptyTestimonialsFallback />
            )}
            <p className="mt-14 text-center text-sm text-neutral-400">
              Every session is planned with care, comfort, and attention to detail.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Booking inquiry
            </p>
            <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
              Add your story next.
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
