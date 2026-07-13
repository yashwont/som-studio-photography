import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminServices } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import DeleteServiceButton from "./DeleteServiceButton";

export const metadata: Metadata = {
  title: "Services | Admin | SomStudioPhotography",
};

type AdminService = Awaited<ReturnType<typeof getAdminServices>>[number];

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getSafeThumbnailUrl(imageUrl: string) {
  const trimmedUrl = imageUrl.trim();

  if (!trimmedUrl || trimmedUrl.includes('"') || trimmedUrl.includes("'")) {
    return null;
  }

  if (trimmedUrl.startsWith("/") && !trimmedUrl.startsWith("//")) {
    return trimmedUrl;
  }

  try {
    const url = new URL(trimmedUrl);
    return url.protocol === "http:" || url.protocol === "https:"
      ? trimmedUrl
      : null;
  } catch {
    return null;
  }
}

function ServiceThumbnail({ imageUrl }: { imageUrl: string | null }) {
  const thumbnailUrl = imageUrl ? getSafeThumbnailUrl(imageUrl) : null;

  if (!thumbnailUrl) {
    return (
      <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-[10px] text-neutral-500">
        No photo
      </div>
    );
  }

  return (
    <div
      aria-label="Service photo"
      role="img"
      className="h-12 w-16 shrink-0 rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${JSON.stringify(thumbnailUrl)})` }}
    />
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-neutral-700/50 text-neutral-400"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function AddServiceButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/admin/services/new"
      className={`inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 ${className}`}
    >
      Add Service
    </Link>
  );
}

function ViewServiceButton({ serviceId }: { serviceId: string }) {
  return (
    <Link
      href={`/admin/services/${serviceId}`}
      className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
    >
      View
    </Link>
  );
}

function EditServiceButton({ serviceId }: { serviceId: string }) {
  return (
    <Link
      href={`/admin/services/${serviceId}/edit`}
      className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
    >
      Edit
    </Link>
  );
}

export default async function AdminServicesPage() {
  const admin = await requireAdmin();
  const services = await getAdminServices();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Services"
        description="Manage photography services shown on the website."
        action={<AddServiceButton />}
      />

      <section className="mt-8">
        {services.length === 0 ? (
          <div className="rounded border border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-300">No services yet.</p>
            <AddServiceButton className="mt-4" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded border border-neutral-800">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Photo</th>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Featured</th>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {services.map((service: AdminService) => (
                  <tr
                    key={service.id}
                    className="bg-neutral-950 hover:bg-neutral-900/60"
                  >
                    <td className="px-4 py-3">
                      <ServiceThumbnail imageUrl={service.imageUrl} />
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-50">
                      {service.title}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge active={service.active} />
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {service.featured ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {service.displayOrder}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {formatDate(service.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <ViewServiceButton serviceId={service.id} />
                        <EditServiceButton serviceId={service.id} />
                        <DeleteServiceButton
                          serviceId={service.id}
                          serviceTitle={service.title}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
