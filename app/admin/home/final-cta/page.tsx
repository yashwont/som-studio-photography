import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getHomeContent } from "@/src/lib/db/home";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import HomeNav from "../HomeNav";
import FinalCtaForm from "./FinalCtaForm";

export const metadata: Metadata = {
  title: "Final CTA | Home Page | Admin | SomStudioPhotography",
};

export default async function AdminHomeFinalCtaPage() {
  const admin = await requireAdmin();
  const content = await getHomeContent();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Final CTA"
        description='The "Plan your next photoshoot" section near the bottom of the page.'
      />

      <div className="mt-8">
        <HomeNav active="/admin/home/final-cta" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <FinalCtaForm content={content} />
        </div>
      </div>
    </AdminShell>
  );
}
