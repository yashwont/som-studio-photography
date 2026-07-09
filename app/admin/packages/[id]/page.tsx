import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPackageById } from "@/src/lib/db/admin-packages";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

type AdminPackageDetail = NonNullable<
  Awaited<ReturnType<typeof getAdminPackageById>>
>;

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

  return { title: `${pkg.name} | Admin | SomStudioPhotography` };
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(price: AdminPackageDetail["price"]) {
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

export default async function AdminPackageDetailPage({
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

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title={pkg.name}
        description={`${pkg.service.title} · ${formatPrice(pkg.price)} · ${
          pkg.active ? "Active" : "Inactive"
        }`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/packages"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Packages
            </Link>
            <Link
              href={`/admin/packages/${pkg.id}/edit`}
              className="inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500"
            >
              Edit Package
            </Link>
          </div>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DetailCard title="Basic Details">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Display order</dt>
              <dd className="mt-1 text-neutral-100">{pkg.displayOrder}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Price</dt>
              <dd className="mt-1 text-neutral-100">
                {formatPrice(pkg.price)}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Created</dt>
              <dd className="mt-1 text-neutral-100">
                {formatDate(pkg.createdAt)}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Updated</dt>
              <dd className="mt-1 text-neutral-100">
                {formatDate(pkg.updatedAt)}
              </dd>
            </div>
          </dl>
        </DetailCard>

        <DetailCard title="Related Service">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500">Service</dt>
              <dd className="mt-1">
                <Link
                  href={`/admin/services/${pkg.service.id}`}
                  className="font-medium text-neutral-100 transition-colors hover:text-gold"
                >
                  {pkg.service.title}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Slug</dt>
              <dd className="mt-1 text-neutral-100">{pkg.service.slug}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Service status</dt>
              <dd className="mt-1">
                <StatusBadge active={pkg.service.active} />
              </dd>
            </div>
          </dl>
        </DetailCard>

        <DetailCard title="Description">
          {pkg.description ? (
            <p className="text-sm leading-relaxed text-neutral-200">
              {pkg.description}
            </p>
          ) : (
            <p className="text-sm text-neutral-400">No description added.</p>
          )}
        </DetailCard>

        <DetailCard title="Inclusions">
          {pkg.inclusions.length === 0 ? (
            <p className="text-sm text-neutral-400">No inclusions added.</p>
          ) : (
            <ul className="space-y-2 text-sm text-neutral-200">
              {pkg.inclusions.map((inclusion: string) => (
                <li key={inclusion} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold"
                  />
                  {inclusion}
                </li>
              ))}
            </ul>
          )}
        </DetailCard>

        <DetailCard title="Status & Settings">
          <div className="flex flex-wrap gap-3">
            <StatusBadge active={pkg.active} />
          </div>
        </DetailCard>
      </div>
    </AdminShell>
  );
}
