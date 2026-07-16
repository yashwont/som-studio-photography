import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAboutContent } from "@/src/lib/db/about";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import AboutNav from "../AboutNav";
import StatsForm from "./StatsForm";

export const metadata: Metadata = {
  title: "Trust Stats | About Page | Admin | SomStudioPhotography",
};

export default async function AdminAboutStatsPage() {
  const admin = await requireAdmin();
  const content = await getAboutContent();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Trust Stats"
        description="The numbers row (years of experience, services, etc)."
      />

      <div className="mt-8">
        <AboutNav active="/admin/about/stats" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <StatsForm content={content} />
        </div>
      </div>
    </AdminShell>
  );
}
