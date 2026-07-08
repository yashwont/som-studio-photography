import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPackageById } from "@/src/lib/db/admin-packages";
import { getAdminServices } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import EditPackageForm from "./EditPackageForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pkg = await getAdminPackageById(id);

  if (!pkg) {
    return { title: "Package Not Found | Admin | SomStudioPhotography" };
  }

  return { title: `Edit ${pkg.name} | Admin | SomStudioPhotography` };
}

export default async function AdminPackageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const pkg = await getAdminPackageById(id);

  if (!pkg) {
    notFound();
  }

  const services = await getAdminServices();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Edit Package"
        description={`${pkg.name} · ${pkg.service.title}`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/packages"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Packages
            </Link>
            <Link
              href={`/admin/packages/${pkg.id}`}
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              View Package
            </Link>
          </div>
        }
      />

      <div className="mt-8 max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <EditPackageForm
          pkg={{
            id: pkg.id,
            name: pkg.name,
            price: pkg.price ? pkg.price.toNumber() : null,
            description: pkg.description,
            inclusions: pkg.inclusions,
            active: pkg.active,
            displayOrder: pkg.displayOrder,
            service: pkg.service,
          }}
          services={services}
        />
      </div>
    </AdminShell>
  );
}
