import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Portfolio | Admin | SomStudioPhotography",
};

export default async function AdminPortfolioPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Portfolio"
        description="Manage the portfolio areas shown on the public website."
      />

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/portfolio/cover"
          className="rounded border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-gold"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Page
          </p>
          <h2 className="mt-3 text-xl font-semibold text-neutral-50">
            Cover Page
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Manage the category cover blocks on the public portfolio page.
          </p>
        </Link>
        <Link
          href="/admin/portfolio/gallery"
          className="rounded border border-neutral-800 bg-neutral-900 p-6 transition-colors hover:border-gold"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
            Page
          </p>
          <h2 className="mt-3 text-xl font-semibold text-neutral-50">
            Gallery Pages
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-400">
            Manage the photos inside each individual portfolio category page.
          </p>
        </Link>
      </section>
    </AdminShell>
  );
}
