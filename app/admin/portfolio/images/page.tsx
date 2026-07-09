import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioImages } from "@/src/lib/db/admin-portfolio";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Portfolio Images | Admin | SomStudioPhotography",
};

type AdminPortfolioImage = Awaited<
  ReturnType<typeof getAdminPortfolioImages>
>[number];

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
  ) : (
    <span className="inline-flex rounded-full bg-neutral-700/50 px-2.5 py-1 text-xs font-semibold text-neutral-400">
      Not featured
    </span>
  );
}

function AddImageButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/admin/portfolio/images/new"
      className={`inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500 ${className}`}
    >
      Add Image
    </Link>
  );
}

function ViewImageLink({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/portfolio/images/${id}`}
      className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
    >
      View
    </Link>
  );
}

function EditImageLink({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/portfolio/images/${id}/edit`}
      className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
    >
      Edit
    </Link>
  );
}

export default async function AdminPortfolioImagesPage() {
  const admin = await requireAdmin();
  const images = await getAdminPortfolioImages();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Portfolio Images"
        description="Manage individual images within portfolio categories."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/portfolio"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Portfolio
            </Link>
            <AddImageButton />
          </div>
        }
      />

      <section className="mt-8">
        {images.length === 0 ? (
          <div className="rounded border border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-300">
              No portfolio images found.
            </p>
            <AddImageButton className="mt-4" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded border border-neutral-800">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
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
                {images.map((image: AdminPortfolioImage) => (
                  <tr
                    key={image.id}
                    className="bg-neutral-950 hover:bg-neutral-900/60"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-50">
                      {image.title}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      <Link
                        href={`/admin/portfolio/${image.category.id}`}
                        className="text-neutral-300 transition-colors hover:text-gold"
                      >
                        {image.category.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {image.slug}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge active={image.active} />
                    </td>
                    <td className="px-4 py-3">
                      <FeaturedBadge featured={image.featured} />
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {image.displayOrder}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {formatDate(image.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <ViewImageLink id={image.id} />
                        <EditImageLink id={image.id} />
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
