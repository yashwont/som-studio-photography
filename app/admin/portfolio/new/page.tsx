import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import NewPortfolioCategoryForm from "./NewPortfolioCategoryForm";

export const metadata: Metadata = {
  title: "Add Portfolio Category | Admin | SomStudioPhotography",
};

export default async function AdminNewPortfolioCategoryPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Add Portfolio Category"
        description="Create a new portfolio category for image collections."
        action={
          <Link
            href="/admin/portfolio"
            className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            &larr; Back to Portfolio
          </Link>
        }
      />

      <div className="mt-8 max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <NewPortfolioCategoryForm />
      </div>
    </AdminShell>
  );
}
