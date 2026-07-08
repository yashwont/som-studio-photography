import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Inquiries | Admin | SomStudioPhotography",
};

export default async function AdminInquiriesPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Inquiries"
        description="Review and manage inquiries submitted through the contact form."
      />

      <p className="mt-6 text-sm text-neutral-300">
        CRUD will be added in the next phase.
      </p>
    </AdminShell>
  );
}
