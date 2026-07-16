import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getContactInfo } from "@/src/lib/db/contact";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import SettingsNav from "../SettingsNav";
import ContactDetailsForm from "./ContactDetailsForm";

export const metadata: Metadata = {
  title: "Contact Details | Settings | Admin | SomStudioPhotography",
};

export default async function AdminSettingsContactPage() {
  const admin = await requireAdmin();
  const contact = await getContactInfo();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Contact Details"
        description="Phone, WhatsApp number, email, and studio address."
      />

      <div className="mt-8">
        <SettingsNav active="/admin/settings/contact" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <ContactDetailsForm contact={contact} />
        </div>
      </div>
    </AdminShell>
  );
}
