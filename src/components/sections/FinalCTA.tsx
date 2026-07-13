import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="relative py-24 sm:py-32 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">

          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900 sm:tracking-[0.2em]">
              Booking inquiry
            </span>
            <div aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
          </div>

          {/* Headline */}
          <h2 className="break-words text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl xl:text-5xl">
            Plan your next photoshoot
          </h2>

          {/* Subtitle */}
          <p className="text-base leading-relaxed text-neutral-900">
            Tell us about your session, preferred date, and style. We&rsquo;ll
            help you choose the right package, timing, and shoot plan.
          </p>

          {/* CTAs */}
          <div className="mt-2 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
              Book a Session
            </Button>
            <Button href="/portfolio" variant="secondary" size="lg" className="w-full sm:w-auto">
              View Portfolio
            </Button>
          </div>

        </div>
      </Container>
    </section>
  );
}
