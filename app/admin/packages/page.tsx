import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPackages } from "@/src/lib/db/admin-packages";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Packages | Admin | SomStudioPhotography",
};

type AdminPackage = Awaited<ReturnType<typeof getAdminPackages>>[number];

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPrice(price: AdminPackage["price"]) {
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

function AddPackageButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      disabled
      title="Coming soon"
      className={`cursor-not-allowed rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 opacity-50 ${className}`}
    >
      Add Package
    </button>
  );
}

function PlaceholderActionButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      disabled
      title="Coming soon"
      className="cursor-not-allowed rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-400 opacity-60"
    >
      {label}
    </button>
  );
}

export default async function AdminPackagesPage() {
  const admin = await requireAdmin();
  const packages = await getAdminPackages();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Packages"
        description="Manage service packages and pricing for future service selling."
        action={
          <div className="flex flex-col items-end gap-1">
            <AddPackageButton />
            <span className="text-xs text-neutral-500">Coming soon</span>
          </div>
        }
      />

      <section className="mt-8">
        {packages.length === 0 ? (
          <div className="rounded border border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-300">
              No packages found. Package creation will be added in the next
              phase.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded border border-neutral-800">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Package</th>
                  <th className="px-4 py-3 font-semibold">Service</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {packages.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="bg-neutral-950 hover:bg-neutral-900/60"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-50">
                      {pkg.name}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      <Link
                        href={`/admin/services/${pkg.service.id}`}
                        className="text-neutral-300 transition-colors hover:text-gold"
                      >
                        {pkg.service.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {formatPrice(pkg.price)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge active={pkg.active} />
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {pkg.displayOrder}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {formatDate(pkg.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <PlaceholderActionButton label="View" />
                        <PlaceholderActionButton label="Edit" />
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
