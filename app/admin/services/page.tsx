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

function FeaturedBadge({ featured }: { featured: boolean }) {
  return featured ? (
    <span className="inline-flex rounded-full border border-gold/30 px-2.5 py-1 text-xs font-semibold text-gold">
      Featured
    </span>
  ) : null;
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

function ServiceCard({ service }: { service: AdminService }) {
  const imageUrl = service.imageUrls[0] ?? null;
  const thumbnailUrl = imageUrl ? getSafeThumbnailUrl(imageUrl) : null;

  return (
    <div className="overflow-hidden rounded border border-neutral-800 bg-neutral-950">
      {thumbnailUrl ? (
        <div
          aria-label={`${service.title} photo`}
          role="img"
          className="h-40 w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${JSON.stringify(thumbnailUrl)})` }}
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-neutral-900 text-xs text-neutral-500">
          No photo
        </div>
      )}

      <div className="p-4">
        <h3 className="font-medium text-neutral-50">{service.title}</h3>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <StatusBadge active={service.active} />
          <FeaturedBadge featured={service.featured} />
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <dt className="text-neutral-500">Order</dt>
            <dd className="text-neutral-300">{service.displayOrder + 1}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Updated</dt>
            <dd className="text-neutral-300">{formatDate(service.updatedAt)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/admin/services/${service.id}`}
            className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            View
          </Link>
          <Link
            href={`/admin/services/${service.id}/edit`}
            className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            Edit
          </Link>
          <DeleteServiceButton serviceId={service.id} serviceTitle={service.title} />
        </div>
      </div>
    </div>
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service: AdminService) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
