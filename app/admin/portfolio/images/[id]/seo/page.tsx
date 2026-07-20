import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioImageSeoById } from "@/src/lib/db/admin-portfolio";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import PortfolioSeoForm from "./PortfolioSeoForm";
import { updatePortfolioSeo } from "./actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const image = await getAdminPortfolioImageSeoById(id);

  if (!image) {
    return {
      title: "Portfolio SEO Not Found | Admin | SomStudioPhotography",
    };
  }

  return { title: `SEO: ${image.title} | Admin | SomStudioPhotography` };
}

export default async function AdminPortfolioImageSeoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const image = await getAdminPortfolioImageSeoById(id);

  if (!image) {
    notFound();
  }

  const fallbackTitle = `${image.title} | ${image.category.name} Portfolio`;
  const fallbackDescription =
    image.description || `View ${image.title} by SomStudioPhotography.`;

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Portfolio SEO"
        description={`${image.title} · ${image.category.name}`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/portfolio/seo"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to SEO
            </Link>
          </div>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <PortfolioSeoForm
          action={updatePortfolioSeo.bind(null, image.id)}
          initialSeo={{
            title: image.story?.seoTitle ?? "",
            description: image.story?.seoDescription ?? "",
          }}
          cancelHref="/admin/portfolio/seo"
          publicUrl={`/portfolio/${image.slug}`}
        />

        <aside className="rounded border border-neutral-800 bg-neutral-900 p-5 sm:p-6 lg:sticky lg:top-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-400">
            Current fallback
          </h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-neutral-500">Title if blank</dt>
              <dd className="mt-1 text-neutral-100">{fallbackTitle}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Description if blank</dt>
              <dd className="mt-1 leading-relaxed text-neutral-100">
                {fallbackDescription}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Public URL</dt>
              <dd className="mt-1 break-all text-neutral-100">
                /portfolio/{image.slug}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </AdminShell>
  );
}
