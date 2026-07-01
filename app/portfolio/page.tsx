import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import { portfolioCategories } from "@/src/data/portfolio";
import type { PortfolioCategory } from "@/src/types/site";

export const metadata: Metadata = {
  title: "Portfolio — SomStudioPhotography",
  description:
    "Browse SomStudioPhotography's portfolio of weddings, pre-weddings, portraits, events, maternity, graduation, kids photoshoots, and product photography in Kathmandu, Nepal.",
};

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
      {/* Background — zooms on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 transition-transform duration-700 ease-out group-hover:scale-[1.04]" />

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      <div
        aria-hidden="true"
        className="absolute right-4 top-4 h-5 w-5 border-r border-t border-gold/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />

      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <div
          aria-hidden="true"
          className="mb-3 h-px w-5 bg-gold transition-all duration-300 group-hover:w-8"
        />
        <h2 className="font-semibold leading-tight text-white sm:text-base">
          {category.title}
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
          {category.description}
        </p>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const primary = portfolioCategories[0];
  const secondary = portfolioCategories.slice(1, 3);
  const remaining = portfolioCategories.slice(3);

  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="Our Work"
        title="Stories told through light and craft."
        subtitle="Browse our portfolio of weddings, portraits, events, and more — all shot in Kathmandu, Nepal."
      />

      {/* Gallery */}
      <section className="bg-black border-t border-white/5">
        <Container>
          <div className="py-20 sm:py-28 space-y-5">

            {/* Editorial top row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <PortfolioCard
                category={primary}
                className="h-72 sm:h-96 lg:h-[580px]"
              />
              <div className="grid grid-cols-1 gap-5">
                {secondary.map((cat) => (
                  <PortfolioCard
                    key={cat.id}
                    category={cat}
                    className="h-64 sm:h-72 lg:h-[280px]"
                  />
                ))}
              </div>
            </div>

            {/* Remaining categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {remaining.map((cat) => (
                <PortfolioCard
                  key={cat.id}
                  category={cat}
                  className="h-52 sm:h-60"
                />
              ))}
            </div>

          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-zinc-950 border-t border-white/5">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 sm:py-20 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Interested in working together?
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Let&rsquo;s create something for you.
            </h2>
            <p className="max-w-md text-zinc-400">
              Get in touch and we&rsquo;ll discuss your shoot, location, and the right package.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/contact" variant="primary" size="lg">
                Book a Session
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                View Services
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
