import type { Metadata } from "next";
import { cache } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Container from "@/src/components/layout/Container";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import PortfolioHero from "@/src/components/portfolio/PortfolioHero";
import PortfolioOverview from "@/src/components/portfolio/PortfolioOverview";
import PortfolioStoryRenderer from "@/src/components/portfolio/PortfolioStoryRenderer";
import PortfolioBookingCTA from "@/src/components/portfolio/PortfolioBookingCTA";
import PortfolioNavigation from "@/src/components/portfolio/PortfolioNavigation";
import { LightboxProvider } from "@/src/components/portfolio/GalleryLightbox";
import {
  getActivePortfolioImages,
  getPortfolioCategories,
  getPortfolioImageBySlug,
  getPortfolioImagesByCategorySlug,
} from "@/src/lib/db/portfolio";
import { getPortfolioStoryByImageId } from "@/src/lib/db/portfolio-story";
import { getActiveServices } from "@/src/lib/db/services";
import { buildPortfolioStoryContent, toNewbornSpelling } from "@/src/lib/portfolio/display";
import { absoluteUrl } from "@/src/lib/seo";
import type { PortfolioImage as PortfolioImageContent } from "@/src/types/portfolio";

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

// generateMetadata and the page body both need the work + its story; cache() keeps
// this to one DB round-trip per request instead of two.
const loadPortfolioWorkPage = cache(async (slug: string) => {
  const work = await getPortfolioImageBySlug(slug);

  if (!work) {
    return { work: null, story: null };
  }

  const story = await getPortfolioStoryByImageId(work.id);

  return { work, story };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ work: string }>;
}): Promise<Metadata> {
  const { work: workId } = await params;
  const { work, story } = await loadPortfolioWorkPage(workId);

  if (!work) {
    return { title: "Portfolio Story Not Found" };
  }

  const title = toNewbornSpelling(work.title);
  const categoryName = toNewbornSpelling(work.category.name);
  const description =
    story?.seoDescription ??
    work.description ??
    `View ${title} by SomStudioPhotography.`;

  return {
    title: story?.seoTitle ?? `${title} | ${categoryName} Portfolio`,
    description,
    alternates: {
      canonical: absoluteUrl(`/portfolio/${work.slug}`),
    },
    openGraph: {
      title,
      description,
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
  const { work, story: rawStory } = await loadPortfolioWorkPage(workId);

  if (!work) {
    notFound();
  }

  const category = work.category;
  const displayTitle = toNewbornSpelling(work.title);
  const displayCategoryName = toNewbornSpelling(category.name);
  const displayDescription = toNewbornSpelling(work.description) ?? "";

  const [moreFromCategory, allActiveImages, activeServices] =
    await Promise.all([
      getPortfolioImagesByCategorySlug(category.slug).then((items) =>
        items.filter((item: PortfolioImageWithCategory) => item.id !== work.id)
      ),
      getActivePortfolioImages(),
      getActiveServices(),
    ]);

  const currentIndex = allActiveImages.findIndex((item) => item.id === work.id);
  const prevItem = currentIndex > 0 ? allActiveImages[currentIndex - 1] : undefined;
  const nextItem =
    currentIndex !== -1 && currentIndex < allActiveImages.length - 1
      ? allActiveImages[currentIndex + 1]
      : undefined;

  const matchedService = activeServices.find(
    (service) => service.category === category.slug
  );

  const story = buildPortfolioStoryContent(rawStory);
  const coverImage: PortfolioImageContent = {
    id: `cover-${work.id}`,
    src: work.imageUrl,
    alt: work.altText,
  };
  const blockImages: PortfolioImageContent[] = (story?.blocks ?? []).flatMap(
    (block) => {
      if (block.type === "image" || block.type === "imageText") {
        return [block.image];
      }
      if (block.type === "gallery") {
        return block.images;
      }
      return [];
    }
  );
  const lightboxImages = [coverImage, ...blockImages];

  return (
    <>
      <Navbar />

      <LightboxProvider images={lightboxImages}>
        <PortfolioHero
          categoryName={displayCategoryName}
          categorySlug={category.slug}
          title={displayTitle}
          summary={displayDescription}
          sessionDetails={
            story?.sessionDetails ?? { service: `${displayCategoryName} Photography` }
          }
          coverImage={coverImage}
        />

        <PortfolioOverview
          eyebrow={story?.storyEyebrow ?? "The Session"}
          heading={story?.storyHeading}
          paragraphs={
            story && story.storyParagraphs.length > 0
              ? story.storyParagraphs
              : [displayDescription]
          }
          sessionDetails={
            story?.sessionDetails ?? { service: `${displayCategoryName} Photography` }
          }
        />

        {story && story.blocks.length > 0 && (
          <PortfolioStoryRenderer blocks={story.blocks} />
        )}
      </LightboxProvider>

      {moreFromCategory.length > 0 && (
        <ScrollReveal variant="rise">
          <section className="border-t border-neutral-200 bg-neutral-50">
            <Container>
              <div className="py-14 sm:py-16">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                  More from {displayCategoryName}
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
                          loading="lazy"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="image-reveal object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-semibold text-neutral-950 transition-colors group-hover:text-gold">
                          {toNewbornSpelling(item.title)}
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

      <PortfolioBookingCTA
        categoryName={displayCategoryName}
        workTitle={displayTitle}
        serviceId={matchedService?.id}
        eyebrow={story?.ctaEyebrow}
        heading={story?.ctaHeading}
        body={story?.ctaBody}
        primaryLabel={story?.primaryCtaLabel}
        secondaryLabel={story?.secondaryCtaLabel}
      />

      <PortfolioNavigation
        prev={
          prevItem && {
            slug: prevItem.slug,
            title: toNewbornSpelling(prevItem.title),
            imageSrc: prevItem.imageUrl,
            imageAlt: prevItem.altText,
          }
        }
        next={
          nextItem && {
            slug: nextItem.slug,
            title: toNewbornSpelling(nextItem.title),
            imageSrc: nextItem.imageUrl,
            imageAlt: nextItem.altText,
          }
        }
      />

      <Footer />
    </>
  );
}
