import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminServiceById } from "@/src/lib/db/admin-services";
import { getAdminPortfolioCategoriesForSelect } from "@/src/lib/db/admin-portfolio";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import EditServiceForm, { type ServiceFormValues } from "./EditServiceForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const service = await getAdminServiceById(id);

  if (!service) {
    return { title: "Service Not Found | Admin | SomStudioPhotography" };
  }

  return { title: `Edit ${service.title} | Admin | SomStudioPhotography` };
}

export default async function AdminServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const service = await getAdminServiceById(id);

  if (!service) {
    notFound();
  }

  const portfolioCategories = await getAdminPortfolioCategoriesForSelect();

  const serviceFormValues: ServiceFormValues = {
    id: service.id,
    title: service.title,
    description: service.description,
    imageUrl: service.imageUrl,
    price: service.price ? service.price.toNumber() : null,
    inclusions: service.inclusions,
    category: service.category,
    featured: service.featured,
    active: service.active,
  };

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Edit Service"
        description={`${service.title} · ${service.slug}`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/services"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Services
            </Link>
            <Link
              href={`/admin/services/${service.id}`}
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              View Service
            </Link>
          </div>
        }
      />

      <div className="mt-8 max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <EditServiceForm
          service={serviceFormValues}
          portfolioCategories={portfolioCategories}
        />
      </div>
    </AdminShell>
  );
}
