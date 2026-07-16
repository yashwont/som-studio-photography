import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import SettingsNav from "../SettingsNav";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata: Metadata = {
  title: "Your Account | Settings | Admin | SomStudioPhotography",
};

export default async function AdminSettingsAccountPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Your Account"
        description={`Change the password for ${admin.email}.`}
      />

      <div className="mt-8">
        <SettingsNav active="/admin/settings/account" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <ChangePasswordForm />
        </div>
      </div>
    </AdminShell>
  );
}
