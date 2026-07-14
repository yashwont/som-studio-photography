import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { getPortfolioCategories } from "@/src/lib/db/portfolio";
import { absoluteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Photography Portfolio",
  description:
    "Browse SomStudioPhotography's portfolio of newborn, kids, maternity, family, graduation, portrait, wedding, pre-wedding, event, and product photography in Kathmandu, Nepal.",
  alternates: {
    canonical: absoluteUrl("/portfolio"),
  },
};

type PortfolioCategoryWithImages = Awaited<ReturnType<typeof getPortfolioCategories>>[number];

const fallbackImage = {
  imageUrl: "/images/visuals/studio.jpg",
  altText: "A photographer working with professional studio lighting equipment.",
};

function getCategoryCoverImage(category: PortfolioCategoryWithImages) {
  return category.images[0] ?? fallbackImage;
}

function CategoryButton({ category }: { category: PortfolioCategoryWithImages }) {
  const coverImage = getCategoryCoverImage(category);
  const featuredWork = category.images[0];
  const href = featuredWork ? `/portfolio/${featuredWork.slug}` : "/contact";

  return (
    <Link
      href={href}
      className="group relative flex min-h-[9.5rem] flex-col justify-between gap-4 overflow-hidden rounded border border-neutral-200 bg-white p-5 shadow-sm transition-colors duration-300 hover:border-neutral-950 sm:min-h-[11rem]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 z-0 w-0 overflow-hidden transition-[width] duration-500 ease-out group-hover:w-full"
      >
        <Image
          src={coverImage.imageUrl}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover"
        />
      </span>

      <div className="relative z-10 flex items-start justify-between gap-3">
        <span className="text-sm font-semibold uppercase tracking-[0.1em] text-neutral-950 transition-all duration-300 group-hover:text-white group-hover:[text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
          {category.name}
        </span>
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs text-neutral-950 transition-all duration-300 group-hover:translate-x-1 group-hover:border-gold group-hover:bg-gold group-hover:text-neutral-950"
        >
          &rarr;
        </span>
      </div>

      {category.description && (
        <p className="relative z-10 line-clamp-2 text-xs leading-relaxed text-neutral-900 transition-all duration-300 group-hover:text-white group-hover:[text-shadow:0_1px_6px_rgba(0,0,0,0.7)]">
          {category.description}
        </p>
      )}
    </Link>
  );
}

function EmptyPortfolioFallback() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded border border-neutral-200 bg-white px-6 py-10 text-center">
      <p className="text-base leading-relaxed text-neutral-900">
        Portfolio is being updated. Please contact us to request sample work.
      </p>
      <Button href="/contact" variant="primary" size="md">
        Contact Us
      </Button>
    </div>
  );
}

export default async function PortfolioPage() {
  const portfolioCategories = await getPortfolioCategories();
  const hasPortfolioContent = portfolioCategories.some(
    (category: PortfolioCategoryWithImages) => category.images.length > 0
  );

  return (
    <>
      <Navbar />

      <div className="border-b border-neutral-200 bg-neutral-50 pt-16 sm:pt-20">
        <Container>
          <div className="py-8 text-center sm:py-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900 sm:tracking-[0.2em]">
              Portfolio
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
              Photography portfolio
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-900 sm:text-base">
              Browse newborn, kids, maternity, family, graduation, portrait, wedding, pre-wedding, event, and product photography from our Kathmandu studio.
            </p>
          </div>
        </Container>
      </div>

      <ScrollReveal variant="rise">
        <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="py-16 sm:py-20">
            <div className="mb-10">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                  Session categories
                </p>
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                  Choose the type of session you want to explore.
                </h2>
              </div>
            </div>

            {hasPortfolioContent ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {portfolioCategories.map((category: PortfolioCategoryWithImages) => (
                  <CategoryButton key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <EmptyPortfolioFallback />
            )}
          </div>
        </Container>
        </section>
      </ScrollReveal>

      <Footer />
    </>
  );
}
