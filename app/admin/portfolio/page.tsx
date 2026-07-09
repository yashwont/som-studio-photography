import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioCategories } from "@/src/lib/db/admin-portfolio";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Portfolio | Admin | SomStudioPhotography",
};

type AdminPortfolioCategory = Awaited<
  ReturnType<typeof getAdminPortfolioCategories>
>[number];

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function AddCategoryButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/admin/portfolio/new"
      className={`inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 ${className}`}
    >
      Add Category
    </Link>
  );
}

function ViewCategoryLink({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/portfolio/${id}`}
      className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
    >
      View
    </Link>
  );
}

function EditCategoryLink({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/portfolio/${id}/edit`}
      className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
    >
      Edit
    </Link>
  );
}

export default async function AdminPortfolioPage() {
  const admin = await requireAdmin();
  const categories = await getAdminPortfolioCategories();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Portfolio"
        description="Manage portfolio categories and image collections."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/portfolio/images"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              Manage Images
            </Link>
            <AddCategoryButton />
          </div>
        }
      />

      <section className="mt-8">
        {categories.length === 0 ? (
          <div className="rounded border border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-300">
              No portfolio categories found. Category management will be
              added in the next phase.
            </p>
            <AddCategoryButton className="mt-4" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded border border-neutral-800">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Images</th>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {categories.map((category: AdminPortfolioCategory) => (
                  <tr
                    key={category.id}
                    className="bg-neutral-950 hover:bg-neutral-900/60"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-50">
                      {category.name}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {category.slug}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {category.description ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {category._count.images}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {category.displayOrder}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {formatDate(category.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <ViewCategoryLink id={category.id} />
                        <EditCategoryLink id={category.id} />
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
