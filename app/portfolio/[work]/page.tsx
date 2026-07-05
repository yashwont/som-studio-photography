import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import { portfolioCategories, portfolioWorks } from "@/src/data/portfolio";
import { absoluteUrl } from "@/src/lib/seo";

export function generateStaticParams() {
  return portfolioWorks.map((work) => ({ work: work.id }));
}

function findWork(workId: string) {
  const work = portfolioWorks.find((item) => item.id === workId);
  if (!work) return null;
  const category = portfolioCategories.find((item) => item.id === work.categoryId);
  return category ? { work, category } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ work: string }>;
}): Promise<Metadata> {
  const { work: workId } = await params;
  const found = findWork(workId);

  if (!found) {
    return { title: "Portfolio Story Not Found" };
  }

  const { work, category } = found;

  return {
    title: `${work.title} | ${category.title} Portfolio`,
    description: work.description,
    alternates: {
      canonical: absoluteUrl(`/portfolio/${work.id}`),
    },
    openGraph: {
      title: work.title,
      description: work.description,
      images: [{ url: work.image.src, alt: work.image.alt }],
    },
  };
}

export default async function PortfolioWorkPage({
  params,
}: {
  params: Promise<{ work: string }>;
}) {
  const { work: workId } = await params;
  const found = findWork(workId);

  if (!found) {
    notFound();
  }

  const { work, category } = found;
  const galleryImages = work.gallery ?? [];
  const moreFromCategory = portfolioWorks.filter(
    (item) => item.categoryId === category.id && item.id !== work.id
  );

  return (
    <>
      <Navbar />

      <div className="bg-neutral-50 border-b border-neutral-200 pt-16 sm:pt-20">
        <Container>
          <div className="py-14 sm:py-20">
            <Link
              href={`/portfolio#${category.slug}`}
              className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-gold"
            >
              &larr; Back to {category.title}
            </Link>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {category.title} &middot; {work.location}
            </p>
            <h1 className="max-w-3xl break-words text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl xl:text-6xl">
              {work.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-600">
              {work.description}
            </p>
          </div>
        </Container>
      </div>

      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="py-14 sm:py-16">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded bg-neutral-100 sm:aspect-[16/8]">
              <Image
                src={work.image.src}
                alt={work.image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover"
              />
            </div>

            {galleryImages.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
                {galleryImages.map((image) => (
                  <div
                    key={image.src}
                    className="relative aspect-[4/3] overflow-hidden rounded bg-neutral-100"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {moreFromCategory.length > 0 && (
        <section className="border-t border-neutral-200 bg-neutral-50">
          <Container>
            <div className="py-14 sm:py-16">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                More from {category.title}
              </p>
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                Other stories in this category.
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                {moreFromCategory.map((item) => (
                  <Link
                    key={item.id}
                    href={`/portfolio/${item.id}`}
                    className="image-lift-card group block overflow-hidden rounded bg-white shadow-sm"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="image-reveal object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-semibold text-neutral-950 transition-colors group-hover:text-gold">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Planning something similar?
            </p>
            <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
              Let&apos;s talk about your {category.title.toLowerCase()} session.
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

      <Footer />
    </>
  );
}
