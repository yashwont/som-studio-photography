import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAboutContent } from "@/src/lib/db/about";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import AboutContentForm from "./AboutContentForm";

export const metadata: Metadata = {
  title: "About Page | Admin | SomStudioPhotography",
};

export default async function AdminAboutPage() {
  const admin = await requireAdmin();
  const content = await getAboutContent();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="About Page"
        description="Edit the hero, studio story, highlight cards, and call-to-action shown on the public About page."
      />

      <div className="mt-8 max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <AboutContentForm content={content} />
      </div>
    </AdminShell>
  );
}
