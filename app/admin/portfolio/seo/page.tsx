import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioSeoItems } from "@/src/lib/db/admin-portfolio";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Portfolio SEO | Admin | SomStudioPhotography",
};

type PortfolioSeoItem = Awaited<ReturnType<typeof getAdminPortfolioSeoItems>>[number];

function SeoStatusBadge({ item }: { item: PortfolioSeoItem }) {
  const hasTitle = Boolean(item.story?.seoTitle);
  const hasDescription = Boolean(item.story?.seoDescription);

  if (hasTitle && hasDescription) {
    return (
      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
        Custom SEO
      </span>
    );
  }

  if (hasTitle || hasDescription) {
    return (
      <span className="rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-300">
        Partial SEO
      </span>
    );
  }

  return (
    <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-semibold text-neutral-300">
      Using fallback
    </span>
  );
}

function SeoItemRow({ item }: { item: PortfolioSeoItem }) {
  const title = item.story?.seoTitle || `${item.title} | ${item.category.name} Portfolio`;
  const description =
    item.story?.seoDescription ||
    item.description ||
    `View ${item.title} by SomStudioPhotography.`;

  return (
    <div className="rounded border border-neutral-800 bg-neutral-900 p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold text-neutral-50">{item.title}</h2>
            <SeoStatusBadge item={item} />
            {!item.active && (
              <span className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-semibold text-neutral-400">
                Inactive
              </span>
            )}
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.15em] text-neutral-500">
            {item.category.name} · /portfolio/{item.slug}
          </p>

          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            <div>
              <dt className="text-neutral-500">Search title</dt>
              <dd className="mt-1 line-clamp-2 text-neutral-100">{title}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Meta description</dt>
              <dd className="mt-1 line-clamp-2 text-neutral-300">{description}</dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={`/admin/portfolio/images/${item.id}/seo`}
            className="rounded border border-gold/40 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:border-gold hover:bg-gold/10"
          >
            SEO
          </Link>
          <Link
            href={`/portfolio/${item.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function AdminPortfolioSeoPage() {
  const admin = await requireAdmin();
  const items = await getAdminPortfolioSeoItems();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Portfolio SEO"
        description="Manage portfolio story titles and meta descriptions without opening the content editor."
        action={
          <Link
            href="/admin/portfolio"
            className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            &larr; Back to Portfolio
          </Link>
        }
      />

      <section className="mt-8 space-y-4">
        {items.length === 0 ? (
          <div className="rounded border border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-300">
              No portfolio images found.
            </p>
          </div>
        ) : (
          items.map((item) => <SeoItemRow key={item.id} item={item} />)
        )}
      </section>
    </AdminShell>
  );
}
