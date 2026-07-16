import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioCategoryById } from "@/src/lib/db/admin-portfolio";
import { storyStateFrom } from "@/src/lib/db/admin-portfolio-story";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import DeleteCategoryButton from "../DeleteCategoryButton";
import DeletePortfolioImageButton from "../images/DeletePortfolioImageButton";
import { StatusBadge, FeaturedBadge, StoryStatusBadge } from "../images/_shared/Badges";

type AdminPortfolioCategoryDetail = NonNullable<
  Awaited<ReturnType<typeof getAdminPortfolioCategoryById>>
>;
type AdminPortfolioImage = AdminPortfolioCategoryDetail["images"][number];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const category = await getAdminPortfolioCategoryById(id);

  if (!category) {
    return {
      title: "Portfolio Category Not Found | Admin | SomStudioPhotography",
    };
  }

  return { title: `${category.name} | Admin | SomStudioPhotography` };
}

function getSafeThumbnailUrl(imageUrl: string) {
  const trimmedUrl = imageUrl.trim();

  if (!trimmedUrl || trimmedUrl.includes('"') || trimmedUrl.includes("'")) {
    return null;
  }

  if (trimmedUrl.startsWith("/") && !trimmedUrl.startsWith("//")) {
    return trimmedUrl;
  }

  try {
    const url = new URL(trimmedUrl);
    return url.protocol === "http:" || url.protocol === "https:"
      ? trimmedUrl
      : null;
  } catch {
    return null;
  }
}

function ImageCard({ image, categoryId }: { image: AdminPortfolioImage; categoryId: string }) {
  const thumbnailUrl = getSafeThumbnailUrl(image.imageUrl);

  return (
    <div className="overflow-hidden rounded border border-neutral-800 bg-neutral-950">
      <Link href={`/admin/portfolio/images/${image.id}`} className="group block">
        {thumbnailUrl ? (
          <div
            aria-label={`${image.title} thumbnail`}
            role="img"
            className="h-40 w-full bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${JSON.stringify(thumbnailUrl)})` }}
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-neutral-900 text-xs text-neutral-500">
            No preview
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link
          href={`/admin/portfolio/images/${image.id}`}
          className="font-medium text-neutral-50 transition-colors hover:text-gold"
        >
          {image.title}
        </Link>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <StatusBadge active={image.active} />
          <FeaturedBadge featured={image.featured} />
          <StoryStatusBadge state={storyStateFrom(image.story)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/admin/portfolio/images/${image.id}`}
            className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            View
          </Link>
          <Link
            href={`/admin/portfolio/${categoryId}/edit?openImage=${image.id}`}
            className="rounded border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/10"
          >
            Edit
          </Link>
          <DeletePortfolioImageButton imageId={image.id} imageTitle={image.title} />
        </div>
      </div>
    </div>
  );
}

export default async function AdminPortfolioCategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const category = await getAdminPortfolioCategoryById(id);

  if (!category) {
    notFound();
  }

  const imageCount = category.images.length;

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title={category.name}
        description={`${category.slug} · ${imageCount} ${
          imageCount === 1 ? "image" : "images"
        }`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/portfolio"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Portfolio
            </Link>
            <Link
              href={`/admin/portfolio/${category.id}/edit`}
              className="inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500"
            >
              Edit Category
            </Link>
            <DeleteCategoryButton
              categoryId={category.id}
              categoryName={category.name}
              imageCount={imageCount}
              className="px-4 py-2"
            />
          </div>
        }
      />

      {category.description && (
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-300">
          {category.description}
        </p>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
          Images in this category
        </h2>

        {category.images.length === 0 ? (
          <div className="rounded border border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-300">
              No portfolio images are assigned to this category yet.
            </p>
            <Link
              href={`/admin/portfolio/${category.id}/edit`}
              className="mt-4 inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500"
            >
              Add one from Edit Category
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.images.map((image: AdminPortfolioImage) => (
              <ImageCard key={image.id} image={image} categoryId={category.id} />
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
