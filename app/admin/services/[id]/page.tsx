import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminServiceById } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

type AdminServiceDetail = NonNullable<
  Awaited<ReturnType<typeof getAdminServiceById>>
>;
type AdminServicePackage = AdminServiceDetail["packages"][number];

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

  return { title: `${service.title} | Admin | SomStudioPhotography` };
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(price: AdminServicePackage["price"]) {
  if (!price) {
    return "Contact for pricing";
  }

  return `NRS ${price.toNumber().toLocaleString("en-US")}`;
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

function DetailCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded border border-neutral-800 bg-neutral-900 p-5 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default async function AdminServiceDetailPage({
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

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title={service.title}
        description={`${service.slug} · ${service.category ?? "Uncategorized"} · ${
          service.active ? "Active" : "Inactive"
        }`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/services"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Services
            </Link>
            <Link
              href={`/admin/services/${service.id}/edit`}
              className="inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500"
            >
              Edit Service
            </Link>
          </div>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DetailCard title="Basic Details">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Created</dt>
              <dd className="mt-1 text-neutral-100">
                {formatDate(service.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Updated</dt>
              <dd className="mt-1 text-neutral-100">
                {formatDate(service.updatedAt)}
              </dd>
            </div>
          </dl>
        </DetailCard>

        <DetailCard title="Status & Settings">
          <div className="flex flex-wrap gap-3">
            <StatusBadge active={service.active} />
            {service.featured ? (
              <span className="inline-flex rounded-full border border-gold/30 px-2.5 py-1 text-xs font-semibold text-gold">
                Featured
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-neutral-700/50 px-2.5 py-1 text-xs font-semibold text-neutral-400">
                Not featured
              </span>
            )}
          </div>
        </DetailCard>

        <DetailCard title="Description">
          <p className="text-sm leading-relaxed text-neutral-200">
            {service.description}
          </p>
        </DetailCard>

        <DetailCard title="Highlights">
          {service.highlights.length === 0 ? (
            <p className="text-sm text-neutral-400">No highlights added.</p>
          ) : (
            <ul className="space-y-2 text-sm text-neutral-200">
              {service.highlights.map((highlight: string) => (
                <li key={highlight} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold"
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          )}
        </DetailCard>
      </div>

      <div className="mt-6">
        <DetailCard title="Packages">
          {service.packages.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No packages added yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-neutral-500">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Name</th>
                    <th className="px-3 py-2 font-semibold">Price</th>
                    <th className="px-3 py-2 font-semibold">Description</th>
                    <th className="px-3 py-2 font-semibold">Inclusions</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {service.packages.map((pkg: AdminServicePackage) => (
                    <tr key={pkg.id}>
                      <td className="px-3 py-3 font-medium text-neutral-50">
                        {pkg.name}
                      </td>
                      <td className="px-3 py-3 text-neutral-300">
                        {formatPrice(pkg.price)}
                      </td>
                      <td className="px-3 py-3 text-neutral-300">
                        {pkg.description ?? "—"}
                      </td>
                      <td className="px-3 py-3 text-neutral-300">
                        {pkg.inclusions.length > 0
                          ? pkg.inclusions.join(", ")
                          : "—"}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge active={pkg.active} />
                      </td>
                      <td className="px-3 py-3 text-neutral-300">
                        {pkg.displayOrder}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DetailCard>
      </div>
    </AdminShell>
  );
}
