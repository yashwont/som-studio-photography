import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioImageWithStory } from "@/src/lib/db/admin-portfolio-story";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import PortfolioStoryEditor from "@/src/components/admin/portfolio-story/PortfolioStoryEditor";
import { draftsFromStoryBlocks } from "@/src/components/admin/portfolio-story/types";
import { joinParagraphs } from "@/src/lib/portfolio/story-blocks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const image = await getAdminPortfolioImageWithStory(id);

  if (!image) {
    return { title: "Portfolio Item Not Found | Admin | SomStudioPhotography" };
  }

  return { title: `${image.title} - Story | Admin | SomStudioPhotography` };
}

export default async function PortfolioStoryEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const image = await getAdminPortfolioImageWithStory(id);

  if (!image) {
    notFound();
  }

  const story = image.story;

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title={`Story: ${image.title}`}
        description="Manage the editorial content shown on this item's public detail page."
      />

      <div className="mt-8">
        <PortfolioStoryEditor
          imageId={image.id}
          hasExistingStory={Boolean(story)}
          reference={{
            title: image.title,
            categoryName: image.category.name,
            categorySlug: image.category.slug,
            slug: image.slug,
            description: image.description ?? "",
            coverImageSrc: image.imageUrl,
            coverImageAlt: image.altText,
            publicUrl: `/portfolio/${image.slug}`,
          }}
          initial={{
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
            seo: {
              title: story?.seoTitle ?? "",
              description: story?.seoDescription ?? "",
            },
            blocks: draftsFromStoryBlocks(story?.blocks ?? []),
          }}
        />
      </div>
    </AdminShell>
  );
}
