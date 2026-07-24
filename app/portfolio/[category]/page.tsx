import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import PortfolioFilmReel from "@/src/components/portfolio/PortfolioFilmReel";
import { getContactInfo } from "@/src/lib/db/contact";
import { getActiveServices, getServiceBySlug } from "@/src/lib/db/services";
import { absoluteUrl } from "@/src/lib/seo";
import {
  buildPortfolioCategories,
  type PortfolioCategory,
  type PortfolioImage,
} from "@/src/lib/portfolio/public-portfolio";

type PortfolioGalleryPageProps = {
  params: Promise<{ category: string }>;
};

function getCategoryFromServices(
  services: Awaited<ReturnType<typeof getActiveServices>>,
  slug: string
) {
  return buildPortfolioCategories(services).find(
    (category: PortfolioCategory) => category.id === slug
  );
}

export async function generateStaticParams() {
  const services = await getActiveServices();

  return services.map((service) => ({
    category: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: PortfolioGalleryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Portfolio Gallery Not Found",
    };
  }

  const title = service.title.replace(/ Photography$/i, "");

  return {
    title: `${title} Portfolio Gallery`,
    description: service.description,
    alternates: {
      canonical: absoluteUrl(`/portfolio/${service.slug}`),
    },
  };
}

function GalleryImage({
  image,
  index,
}: {
  image: PortfolioImage;
  index: number;
}) {
  const layout = index % 7;
  const frameClass =
    layout === 0
      ? "portfolio-photo-frame portfolio-photo-frame-wide"
      : layout === 3
        ? "portfolio-photo-frame portfolio-photo-frame-tall"
        : "portfolio-photo-frame";

  return (
    <figure className={frameClass}>
      <div className="portfolio-photo-frame-image">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={index < 2}
          sizes={
            layout === 0
              ? "(max-width: 768px) 100vw, 66vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className="object-cover"
        />
      </div>
      <figcaption>SOM · {String(index + 1).padStart(2, "0")}</figcaption>
    </figure>
  );
}

export default async function PortfolioGalleryPage({
  params,
}: PortfolioGalleryPageProps) {
  const { category: slug } = await params;
  const [services, contact] = await Promise.all([
    getActiveServices(),
    getContactInfo(),
  ]);
  const category = getCategoryFromServices(services, slug);

  if (!category) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-neutral-200 bg-neutral-50 pt-16 sm:pt-20">
          <Container>
            <div className="grid grid-cols-1 gap-8 overflow-hidden py-8 sm:py-10 lg:grid-cols-2 lg:items-start lg:gap-12">
              <div className="portfolio-gallery-copy min-w-0">
                <Button href="/portfolio" variant="secondary" size="sm">
                  Back to Portfolio
                </Button>
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Portfolio Gallery
                </p>
                <h1 className="mt-3 max-w-4xl font-serif text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
                  {category.title}
                </h1>
                <p className="mt-4 max-w-full break-words text-base leading-relaxed text-neutral-800 lg:max-w-2xl">
                  {category.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    href={
                      category.serviceId
                        ? `/contact?service=${category.serviceId}`
                        : "/contact"
                    }
                    variant="primary"
                    size="sm"
                  >
                    Inquire for This Style
                  </Button>
                  <Button href="/services" variant="secondary" size="sm">
                    View Packages
                  </Button>
                </div>
              </div>

              <div className="relative min-w-0 max-w-full lg:max-h-[520px]">
                <PortfolioFilmReel images={category.images} />
              </div>
            </div>
          </Container>
        </section>

        {category.galleryIntro && (
          <ScrollReveal variant="rise">
            <section className="border-b border-neutral-200 bg-white">
              <Container>
                <p className="mx-auto max-w-3xl py-10 text-center text-base leading-relaxed text-neutral-800 sm:py-14">
                  {category.galleryIntro}
                </p>
              </Container>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal variant="rise">
          <section className="bg-white">
            <Container>
              <div className="portfolio-photo-grid py-10 sm:py-14">
                {category.images.map((image: PortfolioImage, index: number) => (
                  <GalleryImage key={`${image.src}-${index}`} image={image} index={index} />
                ))}
              </div>
            </Container>
          </section>
        </ScrollReveal>

        {category.galleryClosing && (
          <ScrollReveal variant="rise">
            <section className="border-t border-neutral-200 bg-neutral-50">
              <Container>
                <p className="mx-auto max-w-3xl py-10 text-center text-base leading-relaxed text-neutral-800 sm:py-14">
                  {category.galleryClosing}
                </p>
              </Container>
            </section>
          </ScrollReveal>
        )}
      </main>
      <Footer contact={contact} />
    </>
  );
}
