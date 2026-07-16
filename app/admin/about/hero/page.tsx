import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAboutContent } from "@/src/lib/db/about";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import AboutNav from "../AboutNav";
import HeroForm from "./HeroForm";

export const metadata: Metadata = {
  title: "Hero | About Page | Admin | SomStudioPhotography",
};

export default async function AdminAboutHeroPage() {
  const admin = await requireAdmin();
  const content = await getAboutContent();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Hero"
        description="Eyebrow, title, subtitle, and the quote shown beside it."
      />

      <div className="mt-8">
        <AboutNav active="/admin/about/hero" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <HeroForm content={content} />
        </div>
      </div>
    </AdminShell>
  );
}
