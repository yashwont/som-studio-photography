import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioImageById } from "@/src/lib/db/admin-portfolio";
import { storyStateFrom } from "@/src/lib/db/admin-portfolio-story";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const image = await getAdminPortfolioImageById(id);

  if (!image) {
    return {
      title: "Portfolio Image Not Found | Admin | SomStudioPhotography",
    };
  }

  return { title: `${image.title} | Admin | SomStudioPhotography` };
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

export default async function AdminPortfolioImageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const image = await getAdminPortfolioImageById(id);

  if (!image) {
    notFound();
  }

  const previewUrl = getSafeImageUrl(image.imageUrl);

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title={image.title}
        description={`${image.category.name} · ${image.slug}`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/portfolio/${image.category.id}`}
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Category
            </Link>
            <Link
              href={`/admin/portfolio/${image.category.id}/edit?openImage=${image.id}`}
              className="inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500"
            >
              Edit
            </Link>
          </div>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DetailCard title="Preview">
          {previewUrl ? (
            <div
              aria-label={`${image.title} preview`}
              role="img"
              className="h-48 w-full rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${JSON.stringify(previewUrl)})`,
              }}
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-sm text-neutral-500">
              No preview available
            </div>
          )}
        </DetailCard>

        <DetailCard title="Basic Details">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Category</dt>
              <dd className="mt-1">
                <Link
                  href={`/admin/portfolio/${image.category.id}`}
                  className="font-medium text-neutral-100 transition-colors hover:text-gold"
                >
                  {image.category.name}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Slug</dt>
              <dd className="mt-1 text-neutral-100">{image.slug}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Display order</dt>
              <dd className="mt-1 text-neutral-100">{image.displayOrder}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Status</dt>
              <dd className="mt-1 flex flex-wrap gap-2">
                <StatusBadge active={image.active} />
                <FeaturedBadge featured={image.featured} />
              </dd>
            </div>
          </dl>
        </DetailCard>

        <DetailCard title="Alt Text">
          <p className="text-sm leading-relaxed text-neutral-200">
            {image.altText}
          </p>
        </DetailCard>

        <DetailCard title="Description">
          {image.description ? (
            <p className="text-sm leading-relaxed text-neutral-200">
              {image.description}
            </p>
          ) : (
            <p className="text-sm text-neutral-400">No description added.</p>
          )}
        </DetailCard>

        <DetailCard title="Created/Updated Dates">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Created</dt>
              <dd className="mt-1 text-neutral-100">
                {formatDateTime(image.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Updated</dt>
              <dd className="mt-1 text-neutral-100">
                {formatDateTime(image.updatedAt)}
              </dd>
            </div>
          </dl>
        </DetailCard>

        <DetailCard title="Story Content">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Status</dt>
              <dd className="mt-1 text-neutral-100">
                {
                  { "not-created": "Not created", basic: "Basic content", complete: "Complete" }[
                    storyStateFrom(image.story)
                  ]
                }
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Blocks</dt>
              <dd className="mt-1 text-neutral-100">
                {image.story?._count.blocks ?? 0}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Story updated</dt>
              <dd className="mt-1 text-neutral-100">
                {image.story ? formatDateTime(image.story.updatedAt) : "—"}
              </dd>
            </div>
          </dl>
          <Link
            href={`/admin/portfolio/${image.category.id}/edit?openImage=${image.id}`}
            className="mt-4 inline-flex rounded border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/10"
          >
            Edit Story
          </Link>
        </DetailCard>
      </div>
    </AdminShell>
  );
}
