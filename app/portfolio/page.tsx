import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import PageHeader from "@/src/components/ui/PageHeader";
import { portfolioCategories, portfolioWorks } from "@/src/data/portfolio";
import type { PortfolioCategory, PortfolioWork } from "@/src/types/site";
import { absoluteUrl } from "@/src/lib/seo";

export const metadata: Metadata = {
  title: "Photography Portfolio",
  description:
    "Browse SomStudioPhotography's portfolio of weddings, pre-weddings, portraits, events, maternity, graduation, kids photoshoots, and product photography in Kathmandu, Nepal.",
  alternates: {
    canonical: absoluteUrl("/portfolio"),
  },
};

function CategoryButton({ category }: { category: PortfolioCategory }) {
  return (
    <Link
      href={`#${category.slug}`}
      className="group relative flex h-28 items-end overflow-hidden rounded-2xl border border-neutral-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:h-32"
    >
      <Image
        src={category.image.src}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/35 to-neutral-950/10 transition-colors duration-300 group-hover:from-neutral-950/90" />
      <div className="relative z-10 flex w-full items-center justify-between gap-2 p-4">
        <span className="text-sm font-semibold uppercase tracking-[0.1em] text-white">
          {category.title}
        </span>
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/40 text-xs text-white transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-neutral-950"
        >
          &rarr;
        </span>
      </div>
    </Link>
  );
}

function WorkCard({
  work,
  large = false,
  index = 0,
}: {
  work: PortfolioWork;
  large?: boolean;
  index?: number;
}) {
  const offset =
    index % 3 === 1 ? "sm:translate-y-8" : index % 3 === 2 ? "sm:-translate-y-3" : "";
  const imageHeight = large ? "h-80 sm:h-[520px]" : index % 2 === 0 ? "h-72" : "h-96";

  return (
    <Link
      href={`/portfolio/${work.id}`}
      className={`image-lift-card group block overflow-hidden rounded bg-white shadow-sm ${offset}`}
    >
      <div className={`relative overflow-hidden ${imageHeight}`}>
        <Image
          src={work.image.src}
          alt={work.image.alt}
          fill
          sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 100vw, 33vw"}
          className="image-reveal object-cover"
        />
      </div>
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div aria-hidden="true" className="h-px w-6 shrink-0 bg-gold" />
          <span className="text-xs uppercase tracking-[0.16em] text-neutral-400">
            {work.location}
          </span>
        </div>
        <h3 className="text-base font-semibold text-neutral-950 transition-colors group-hover:text-gold">
          {work.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          {work.description}
        </p>
      </div>
    </Link>
  );
}

function CategorySection({ category }: { category: PortfolioCategory }) {
  const works = portfolioWorks.filter((work) => work.categoryId === category.id);

  return (
    <section id={category.slug} className="scroll-mt-28 border-t border-neutral-200 py-14 sm:py-16">
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-[0.7fr_1fr] lg:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {category.title}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
            {category.description}
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 lg:justify-self-end">
          Sample gallery direction for this category. Real client galleries can
          replace these entries later while preserving the same structure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {works.map((work, index) => (
          <WorkCard key={work.id} work={work} index={index} />
        ))}
      </div>
    </section>
  );
}

export default function PortfolioPage() {
  const featuredWorks = portfolioWorks.filter((work) => work.featured);

  return (
    <>
      <Navbar />

      <PageHeader
        eyebrow="Our Work"
        title="Portfolio by session type."
        subtitle="Browse wedding, portrait, event, maternity, graduation, kids, and product photography from our Kathmandu studio."
      />

      <section className="border-t border-neutral-200 bg-white">
        <Container>
          <div className="py-16 sm:py-20">
            <p className="mx-auto mb-12 max-w-2xl text-center text-base leading-relaxed text-neutral-600 sm:mb-14">
              Every gallery below reflects real session planning, from first
              consultation to final edit, across weddings, portraits, events,
              and more. Explore a category to see individual stories, or open
              any single shoot for a closer look at how we approached
              lighting, posing, and pacing for that session.
            </p>
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Start with a category
                </p>
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                  Find the type of session you want to plan.
                </h2>
              </div>
              <Button href="/contact" variant="secondary" size="md">
                Request Full Gallery
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 pb-12 sm:grid-cols-4 sm:gap-4">
              {portfolioCategories.map((category) => (
                <CategoryButton key={category.id} category={category} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="py-16 sm:py-20">
            <div className="mb-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Featured work
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                A quick look at our core sessions.
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {featuredWorks.map((work, index) => (
                <WorkCard key={work.id} work={work} large={index === 0} index={index} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white">
        <Container>
          {portfolioCategories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </Container>
      </section>

      <section className="border-t border-neutral-200 bg-neutral-50">
        <Container>
          <div className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Want to see a complete gallery?
            </p>
            <h2 className="text-2xl font-bold text-neutral-950 sm:text-3xl">
              Tell us what you are planning.
            </h2>
            <p className="max-w-md text-neutral-600">
              We can share relevant sample galleries and help you choose the
              right session plan.
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
