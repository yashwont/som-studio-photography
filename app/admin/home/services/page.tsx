import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getHomeContent } from "@/src/lib/db/home";
import { getAdminServices } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import HomeNav from "../HomeNav";
import ServicesForm from "./ServicesForm";

export const metadata: Metadata = {
  title: "Services | Home Page | Admin | SomStudioPhotography",
};

export default async function AdminHomeServicesPage() {
  const admin = await requireAdmin();
  const [content, services] = await Promise.all([getHomeContent(), getAdminServices()]);
  const availableServiceTitles = services.map((service) => service.title);

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Services"
        description="The service showcase section shown on the home page."
      />

      <div className="mt-8">
        <HomeNav active="/admin/home/services" />

        <div className="max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
          <ServicesForm content={content} availableServiceTitles={availableServiceTitles} />
        </div>
      </div>
    </AdminShell>
  );
}
