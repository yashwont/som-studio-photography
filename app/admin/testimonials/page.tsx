import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Testimonials | Admin | SomStudioPhotography",
};

export default async function AdminTestimonialsPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Testimonials"
        description="Manage client reviews shown on the public site."
      />

      <p className="mt-6 text-sm text-neutral-300">
        CRUD will be added in the next phase.
      </p>
    </AdminShell>
  );
}
