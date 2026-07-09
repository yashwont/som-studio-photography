import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioCategoriesForSelect } from "@/src/lib/db/admin-portfolio";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import NewPortfolioImageForm from "./NewPortfolioImageForm";

export const metadata: Metadata = {
  title: "Add Portfolio Image | Admin | SomStudioPhotography",
};

export default async function AdminNewPortfolioImagePage() {
  const admin = await requireAdmin();
  const categories = await getAdminPortfolioCategoriesForSelect();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Add Portfolio Image"
        description="Add a new image to a portfolio category."
        action={
          <Link
            href="/admin/portfolio/images"
            className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            &larr; Back to Images
          </Link>
        }
      />

      <div className="mt-8 max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <NewPortfolioImageForm categories={categories} />
      </div>
    </AdminShell>
  );
}
