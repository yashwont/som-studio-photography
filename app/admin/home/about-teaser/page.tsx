import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getHomeContent } from "@/src/lib/db/home";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import HomeNav from "../HomeNav";
import AboutTeaserForm from "./AboutTeaserForm";

export const metadata: Metadata = {
  title: "About Teaser | Home Page | Admin | SomStudioPhotography",
};

export default async function AdminHomeAboutTeaserPage() {
  const admin = await requireAdmin();
  const content = await getHomeContent();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="About Teaser"
        description="The about paragraph, location tag, and its four value cards."
      />

      <div className="mt-8">
        <HomeNav active="/admin/home/about-teaser" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <AboutTeaserForm content={content} />
        </div>
      </div>
    </AdminShell>
  );
}
