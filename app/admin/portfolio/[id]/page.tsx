import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioCategoryById } from "@/src/lib/db/admin-portfolio";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

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

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
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

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-neutral-700/50 text-neutral-400"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function FeaturedBadge({ featured }: { featured: boolean }) {
  return featured ? (
    <span className="inline-flex rounded-full border border-gold/30 px-2.5 py-1 text-xs font-semibold text-gold">
      Featured
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-neutral-700/50 px-2.5 py-1 text-xs font-semibold text-neutral-400">
      Not featured
    </span>
  );
}

function ViewImageLink({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/portfolio/images/${id}`}
      className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
    >
      View
    </Link>
  );
}

function EditImageLink({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/portfolio/images/${id}/edit`}
      className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
    >
      Edit
    </Link>
  );
}

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ImageThumbnail({ image }: { image: AdminPortfolioImage }) {
  const thumbnailUrl = getSafeThumbnailUrl(image.imageUrl);

  if (!thumbnailUrl) {
    return (
      <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-xs text-neutral-500">
        No preview
      </div>
    );
  }

  return (
    <div
      aria-label={`${image.title} thumbnail`}
      className="h-16 w-20 shrink-0 rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
      role="img"
      style={{ backgroundImage: `url(${JSON.stringify(thumbnailUrl)})` }}
    />
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
          </div>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DetailCard title="Basic Details">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Name</dt>
              <dd className="mt-1 text-neutral-100">{category.name}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Slug</dt>
              <dd className="mt-1 text-neutral-100">{category.slug}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Images</dt>
              <dd className="mt-1 text-neutral-100">{imageCount}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Display order</dt>
              <dd className="mt-1 text-neutral-100">
                {category.displayOrder}
              </dd>
            </div>
          </dl>
        </DetailCard>

        <DetailCard title="Created/Updated Dates">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Created</dt>
              <dd className="mt-1 text-neutral-100">
                {formatDateTime(category.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Updated</dt>
              <dd className="mt-1 text-neutral-100">
                {formatDateTime(category.updatedAt)}
              </dd>
            </div>
          </dl>
        </DetailCard>

        <DetailCard title="Description">
          {category.description ? (
            <p className="text-sm leading-relaxed text-neutral-200">
              {category.description}
            </p>
          ) : (
            <p className="text-sm text-neutral-400">No description added.</p>
          )}
        </DetailCard>

        <DetailCard title="Display Order">
          <p className="text-3xl font-semibold text-neutral-50">
            {category.displayOrder}
          </p>
          <p className="mt-2 text-sm text-neutral-400">
            Lower numbers appear earlier in admin and public portfolio lists.
          </p>
        </DetailCard>
      </div>

      <div className="mt-6">
        <DetailCard title="Related Portfolio Images">
          {category.images.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No portfolio images are assigned to this category.
            </p>
          ) : (
            <div className="space-y-3">
              {category.images.map((image: AdminPortfolioImage) => (
                <div
                  key={image.id}
                  className="flex flex-col gap-4 rounded border border-neutral-800 bg-neutral-950 p-4 sm:flex-row sm:items-center"
                >
                  <ImageThumbnail image={image} />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-neutral-50">
                        {image.title}
                      </h3>
                      <StatusBadge active={image.active} />
                      <FeaturedBadge featured={image.featured} />
                    </div>
                    <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-neutral-500">Slug</dt>
                        <dd className="mt-1 break-words text-neutral-300">
                          {image.slug}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-neutral-500">Display order</dt>
                        <dd className="mt-1 text-neutral-300">
                          {image.displayOrder}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-neutral-500">Updated</dt>
                        <dd className="mt-1 text-neutral-300">
                          {formatDate(image.updatedAt)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex shrink-0 gap-2 sm:justify-end">
                    <ViewImageLink id={image.id} />
                    <EditImageLink id={image.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </DetailCard>
      </div>
    </AdminShell>
  );
}
