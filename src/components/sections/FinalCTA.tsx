import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import type { HomeContentData } from "@/src/lib/db/home";

export default function FinalCTA({ content }: { content: HomeContentData }) {
  return (
    <section className="relative overflow-hidden border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="relative py-14 sm:py-16 flex flex-col items-center text-center gap-3 max-w-xl mx-auto">

          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div aria-hidden="true" className="h-px w-6 shrink-0 bg-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900 sm:tracking-[0.2em]">
              {content.ctaEyebrow}
            </span>
            <div aria-hidden="true" className="h-px w-6 shrink-0 bg-gold" />
          </div>

          {/* Headline */}
          <h2 className="break-words text-xl font-bold tracking-tight text-neutral-950 sm:text-2xl">
            {content.ctaHeadline}
          </h2>

          {/* Subtitle */}
          <p className="text-sm leading-relaxed text-neutral-900">
            {content.ctaSubtitle}
          </p>

          {/* CTAs */}
          <div className="mt-1 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button href="/contact" variant="primary" size="md" className="w-full sm:w-auto">
              Book a Session
            </Button>
            <Button href="/services" variant="secondary" size="md" className="w-full sm:w-auto">
              View Services
            </Button>
          </div>

        </div>
      </Container>
    </section>
  );
}
