import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getContactInfo } from "@/src/lib/db/contact";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import SettingsNav from "../SettingsNav";
import SocialLinksForm from "./SocialLinksForm";

export const metadata: Metadata = {
  title: "Social Links | Settings | Admin | SomStudioPhotography",
};

export default async function AdminSettingsSocialLinksPage() {
  const admin = await requireAdmin();
  const contact = await getContactInfo();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Social Links"
        description="Up to 5 social profile links shown in the footer and contact page."
      />

      <div className="mt-8">
        <SettingsNav active="/admin/settings/social-links" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <SocialLinksForm contact={contact} />
        </div>
      </div>
    </AdminShell>
  );
}
