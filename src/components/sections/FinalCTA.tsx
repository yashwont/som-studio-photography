import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="relative bg-black border-t border-white/5 overflow-hidden">
      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.05] blur-3xl"
      />

      <Container>
        <div className="relative py-24 sm:py-32 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">

          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Let&rsquo;s Work Together
            </span>
            <div aria-hidden="true" className="h-px w-8 shrink-0 bg-gold" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl xl:text-5xl">
            Ready to plan your next photoshoot?
          </h2>

          {/* Subtitle */}
          <p className="text-base leading-relaxed text-zinc-400">
            Tell us about your session, preferred date, and style. We&rsquo;ll
            help you choose the right package, timing, and shoot plan.
          </p>

          {/* CTAs */}
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Button href="/contact" variant="primary" size="lg">
              Book a Session
            </Button>
            <Button href="/portfolio" variant="secondary" size="lg">
              View Portfolio
            </Button>
          </div>

        </div>
      </Container>
    </section>
  );
}
