import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import {
  getPortfolioCategories,
  getPortfolioImageBySlug,
  getPortfolioImagesByCategorySlug,
} from "@/src/lib/db/portfolio";
import { absoluteUrl } from "@/src/lib/seo";

type PortfolioCategoryWithImages = Awaited<
  ReturnType<typeof getPortfolioCategories>
>[number];
type PortfolioImageWithCategory = Awaited<
  ReturnType<typeof getPortfolioImagesByCategorySlug>
>[number];
type PortfolioCategoryImage = PortfolioCategoryWithImages["images"][number];

export async function generateStaticParams() {
  const categories = await getPortfolioCategories();

  return categories.flatMap((category: PortfolioCategoryWithImages) =>
    category.images.map((image: PortfolioCategoryImage) => ({
      work: image.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ work: string }>;
}): Promise<Metadata> {
  const { work: workId } = await params;
  const work = await getPortfolioImageBySlug(workId);

  if (!work) {
    return { title: "Portfolio Story Not Found" };
  }

  return {
    title: `${work.title} | ${work.category.name} Portfolio`,
    description: work.description ?? `View ${work.title} by SomStudioPhotography.`,
    alternates: {
      canonical: absoluteUrl(`/portfolio/${work.slug}`),
    },
    openGraph: {
      title: work.title,
      description: work.description ?? undefined,
      images: [{ url: work.imageUrl, alt: work.altText }],
    },
  };
}

export default async function PortfolioWorkPage({
  params,
}: {
  params: Promise<{ work: string }>;
}) {
  const { work: workId } = await params;
  const work = await getPortfolioImageBySlug(workId);

  if (!work) {
    notFound();
  }

  const category = work.category;
  const moreFromCategory = (
    await getPortfolioImagesByCategorySlug(category.slug)
  ).filter((item: PortfolioImageWithCategory) => item.id !== work.id);

  return (
    <>
      <Navbar />

      <ScrollReveal variant="soft-zoom">
        <div className="bg-neutral-50 border-b border-neutral-200 pt-16 sm:pt-20">
          <Container>
            <div className="py-14 sm:py-20">
              <Link
                href={`/portfolio#${category.slug}`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-900 transition-colors hover:text-gold"
              >
                &larr; Back to {category.name}
              </Link>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                {category.name} &middot; SomStudioPhotography
              </p>
              <h1 className="max-w-3xl break-words text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl xl:text-6xl">
                {work.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-900">
                {work.description}
              </p>
            </div>
          </Container>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="clip-up">
        <section className="border-t border-neutral-200 bg-neutral-50">
          <Container>
            <div className="py-14 sm:py-16">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 sm:aspect-[16/8]">
                <Image
                  src={work.imageUrl}
                  alt={work.altText}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1100px"
                  className="object-cover"
                />
              </div>
            </div>
          </Container>
        </section>
      </ScrollReveal>

      {moreFromCategory.length > 0 && (
        <ScrollReveal variant="rise">
          <section className="border-t border-neutral-200 bg-neutral-50">
            <Container>
              <div className="py-14 sm:py-16">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                  More from {category.name}
                </p>
                <h2 className="mb-8 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                  Other stories in this category.
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                  {moreFromCategory.map((item: PortfolioImageWithCategory) => (
                    <Link
                      key={item.id}
                      href={`/portfolio/${item.slug}`}
                      className="image-lift-card group block overflow-hidden rounded bg-white shadow-sm"
                    >
                      <div className="relative h-72 overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.altText}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="image-reveal object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-semibold text-neutral-950 transition-colors group-hover:text-gold">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-neutral-900">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal variant="fade">
        <section className="border-t border-neutral-200 bg-neutral-50">
          <Container>
            <div className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                Planning something similar?
              </p>
              <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
                Let&apos;s talk about your {category.name.toLowerCase()} session.
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button href="/contact" variant="primary" size="lg">
                  Book a Session
                </Button>
                <Button href="/portfolio" variant="secondary" size="lg">
                  View Full Portfolio
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </ScrollReveal>

      <Footer />
    </>
  );
}
