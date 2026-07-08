import type { Metadata } from "next";
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
        description="Manage portfolio categories and images shown on the public site."
      />

      <p className="mt-6 text-sm text-neutral-300">
        CRUD will be added in the next phase.
      </p>
    </AdminShell>
  );
}
