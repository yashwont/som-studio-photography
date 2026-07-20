import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import {
  getAdminPortfolioCategoryById,
  getAdminPortfolioCategoriesForSelect,
} from "@/src/lib/db/admin-portfolio";
import { getAdminPortfolioImageWithStory, storyStateFrom } from "@/src/lib/db/admin-portfolio-story";
import {
  draftsFromStoryBlocks,
  type EditableBlock,
  type SessionDetailsDraft,
  type StoryCtaDraft,
  type StoryOverviewDraft,
} from "@/src/components/admin/portfolio-story/types";
import { joinParagraphs } from "@/src/lib/portfolio/story-blocks";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import PortfolioImageForm, {
  type PortfolioImageFormInitialCover,
} from "../../images/_shared/PortfolioImageForm";
import AdditionalImageCard from "../../images/_shared/AdditionalImageCard";
import AddAnotherImageCard from "../../images/_shared/AddAnotherImageCard";
import { saveCategoryWithImage } from "./actions";

type ImageWithStory = Awaited<ReturnType<typeof getAdminPortfolioImageWithStory>>;

function buildCoverAndStory(image: ImageWithStory): {
  cover: PortfolioImageFormInitialCover;
  story: {
    heroEyebrow: string;
    overview: StoryOverviewDraft;
    sessionDetails: SessionDetailsDraft;
    cta: StoryCtaDraft;
    blocks: EditableBlock[];
  };
} {
  const story = image?.story;

  return {
    cover: {
      categoryId: image?.category.id ?? "",
      title: image?.title ?? "",
      slug: image?.slug ?? "",
      imageUrl: image?.imageUrl ?? "",
      altText: image?.altText ?? "",
      description: image?.description ?? "",
      featured: image?.featured ?? false,
      active: image?.active ?? true,
      displayOrder: image?.displayOrder ?? 0,
    },
    story: {
      heroEyebrow: story?.heroEyebrow ?? "",
      overview: {
        eyebrow: story?.overviewEyebrow ?? "",
        heading: story?.overviewHeading ?? "",
        paragraphs: joinParagraphs(
          Array.isArray(story?.overviewParagraphs)
            ? (story.overviewParagraphs as unknown[]).filter(
                (p): p is string => typeof p === "string"
              )
            : []
        ),
      },
      sessionDetails: {
        studio: story?.studio ?? "",
        service: story?.service ?? "",
        location: story?.location ?? "",
        style: story?.style ?? "",
        setting: story?.setting ?? "",
      },
      cta: {
        eyebrow: story?.ctaEyebrow ?? "",
        heading: story?.ctaHeading ?? "",
        body: story?.ctaBody ?? "",
        primaryLabel: story?.primaryCtaLabel ?? "",
        secondaryLabel: story?.secondaryCtaLabel ?? "",
      },
      blocks: draftsFromStoryBlocks(story?.blocks ?? []),
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const category = await getAdminPortfolioCategoryById(id);

  if (!category) {
    return {
      title: "Portfolio Story Not Found | Admin | SomStudioPhotography",
    };
  }

  return { title: `Edit ${category.name} | Admin | SomStudioPhotography` };
}

export default async function AdminPortfolioCategoryEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ openImage?: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const { openImage } = await searchParams;
  const category = await getAdminPortfolioCategoryById(id);

  if (!category) {
    notFound();
  }

  const categories = await getAdminPortfolioCategoriesForSelect();
  const [primaryImageSummary, ...additionalImageSummaries] = category.images;

  const primaryImage = primaryImageSummary
    ? await getAdminPortfolioImageWithStory(primaryImageSummary.id)
    : null;
  const additionalImages = await Promise.all(
    additionalImageSummaries.map((image) => getAdminPortfolioImageWithStory(image.id))
  );

  const { cover: primaryCover, story: primaryStory } = buildCoverAndStory(primaryImage);
  const saveAction = saveCategoryWithImage.bind(null, category.id);

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Edit Portfolio Story"
        description={`${category.name} · ${category.slug}`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/portfolio"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Portfolio
            </Link>
            <Link
              href={`/admin/portfolio/${category.id}`}
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              View Story
            </Link>
            <Link
              href="/admin/portfolio/seo"
              className="inline-flex rounded border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/10"
            >
              Portfolio SEO
            </Link>
          </div>
        }
      />

      <div className="mt-8">
        <PortfolioImageForm
          mode="edit"
          action={saveAction}
          categories={[]}
          categoryFields={{
            name: category.name,
            slug: category.slug,
            description: category.description ?? "",
            displayOrder: category.displayOrder,
          }}
          imageId={primaryImage?.id}
          publicUrl={primaryImage ? `/portfolio/${primaryImage.slug}` : undefined}
          cancelHref={`/admin/portfolio/${category.id}`}
          submitLabel="Save Story"
          pendingLabel="Saving..."
          cover={primaryCover}
          story={primaryStory}
        />
      </div>

      <div className="mt-10 space-y-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
          Additional images in this story
        </h2>

        {additionalImages.map((image, index) => {
          const summary = additionalImageSummaries[index];
          const { cover, story } = buildCoverAndStory(image);

          return (
            <AdditionalImageCard
              key={summary.id}
              imageId={summary.id}
              title={summary.title}
              slug={summary.slug}
              imageUrl={summary.imageUrl}
              active={summary.active}
              featured={summary.featured}
              storyState={storyStateFrom(summary.story)}
              categories={categories}
              cover={cover}
              story={story}
              defaultExpanded={openImage === summary.id}
            />
          );
        })}

        <AddAnotherImageCard categoryId={category.id} categories={categories} />
      </div>
    </AdminShell>
  );
}
