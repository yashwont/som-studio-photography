import Image from "next/image";
import Container from "@/src/components/layout/Container";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { LightboxTrigger } from "@/src/components/portfolio/GalleryLightbox";
import PortfolioGallery from "@/src/components/portfolio/PortfolioGallery";
import type { PortfolioBlock } from "@/src/types/portfolio";

function TextBlock({
  block,
}: {
  block: Extract<PortfolioBlock, { type: "text" }>;
}) {
  return (
    <ScrollReveal variant="fade">
      <div className="border-t border-neutral-200 bg-white py-10 sm:py-12">
        <Container size="narrow">
          {block.eyebrow && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
              {block.eyebrow}
            </p>
          )}
          {block.heading && (
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              {block.heading}
            </h2>
          )}
          <div className="space-y-4">
            {block.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base leading-relaxed text-neutral-900"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </div>
    </ScrollReveal>
  );
}

function ImageTextBlock({
  block,
}: {
  block: Extract<PortfolioBlock, { type: "imageText" }>;
}) {
  const imageFirst = block.imagePosition === "left";

  return (
    <ScrollReveal variant={imageFirst ? "slide-right" : "slide-left"}>
      <div className="border-t border-neutral-200 bg-white py-10 sm:py-12">
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
            <div
              className={`lg:col-span-6 ${imageFirst ? "lg:order-1" : "lg:order-2"}`}
            >
              <LightboxTrigger
                image={block.image}
                className="image-lift-card group relative block w-full overflow-hidden rounded bg-neutral-100"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={block.image.src}
                    alt={block.image.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="image-reveal object-cover"
                  />
                </div>
              </LightboxTrigger>
            </div>
            <div
              className={`lg:col-span-6 ${imageFirst ? "lg:order-2" : "lg:order-1"}`}
            >
              {block.eyebrow && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                  {block.eyebrow}
                </p>
              )}
              {block.heading && (
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                  {block.heading}
                </h2>
              )}
              <div className="space-y-4">
                {block.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-neutral-900"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </ScrollReveal>
  );
}

export default function PortfolioStoryRenderer({
  blocks,
}: {
  blocks: PortfolioBlock[];
}) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "text":
            return <TextBlock key={index} block={block} />;
          case "imageText":
            return <ImageTextBlock key={index} block={block} />;
          case "image":
          case "gallery":
            return <PortfolioGallery key={index} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
