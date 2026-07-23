import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioServices } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import CoverImageForm from "./CoverImageForm";

export const metadata: Metadata = {
  title: "Portfolio Covers | Admin | SomStudioPhotography",
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

export default async function AdminPortfolioCoversPage() {
  const admin = await requireAdmin();
  const services = await getAdminPortfolioServices();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Portfolio Covers"
        description="Add, update, or remove the main cover image used for each portfolio category."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/portfolio"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              Back to Portfolio
            </Link>
            <Link
              href="/portfolio"
              target="_blank"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              View Public Page
            </Link>
          </div>
        }
      />

      <section className="mt-8 rounded border border-neutral-800 bg-neutral-900 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
          Cover rule
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-300">
          The cover image is the first photo in each service gallery. Updating a
          cover replaces only that first photo. Removing a cover promotes the
          next gallery photo into the cover position.
        </p>
      </section>

      <section className="mt-8">
        {services.length === 0 ? (
          <div className="rounded border border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-300">
              No portfolio categories exist yet. Add services first.
            </p>
            <Link
              href="/admin/services/new"
              className="mt-4 inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500"
            >
              Add Service
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
            {services.map((service: AdminPortfolioService) => (
              <article
                key={service.id}
                className="rounded border border-neutral-800 bg-neutral-900 p-5"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-50">
                      {service.title.replace(/ Photography$/i, "")}
                    </h2>
                    <p className="mt-1 text-xs text-neutral-500">
                      {service.slug}
                    </p>
                  </div>
                  <StatusBadge active={service.active} />
                </div>

                <CoverImageForm
                  serviceId={service.id}
                  serviceTitle={service.title}
                  currentCoverUrl={getSafeImageUrl(service.imageUrls[0])}
                />
              </article>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
