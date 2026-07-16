import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getContactInfo } from "@/src/lib/db/contact";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import SettingsNav from "../SettingsNav";
import AfterInquiryForm from "./AfterInquiryForm";

export const metadata: Metadata = {
  title: "After Inquiry | Settings | Admin | SomStudioPhotography",
};

export default async function AdminSettingsAfterInquiryPage() {
  const admin = await requireAdmin();
  const contact = await getContactInfo();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="After Inquiry"
        description="The 3-step 'After your inquiry' section on the contact page."
      />

      <div className="mt-8">
        <SettingsNav active="/admin/settings/after-inquiry" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <AfterInquiryForm contact={contact} />
        </div>
      </div>
    </AdminShell>
  );
}
