import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getHomeContent } from "@/src/lib/db/home";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import HomeNav from "../HomeNav";
import HeroContentForm from "./HeroContentForm";

export const metadata: Metadata = {
  title: "Hero | Home Page | Admin | SomStudioPhotography",
};

export default async function AdminHomeHeroPage() {
  const admin = await requireAdmin();
  const content = await getHomeContent();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Hero"
        description="Welcome text and trust points."
      />

      <div className="mt-8">
        <HomeNav active="/admin/home/hero" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <HeroContentForm content={content} />
        </div>
      </div>
    </AdminShell>
  );
}
