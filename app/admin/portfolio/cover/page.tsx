import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioServices } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import DeleteCoverBlockButton from "./DeleteCoverBlockButton";

export const metadata: Metadata = {
  title: "Portfolio Cover Page | Admin | SomStudioPhotography",
};

type AdminPortfolioService = Awaited<
  ReturnType<typeof getAdminPortfolioServices>
>[number];

function getSafeImageUrl(imageUrl: string | undefined) {
  const trimmedUrl = imageUrl?.trim() ?? "";

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
      {active ? "Public" : "Hidden"}
    </span>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function CoverPreview({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string | null;
}) {
  if (!imageUrl) {
    return (
      <div className="flex h-40 w-full items-center justify-center bg-neutral-950 text-xs text-neutral-500">
        No cover photo
      </div>
    );
  }

  return (
    <div
      aria-label={`${title} cover photo`}
      role="img"
      className="h-40 w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${JSON.stringify(imageUrl)})` }}
    />
  );
}

function CoverCard({ service }: { service: AdminPortfolioService }) {
  const title = service.title.replace(/ Photography$/i, "");
  const coverUrl = getSafeImageUrl(service.imageUrls[0]);

  return (
    <article className="overflow-hidden rounded border border-neutral-800 bg-neutral-950">
      <CoverPreview title={title} imageUrl={coverUrl} />

      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              {String(service.displayOrder + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 font-medium text-neutral-50">{title}</h3>
            <p className="mt-1 text-xs text-neutral-500">{service.slug}</p>
          </div>
          <StatusBadge active={service.active} />
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div>
            <dt className="text-neutral-500">Order</dt>
            <dd className="text-neutral-300">{service.displayOrder + 1}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Updated</dt>
            <dd className="text-neutral-300">{formatDate(service.updatedAt)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/admin/portfolio/cover/${service.id}`}
            className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            View
          </Link>
          <Link
            href={`/admin/portfolio/cover/${service.id}/edit`}
            className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            Edit
          </Link>
          <DeleteCoverBlockButton serviceId={service.id} title={service.title} />
        </div>
      </div>
    </article>
  );
}

export default async function AdminPortfolioCoverPage() {
  const admin = await requireAdmin();
  const services = await getAdminPortfolioServices();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Cover Page"
        description="Create, edit, and delete the cover blocks shown on the public portfolio page."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/portfolio"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Portfolio
            </Link>
            <Link
              href="/admin/portfolio/cover/new"
              className="inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500"
            >
              Add Cover
            </Link>
          </div>
        }
      />

      <section className="mt-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-neutral-50">
              Existing Cover Blocks
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              These are the blocks currently used to build the public portfolio
              cover page.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
            {services.length} total
          </p>
        </div>

        {services.length === 0 ? (
          <div className="rounded border border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-300">
              No cover blocks exist yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service: AdminPortfolioService) => (
              <CoverCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
