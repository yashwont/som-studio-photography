import Image from "next/image";
import Container from "@/src/components/layout/Container";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { LightboxTrigger } from "@/src/components/portfolio/GalleryLightbox";
import type { PortfolioBlock, PortfolioImage } from "@/src/types/portfolio";

const FULL_ASPECT = "aspect-[21/9]";
const WIDE_ASPECT = "aspect-[16/9]";
const PORTRAIT_ASPECT = "aspect-[3/4]";
const GALLERY_ASPECT = "aspect-[4/5]";

function GalleryFrame({
  image,
  aspect,
  sizes,
  priority,
}: {
  image: PortfolioImage;
  aspect: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <LightboxTrigger
      image={image}
      className="image-lift-card group relative block w-full overflow-hidden rounded bg-neutral-100"
    >
      <div className={`relative ${aspect}`}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          loading={priority ? undefined : "lazy"}
          priority={priority}
          sizes={sizes}
          className="image-reveal object-cover"
        />
      </div>
    </LightboxTrigger>
  );
}

export default function PortfolioGallery({
  block,
}: {
  block: Extract<PortfolioBlock, { type: "image" | "gallery" }>;
}) {
  if (block.type === "image") {
    const aspect =
      block.layout === "full"
        ? FULL_ASPECT
        : block.layout === "portrait"
          ? PORTRAIT_ASPECT
          : WIDE_ASPECT;
    const wrapperClass =
      block.layout === "portrait" ? "mx-auto max-w-md" : undefined;

    return (
      <ScrollReveal variant="rise">
        <div className="border-t border-neutral-200 bg-white py-10 sm:py-12">
          <Container>
            <div className={wrapperClass}>
              <GalleryFrame
                image={block.image}
                aspect={aspect}
                sizes={
                  block.layout === "portrait"
                    ? "(max-width: 640px) 100vw, 28rem"
                    : "(max-width: 1024px) 100vw, 1100px"
                }
              />
            </div>
          </Container>
        </div>
      </ScrollReveal>
    );
  }

  const gridClass =
    block.columns === 3
      ? "grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
      : "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5";

  return (
    <ScrollReveal variant="rise">
      <div className="border-t border-neutral-200 bg-white py-10 sm:py-12">
        <Container>
          <div className={gridClass}>
            {block.images.map((image) => (
              <GalleryFrame
                key={image.id}
                image={image}
                aspect={GALLERY_ASPECT}
                sizes={`(max-width: 640px) 100vw, ${Math.round(100 / block.columns)}vw`}
              />
            ))}
          </div>
        </Container>
      </div>
    </ScrollReveal>
  );
}
