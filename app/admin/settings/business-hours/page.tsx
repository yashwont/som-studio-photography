import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getContactInfo } from "@/src/lib/db/contact";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import SettingsNav from "../SettingsNav";
import BusinessHoursForm from "./BusinessHoursForm";

export const metadata: Metadata = {
  title: "Business Hours | Settings | Admin | SomStudioPhotography",
};

export default async function AdminSettingsBusinessHoursPage() {
  const admin = await requireAdmin();
  const contact = await getContactInfo();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Business Hours"
        description="Up to 4 rows of studio hours."
      />

      <div className="mt-8">
        <SettingsNav active="/admin/settings/business-hours" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <BusinessHoursForm contact={contact} />
        </div>
      </div>
    </AdminShell>
  );
}
