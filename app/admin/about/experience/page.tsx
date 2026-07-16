import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAboutContent } from "@/src/lib/db/about";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import AboutNav from "../AboutNav";
import ExperienceForm from "./ExperienceForm";

export const metadata: Metadata = {
  title: "Studio Experience | About Page | Admin | SomStudioPhotography",
};

export default async function AdminAboutExperiencePage() {
  const admin = await requireAdmin();
  const content = await getAboutContent();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Studio Experience"
        description="The step-by-step “What to expect” cards."
      />

      <div className="mt-8">
        <AboutNav active="/admin/about/experience" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <ExperienceForm content={content} />
        </div>
      </div>
    </AdminShell>
  );
}
