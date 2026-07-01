import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import Button from "@/src/components/ui/Button";
import { portfolioCategories } from "@/src/data/portfolio";
import type { PortfolioCategory } from "@/src/types/site";

function PortfolioCard({
  category,
  className = "",
}: {
  category: PortfolioCategory;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded border border-zinc-800 bg-zinc-900 transition-colors duration-200 hover:border-gold/40 ${className}`}
    >
      {/* Background gradient — scales on hover to simulate image zoom */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 transition-transform duration-700 ease-out group-hover:scale-[1.04]" />

      {/* Subtle dot texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Bottom-heavy dark overlay — lifts text off the background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Corner bracket — appears on hover */}
      <div
        aria-hidden="true"
        className="absolute right-4 top-4 h-5 w-5 border-r border-t border-gold/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />

      {/* Label area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <div
          aria-hidden="true"
          className="mb-3 h-px w-5 bg-gold transition-all duration-300 group-hover:w-8"
        />
        <h3 className="font-semibold leading-tight text-white sm:text-base">
          {category.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
          {category.description}
        </p>
      </div>
    </div>
  );
}

export default function PortfolioPreview() {
  // Weddings gets the large featured slot
  const primary = portfolioCategories[0];
  // Pre-Wedding + Portraits stack alongside it
  const secondary = portfolioCategories.slice(1, 3);
  // Events, Maternity, Kids, Products fill the bottom grid
  const remaining = portfolioCategories.slice(3);

  return (
    <section id="portfolio" className="bg-zinc-950 border-t border-white/5">
      <Container>
        <div className="py-20 sm:py-28">

          <SectionHeader
            eyebrow="Our Work"
            title="Stories told through light and craft."
            subtitle="A glimpse into the work we create for every client who walks through our studio in Kathmandu."
            centered={true}
            className="mb-14 sm:mb-16"
          />

          {/* ── Editorial top row: large left + two stacked right ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">

            {/* Primary — large dominant card */}
            <PortfolioCard
              category={primary}
              className="h-64 sm:h-80 lg:h-[520px]"
            />

            {/* Two stacked secondary cards */}
            <div className="grid grid-cols-1 gap-4 lg:gap-5">
              {secondary.map((cat) => (
                <PortfolioCard
                  key={cat.id}
                  category={cat}
                  className="h-56 sm:h-64 lg:h-[250px]"
                />
              ))}
            </div>

          </div>

          {/* ── Bottom grid: five remaining categories ── */}
          <div className="mt-4 lg:mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
            {remaining.map((cat) => (
              <PortfolioCard
                key={cat.id}
                category={cat}
                className="h-44 sm:h-52"
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 flex flex-col items-center gap-5 border-t border-white/5 pt-12 text-center">
            <p className="text-sm text-zinc-400 sm:text-base">
              Want to see a complete gallery?
            </p>
            <Button href="/portfolio" variant="secondary" size="md">
              Request Full Portfolio
            </Button>
          </div>

        </div>
      </Container>
    </section>
  );
}
