import Image from "next/image";
import type { Metadata } from "next";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import Button from "@/src/components/ui/Button";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import BackToTop from "@/src/components/ui/BackToTop";
import { getActiveServices } from "@/src/lib/db/services";
import { getContactInfo } from "@/src/lib/db/contact";
import { absoluteUrl } from "@/src/lib/seo";
import {
  buildPortfolioCategories,
  type PortfolioCategory,
  type PortfolioImage,
} from "@/src/lib/portfolio/public-portfolio";

export const metadata: Metadata = {
  title: "Photography Portfolio in Kathmandu",
  description:
    "Explore SomStudioPhotography's portfolio across wedding, pre-wedding, maternity, newborn, kids, family, portrait, event, graduation, and product photography in Kathmandu, Nepal.",
  alternates: {
    canonical: absoluteUrl("/portfolio"),
  },
};

function CategoryNav({ categories }: { categories: PortfolioCategory[] }) {
  return (
    <nav
      aria-label="Portfolio categories"
      className="flex flex-wrap justify-center gap-2 border-y border-neutral-200 bg-white/70 px-5 py-4 backdrop-blur-sm sm:px-8 lg:px-12 xl:px-16 2xl:px-20"
    >
      {categories.map((category: PortfolioCategory) => (
        <a
          key={category.id}
          href={`#${category.id}`}
          className="shrink-0 rounded-full border border-neutral-200/80 bg-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-700 transition-all hover:-translate-y-0.5 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white"
        >
          {category.title}
        </a>
      ))}
    </nav>
  );
}

function PortfolioImageFrame({
  image,
  priority = false,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  image: PortfolioImage;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-neutral-200 ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
  );
}

function CategorySection({
  category,
  index,
}: {
  category: PortfolioCategory;
  index: number;
}) {
  const image = category.images[0];
  const reversed = index % 2 === 1;

  return (
    <ScrollReveal variant={reversed ? "slide-right" : "slide-left"}>
      <section
        id={category.id}
        className={`scroll-mt-36 border-t border-neutral-200 sm:scroll-mt-44 ${
          reversed ? "bg-white" : "bg-neutral-50"
        }`}
      >
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 py-10 sm:py-14 lg:grid-cols-2 lg:gap-12">
            <ScrollReveal variant="soft-zoom" className={`group ${reversed ? "lg:order-2" : ""}`}>
              <PortfolioImageFrame
                image={image}
                priority={index < 2}
                className="aspect-[16/11] rounded-2xl border border-neutral-200 shadow-[0_24px_60px_-30px_rgba(10,10,10,0.5)]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </ScrollReveal>

            <div className={reversed ? "lg:order-1" : undefined}>
              <div className="glass rounded-2xl p-6 sm:p-8">
                <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  <span aria-hidden="true" className="accent-rule h-px w-6" />
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                  {category.title}
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-800">
                  {category.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    href={`/portfolio/${category.id}`}
                    variant="primary"
                    size="sm"
                  >
                    View Full Gallery
                  </Button>
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
            </div>
          </div>
        </Container>
      </section>
    </ScrollReveal>
  );
}

function EmptyPortfolioFallback() {
  return (
    <section className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="flex flex-col items-center gap-5 py-20 text-center sm:py-28">
          <p className="max-w-xl text-base leading-relaxed text-neutral-900">
            Portfolio galleries are being refreshed. Contact us and we will send
            recent work that matches your session type.
          </p>
          <Button href="/contact" variant="primary" size="md">
            Request Recent Work
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default async function PortfolioPage() {
  const [services, contact] = await Promise.all([
    getActiveServices(),
    getContactInfo(),
  ]);
  const categories = buildPortfolioCategories(services);

  return (
    <>
      <Navbar />
      <main>
        <div className="pt-16 sm:pt-20" />

        <CategoryNav categories={categories} />

        {categories.length > 0 ? (
          categories.map((category: PortfolioCategory, index: number) => (
            <CategorySection
              key={category.id}
              category={category}
              index={index}
            />
          ))
        ) : (
          <EmptyPortfolioFallback />
        )}

        <ScrollReveal variant="fade">
          <section className="border-t border-neutral-200 bg-neutral-950 text-white">
            <Container>
              <div className="flex flex-col items-center gap-5 py-16 text-center sm:py-20">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  Next step
                </p>
                <h2 className="max-w-2xl font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                  Want photographs like these for your own story?
                </h2>
                <p className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                  Tell us the session type, preferred date, and location. We will
                  help shape a package around the coverage you need.
                </p>
                <Button href="/contact" variant="primary" size="lg">
                  Start an Inquiry
                </Button>
              </div>
            </Container>
          </section>
        </ScrollReveal>
      </main>
      <Footer contact={contact} />
      <BackToTop />
    </>
  );
}
