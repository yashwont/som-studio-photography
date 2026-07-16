import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAboutContent } from "@/src/lib/db/about";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import AboutNav from "../AboutNav";
import HighlightsForm from "./HighlightsForm";

export const metadata: Metadata = {
  title: "Highlights | About Page | Admin | SomStudioPhotography",
};

export default async function AdminAboutHighlightsPage() {
  const admin = await requireAdmin();
  const content = await getAboutContent();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Highlights"
        description="The “What guides every session” value cards."
      />

      <div className="mt-8">
        <AboutNav active="/admin/about/highlights" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <HighlightsForm content={content} />
        </div>
      </div>
    </AdminShell>
  );
}
