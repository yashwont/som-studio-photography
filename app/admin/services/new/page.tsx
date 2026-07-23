import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import NewServiceForm from "./NewServiceForm";

export const metadata: Metadata = {
  title: "Add Service | Admin | SomStudioPhotography",
};

export default async function AdminNewServicePage() {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Add Service"
        description="Create a new photography service for the website."
        action={
          <Link
            href="/admin/services"
            className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            &larr; Back to Services
          </Link>
        }
      />

      <div className="mt-8 max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <NewServiceForm />
      </div>
    </AdminShell>
  );
}
