import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import { testimonials } from "@/src/data/testimonials";
import type { Testimonial } from "@/src/types/site";

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="flex flex-col rounded border border-zinc-800 bg-zinc-900 p-6 sm:p-7">

      {/* Star rating */}
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

      {/* Review text — flex-1 pushes footer to bottom */}
      <blockquote className="mb-6 flex-1 text-sm leading-relaxed text-zinc-300">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      {/* Client info */}
      <footer className="border-t border-zinc-800 pt-5">
        <div className="mb-1 flex items-center gap-3">
          <div aria-hidden="true" className="h-px w-5 shrink-0 bg-gold" />
          <span className="text-sm font-semibold text-white">
            {testimonial.name}
          </span>
        </div>
        {/* pl-8 aligns with the name text (gold line 20px + gap 12px) */}
        <p className="pl-8 text-xs text-zinc-500">
          {testimonial.role} &middot; {testimonial.service}
        </p>
        <p className="mt-0.5 pl-8 text-xs text-zinc-600">{testimonial.location}</p>
      </footer>

    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-zinc-950 border-t border-white/5">
      <Container>
        <div className="py-20 sm:py-28">

          <SectionHeader
            eyebrow="Client Stories"
            title="What our clients say."
            subtitle="Real words from clients across Kathmandu, Lalitpur, and Bhaktapur."
            centered={true}
            className="mb-14 sm:mb-16"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>

          {/* Trust line */}
          <p className="mt-14 text-center text-sm text-zinc-600">
            Every session is planned with care, comfort, and attention to detail.
          </p>

        </div>
      </Container>
    </section>
  );
}
