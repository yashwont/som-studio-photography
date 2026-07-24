import Container from "@/src/components/layout/Container";
import SectionHeader from "@/src/components/ui/SectionHeader";
import Button from "@/src/components/ui/Button";
import PortfolioFilmReel from "@/src/components/portfolio/PortfolioFilmReel";
import type { PortfolioImage } from "@/src/lib/portfolio/public-portfolio";

/**
 * Homepage feature strip — the portfolio's 35mm film reel, used once here as
 * the signature element tying the home page to the studio's film language.
 */
export default function StudioReel({ images }: { images: PortfolioImage[] }) {
  if (images.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="py-12 sm:py-16">
          <SectionHeader
            eyebrow="Selected work"
            title="Straight off the film"
            subtitle="A rolling look across recent sessions — drag the strip to explore."
            centered
            size="sm"
            className="mb-8 sm:mb-10"
          />

          <PortfolioFilmReel images={images} compact />

          <div className="mt-10 flex justify-center">
            <Button href="/portfolio" variant="primary" size="md">
              View full portfolio
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
