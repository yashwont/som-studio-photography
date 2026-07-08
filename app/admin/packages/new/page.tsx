import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminServices } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import NewPackageForm from "./NewPackageForm";

export const metadata: Metadata = {
  title: "Add Package | Admin | SomStudioPhotography",
};

export default async function AdminNewPackagePage() {
  const admin = await requireAdmin();
  const services = await getAdminServices();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Add Package"
        description="Create a package for a photography service."
        action={
          <Link
            href="/admin/packages"
            className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            &larr; Back to Packages
          </Link>
        }
      />

      <div className="mt-8 max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <NewPackageForm services={services} />
      </div>
    </AdminShell>
  );
}
