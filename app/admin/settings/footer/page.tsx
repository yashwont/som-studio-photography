import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getContactInfo } from "@/src/lib/db/contact";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import SettingsNav from "../SettingsNav";
import FooterForm from "./FooterForm";

export const metadata: Metadata = {
  title: "Footer | Settings | Admin | SomStudioPhotography",
};

export default async function AdminSettingsFooterPage() {
  const admin = await requireAdmin();
  const contact = await getContactInfo();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Footer"
        description="The studio description shown in the site footer."
      />

      <div className="mt-8">
        <SettingsNav active="/admin/settings/footer" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <FooterForm contact={contact} />
        </div>
      </div>
    </AdminShell>
  );
}
