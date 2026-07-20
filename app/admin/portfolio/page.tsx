import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioCategories } from "@/src/lib/db/admin-portfolio";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import DeleteCategoryButton from "./DeleteCategoryButton";

export const metadata: Metadata = {
  title: "Portfolio | Admin | SomStudioPhotography",
};

type AdminPortfolioCategory = Awaited<
  ReturnType<typeof getAdminPortfolioCategories>
>[number];

const FALLBACK_COVER = {
  imageUrl: "/images/visuals/studio.jpg",
  altText: "A photographer working with professional studio lighting equipment.",
};

function getSafeImageUrl(imageUrl: string) {
  const trimmedUrl = imageUrl.trim();

  if (!trimmedUrl || trimmedUrl.includes('"') || trimmedUrl.includes("'")) {
    return null;
  }

  if (trimmedUrl.startsWith("/") && !trimmedUrl.startsWith("//")) {
    return trimmedUrl;
  }

  try {
    const url = new URL(trimmedUrl);
    return url.protocol === "http:" || url.protocol === "https:" ? trimmedUrl : null;
  } catch {
    return null;
  }
}

function PortfolioHeaderActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/admin/portfolio/seo"
        className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
      >
        SEO
      </Link>
      <Link
        href="/admin/portfolio/new"
        className="inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500"
      >
        Add Story
      </Link>
    </div>
  );
}

function CategoryCard({ category }: { category: AdminPortfolioCategory }) {
  const cover = category.images[0] ?? FALLBACK_COVER;
  const coverUrl = getSafeImageUrl(cover.imageUrl);
  const imageCount = category._count.images;

  return (
    <div className="overflow-hidden rounded border border-neutral-800 bg-neutral-900">
      <Link href={`/admin/portfolio/${category.id}`} className="group block">
        {coverUrl ? (
          <div
            aria-label={`${category.name} cover`}
            role="img"
            className="h-40 w-full bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${JSON.stringify(coverUrl)})` }}
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-neutral-950 text-xs text-neutral-500">
            No preview
          </div>
        )}
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/admin/portfolio/${category.id}`}
            className="font-semibold text-neutral-50 transition-colors hover:text-gold"
          >
            {category.name}
          </Link>
          <span className="shrink-0 rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-semibold text-neutral-300">
            {imageCount} {imageCount === 1 ? "image" : "images"}
          </span>
        </div>

        {category.description && (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-400">
            {category.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/admin/portfolio/${category.id}`}
            className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            View
          </Link>
          <Link
            href={`/admin/portfolio/${category.id}/edit`}
            className="rounded border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/10"
          >
            Edit
          </Link>
          <DeleteCategoryButton
            categoryId={category.id}
            categoryName={category.name}
            imageCount={imageCount}
          />
        </div>
      </div>
    </div>
  );
}

export default async function AdminPortfolioPage() {
  const admin = await requireAdmin();
  const categories = await getAdminPortfolioCategories();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Portfolio"
        description="Manage portfolio categories and their images, same as they appear on the public site."
        action={<PortfolioHeaderActions />}
      />

      <section className="mt-8">
        {categories.length === 0 ? (
          <div className="rounded border border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-300">
              No portfolio categories found.
            </p>
            <Link
              href="/admin/portfolio/new"
              className="mt-4 inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500"
            >
              Add Story
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category: AdminPortfolioCategory) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
