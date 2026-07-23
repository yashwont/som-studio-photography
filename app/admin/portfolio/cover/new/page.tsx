import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioServices } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import CoverBlockForm from "../CoverBlockForm";

export const metadata: Metadata = {
  title: "Add Portfolio Cover | Admin | SomStudioPhotography",
};

export default async function AdminNewPortfolioCoverPage() {
  const admin = await requireAdmin();
  const services = await getAdminPortfolioServices();
  const nextDisplayOrder = services.length + 1;
  const serviceOptions = services.map((service) => ({
    id: service.id,
    title: service.title,
    description: service.description,
    displayOrder: service.displayOrder,
    active: service.active,
    coverUrl: service.imageUrls[0] ?? null,
  }));

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Add Portfolio Cover"
        description="Choose an existing service and prepare its portfolio cover block."
        action={
          <Link
            href="/admin/portfolio/cover"
            className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            &larr; Back to Portfolio Covers
          </Link>
        }
      />

      <div className="mt-8 max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <CoverBlockForm
          mode="create"
          nextDisplayOrder={nextDisplayOrder}
          services={serviceOptions}
        />
      </div>
    </AdminShell>
  );
}
