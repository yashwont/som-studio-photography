import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioCategoryById } from "@/src/lib/db/admin-portfolio";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import EditPortfolioCategoryForm from "./EditPortfolioCategoryForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const category = await getAdminPortfolioCategoryById(id);

  if (!category) {
    return {
      title: "Portfolio Category Not Found | Admin | SomStudioPhotography",
    };
  }

  return { title: `Edit ${category.name} | Admin | SomStudioPhotography` };
}

export default async function AdminPortfolioCategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const category = await getAdminPortfolioCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Edit Portfolio Category"
        description={`${category.name} · ${category.slug}`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/portfolio"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Portfolio
            </Link>
            <Link
              href={`/admin/portfolio/${category.id}`}
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              View Category
            </Link>
          </div>
        }
      />

      <div className="mt-8 max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <EditPortfolioCategoryForm
          category={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            displayOrder: category.displayOrder,
          }}
        />
      </div>
    </AdminShell>
  );
}
