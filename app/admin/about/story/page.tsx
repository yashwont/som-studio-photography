import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAboutContent } from "@/src/lib/db/about";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import AboutNav from "../AboutNav";
import StoryForm from "./StoryForm";

export const metadata: Metadata = {
  title: "Studio Story | About Page | Admin | SomStudioPhotography",
};

export default async function AdminAboutStoryPage() {
  const admin = await requireAdmin();
  const content = await getAboutContent();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Studio Story"
        description="The three “Since 1995” paragraphs."
      />

      <div className="mt-8">
        <AboutNav active="/admin/about/story" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <StoryForm content={content} />
        </div>
      </div>
    </AdminShell>
  );
}
