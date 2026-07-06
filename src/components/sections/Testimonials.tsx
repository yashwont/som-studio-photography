import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import { testimonials } from "@/src/data/testimonials";
import type { Testimonial } from "@/src/types/site";

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
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
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      <footer className="border-t border-neutral-200 pt-5">
        <div className="mb-1 flex items-center gap-3">
          <div aria-hidden="true" className="h-px w-5 shrink-0 bg-gold" />
          <span className="text-sm font-semibold text-neutral-950">
            {testimonial.name}
          </span>
        </div>
        <p className="pl-8 text-xs text-neutral-500">
          {testimonial.role} &middot; {testimonial.service}
        </p>
        <p className="mt-0.5 pl-8 text-xs text-neutral-400">
          {testimonial.location}
        </p>
      </footer>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-20 sm:py-28">
          <SectionHeader
            eyebrow="Reviews"
            title="Client stories"
            subtitle="Real feedback from clients across Kathmandu, Lalitpur, and Bhaktapur."
            centered={true}
            className="mb-14 sm:mb-16"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          <p className="mt-14 text-center text-sm text-neutral-400">
            Every session is planned with care, comfort, and attention to detail.
          </p>
        </div>
      </Container>
    </section>
  );
}
