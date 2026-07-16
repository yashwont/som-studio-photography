import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getContactInfo } from "@/src/lib/db/contact";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import SettingsNav from "../SettingsNav";
import MapForm from "./MapForm";

export const metadata: Metadata = {
  title: "Map | Settings | Admin | SomStudioPhotography",
};

export default async function AdminSettingsMapPage() {
  const admin = await requireAdmin();
  const contact = await getContactInfo();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Map"
        description="The Google Maps link and embed URL shown on the site."
      />

      <div className="mt-8">
        <SettingsNav active="/admin/settings/map" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <MapForm contact={contact} />
        </div>
      </div>
    </AdminShell>
  );
}
