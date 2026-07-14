import Image from "next/image";
import Link from "next/link";
import Container from "@/src/components/layout/Container";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { LightboxTrigger } from "@/src/components/portfolio/GalleryLightbox";
import type { PortfolioImage, PortfolioSessionDetails } from "@/src/types/portfolio";

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="h-px w-4 bg-gold/50" />
      <p className="text-sm text-neutral-900">
        <span className="text-xs uppercase tracking-[0.14em] text-neutral-900/70">
          {label}:
        </span>{" "}
        {value}
      </p>
    </div>
  );
}

export default function PortfolioHero({
  categoryName,
  categorySlug,
  title,
  summary,
  sessionDetails,
  coverImage,
}: {
  categoryName: string;
  categorySlug: string;
  title: string;
  summary: string;
  sessionDetails?: PortfolioSessionDetails;
  coverImage: PortfolioImage;
}) {
  return (
    <>
      <div className="border-b border-neutral-200 bg-neutral-50 pt-16 sm:pt-20">
        <Container>
          <div className="py-8 sm:py-10">
            <Link
              href={`/portfolio#${categorySlug}`}
              className="mb-5 inline-flex items-center gap-2 text-sm text-neutral-900 transition-colors hover:text-gold"
            >
              &larr; Back to {categoryName} Portfolio
            </Link>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
              {categoryName} Photography
            </p>
            <h1 className="max-w-3xl break-words text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl xl:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-900 sm:text-lg">
              {summary}
            </p>

            {sessionDetails && (
              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2.5">
                <MetaItem label="Studio" value="SomStudioPhotography" />
                {sessionDetails.service && (
                  <MetaItem label="Service" value={sessionDetails.service} />
                )}
                {sessionDetails.setting && (
                  <MetaItem label="Setting" value={sessionDetails.setting} />
                )}
              </div>
            )}
          </div>
        </Container>
      </div>

      <ScrollReveal variant="rise">
        <section className="bg-neutral-50">
          <Container>
            <div className="pb-14 sm:pb-16">
              <LightboxTrigger
                image={coverImage}
                className="image-lift-card group relative block w-full overflow-hidden rounded bg-neutral-100"
              >
                <div className="relative aspect-[4/3] sm:aspect-[16/9]">
                  <Image
                    src={coverImage.src}
                    alt={coverImage.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    className="image-reveal object-cover"
                  />
                </div>
              </LightboxTrigger>
            </div>
          </Container>
        </section>
      </ScrollReveal>
    </>
  );
}
