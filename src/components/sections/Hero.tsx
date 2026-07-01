import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";

const serviceHighlights = [
  "Weddings",
  "Pre-Wedding",
  "Portraits",
  "Events",
  "Maternity",
  "Products",
];

export default function Hero() {
  return (
    <section id="home" className="relative bg-black text-white overflow-hidden">
      {/* Ambient warm glow — very subtle, decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[5%] top-1/3 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-gold/[0.04] blur-3xl"
      />

      {/* Content — pushed below the fixed Navbar */}
      <div className="relative min-h-screen flex items-center pt-16 sm:pt-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-16 items-center py-12 sm:py-16">

            {/* ── Left column: text ── */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  aria-hidden="true"
                  className="h-px w-8 shrink-0 bg-gold"
                />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Premium Photography Studio
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl xl:text-6xl">
                Capturing Stories,
                <br />
                <span className="text-gold">Creating Memories.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
                Professional photography for weddings, pre-weddings, events,
                studio portraits, maternity, graduation, kids photoshoots,
                product photography, passport photos, printing, and framing.
              </p>

              {/* CTA buttons */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/portfolio" variant="primary" size="lg">
                  View Portfolio
                </Button>
                <Button href="/contact" variant="secondary" size="lg">
                  Book a Session
                </Button>
              </div>

              {/* Service tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {serviceHighlights.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right column: image placeholder ── */}
            <div className="relative">
              {/* Top accent line — fades right to left */}
              <div
                aria-hidden="true"
                className="absolute -top-px left-0 h-px w-3/4 bg-gradient-to-r from-gold to-transparent"
              />

              {/* Placeholder box */}
              <div className="relative h-64 overflow-hidden rounded border border-zinc-800 bg-zinc-900 sm:h-80 lg:h-[60vh]">
                {/* Soft inner gradient */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 via-zinc-900 to-zinc-950"
                />

                {/* Dot grid pattern */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Left vertical gold accent */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-[15%] left-0 top-[15%] w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent"
                />

                {/* Corner bracket — top right */}
                <div
                  aria-hidden="true"
                  className="absolute right-5 top-5 h-6 w-6 border-r border-t border-gold/40"
                />

                {/* Corner bracket — bottom left */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-5 left-5 h-6 w-6 border-b border-l border-gold/40"
                />

                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700">
                    <span
                      aria-hidden="true"
                      className="text-base leading-none text-zinc-600"
                    >
                      ◎
                    </span>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
                    Featured Studio Image
                  </p>
                </div>
              </div>

              {/* Bottom accent line — fades left to right */}
              <div
                aria-hidden="true"
                className="absolute -bottom-px right-0 h-px w-3/4 bg-gradient-to-l from-gold/50 to-transparent"
              />
            </div>

          </div>
        </Container>
      </div>
    </section>
  );
}
