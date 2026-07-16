import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAboutContent } from "@/src/lib/db/about";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import AboutNav from "../AboutNav";
import TimelineForm from "./TimelineForm";

export const metadata: Metadata = {
  title: "Timeline | About Page | Admin | SomStudioPhotography",
};

export default async function AdminAboutTimelinePage() {
  const admin = await requireAdmin();
  const content = await getAboutContent();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Timeline"
        description="The studio's milestones, year by year."
      />

      <div className="mt-8">
        <AboutNav active="/admin/about/timeline" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <TimelineForm content={content} />
        </div>
      </div>
    </AdminShell>
  );
}
