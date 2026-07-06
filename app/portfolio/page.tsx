import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import PageHeader from "@/src/components/ui/PageHeader";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import { portfolioCategories, portfolioWorks } from "@/src/data/portfolio";
import type { PortfolioCategory, PortfolioWork } from "@/src/types/site";
import { absoluteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Photography Portfolio",
  description:
    "Browse SomStudioPhotography's portfolio of newborn, kids, maternity, family, graduation, portrait, wedding, pre-wedding, event, and product photography in Kathmandu, Nepal.",
  alternates: {
    canonical: absoluteUrl("/portfolio"),
  },
};

function CategoryButton({ category }: { category: PortfolioCategory }) {
  return (
    <Link
      href={`#${category.slug}`}
      className="group relative flex items-center justify-between gap-3 overflow-hidden rounded-full border border-neutral-200 bg-white px-5 py-4 shadow-sm transition-colors duration-300 hover:border-neutral-950"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 z-0 w-0 overflow-hidden transition-[width] duration-500 ease-out group-hover:w-full"
      >
        <Image
          src={category.image.src}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover"
        />
      </span>
      <span className="relative z-10 text-sm font-semibold uppercase tracking-[0.1em] text-neutral-950 transition-all duration-300 group-hover:text-white group-hover:[text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
        {category.title}
      </span>
      <span
        aria-hidden="true"
        className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs text-neutral-950 transition-all duration-300 group-hover:translate-x-1 group-hover:border-gold group-hover:bg-gold group-hover:text-neutral-950"
      >
        &rarr;
      </span>
    </Link>
  );
}

function FeatureWorkLink({ work }: { work: PortfolioWork }) {
  return (
    <Link
      href={`/portfolio/${work.id}`}
      className="group grid grid-cols-[4.5rem_1fr] gap-3 border-t border-neutral-200 py-3 transition-colors hover:border-gold"
    >
      <div className="relative h-16 overflow-hidden rounded bg-neutral-100">
        <Image
          src={work.image.src}
          alt={work.image.alt}
          fill
          sizes="5rem"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-neutral-400">
          {work.location}
        </p>
        <h3 className="text-sm font-semibold text-neutral-950 transition-colors group-hover:text-gold">
          {work.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-neutral-600">
          {work.description}
        </p>
      </div>
    </Link>
  );
}

function CategorySection({
  category,
  index,
}: {
  category: PortfolioCategory;
  index: number;
}) {
  const works = portfolioWorks.filter((work) => work.categoryId === category.id);
  const featuredWork = works[0];
  const supportingWorks = works.slice(1, 3);
  const imageOnRight = index % 2 === 0;
  const collageWorks = supportingWorks.length > 0 ? supportingWorks : works.slice(0, 2);
  const imagePosition = imageOnRight ? "lg:col-start-6" : "lg:col-start-1";
  const textPanelPosition = imageOnRight ? "lg:col-start-1" : "lg:col-start-8";

  return (
    <section
      id={category.slug}
      className="scroll-mt-28 border-t border-neutral-200 py-10 sm:py-12"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center">
        <div className={`relative lg:col-span-7 lg:row-start-1 ${imagePosition}`}>
          <Link
            href={featuredWork ? `/portfolio/${featuredWork.id}` : `#${category.slug}`}
            className="image-lift-card group relative block overflow-hidden rounded bg-neutral-100"
          >
            <div className="relative aspect-[16/10] max-h-[25rem] min-h-[14rem] sm:min-h-[18rem]">
              <Image
                src={category.image.src}
                alt={category.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="image-reveal object-cover"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/35 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="h-px w-8 bg-white/80" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  {category.title}
                </span>
              </div>
            </div>
          </Link>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:absolute sm:bottom-4 sm:right-4 sm:mt-0 sm:w-[40%]">
            {collageWorks.slice(0, 2).map((work) => (
              <Link
                key={work.id}
                href={`/portfolio/${work.id}`}
                className="group relative aspect-[5/4] max-h-28 overflow-hidden rounded border border-white bg-neutral-100 shadow-sm"
              >
                <Image
                  src={work.image.src}
                  alt={work.image.alt}
                  fill
                  sizes="(max-width: 640px) 45vw, 14rem"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/45 to-transparent" />
                <p className="absolute bottom-2 left-2 right-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  {work.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div
          className={`rounded border border-neutral-200 bg-neutral-50 p-5 shadow-sm sm:p-6 lg:col-span-5 lg:row-start-1 ${textPanelPosition}`}
        >
          <div className="mb-4 flex items-center gap-3">
            <div aria-hidden="true" className="h-px w-8 bg-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Portfolio {String(index + 1).padStart(2, "0")}
            </p>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
            {category.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            {category.description}
          </p>

          {featuredWork && (
            <div className="mt-5 border-y border-neutral-200 py-4">
              <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-neutral-400">
                Featured Story
              </p>
              <Link
                href={`/portfolio/${featuredWork.id}`}
                className="group inline-flex flex-col"
              >
                <span className="text-base font-semibold text-neutral-950 transition-colors group-hover:text-gold">
                  {featuredWork.title}
                </span>
                <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                  {featuredWork.description}
                </span>
              </Link>
            </div>
          )}

          <div className="mt-3">
            {supportingWorks.map((work) => (
              <FeatureWorkLink key={work.id} work={work} />
            ))}
          </div>

          <Link
            href={featuredWork ? `/portfolio/${featuredWork.id}` : `#${category.slug}`}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-neutral-950"
          >
            View {category.title} portfolio
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function PortfolioPage() {
  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="Portfolio"
        title="Photography portfolio"
        subtitle="Browse newborn, kids, maternity, family, graduation, portrait, wedding, pre-wedding, event, and product photography from our Kathmandu studio."
      />

      <ScrollReveal variant="rise">
        <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="py-16 sm:py-20">
            <p className="mx-auto mb-12 max-w-2xl text-center text-base leading-relaxed text-neutral-600 sm:mb-14">
              Every gallery below reflects real session planning, from first
              consultation to final edit, across weddings, portraits, events,
              and more. Explore a category to see individual stories, or open
              any single shoot for a closer look at how we approached
              lighting, posing, and pacing for that session.
            </p>
            <div className="mb-10">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  Session categories
                </p>
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                  Choose the type of session you want to explore.
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-12 sm:grid-cols-4 sm:gap-4">
              {portfolioCategories.map((category) => (
                <CategoryButton key={category.id} category={category} />
              ))}
            </div>
          </div>
        </Container>
        </section>
      </ScrollReveal>

      <section className="bg-white">
        <Container>
          {portfolioCategories.map((category, index) => (
            <ScrollReveal
              key={category.id}
              variant={index % 2 === 0 ? "clip-up" : "soft-zoom"}
            >
              <CategorySection category={category} index={index} />
            </ScrollReveal>
          ))}
        </Container>
      </section>

      <Footer />
    </>
  );
}
