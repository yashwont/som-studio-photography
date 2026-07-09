import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import {
  getAdminPortfolioImageById,
  getAdminPortfolioCategoriesForSelect,
} from "@/src/lib/db/admin-portfolio";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import EditPortfolioImageForm from "./EditPortfolioImageForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const image = await getAdminPortfolioImageById(id);

  if (!image) {
    return {
      title: "Portfolio Image Not Found | Admin | SomStudioPhotography",
    };
  }

  return { title: `Edit ${image.title} | Admin | SomStudioPhotography` };
}

export default async function AdminPortfolioImageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const image = await getAdminPortfolioImageById(id);

  if (!image) {
    notFound();
  }

  const categories = await getAdminPortfolioCategoriesForSelect();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Edit Portfolio Image"
        description={`${image.title} · ${image.category.name}`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/portfolio/images"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Images
            </Link>
            <Link
              href={`/admin/portfolio/images/${image.id}`}
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              View Image
            </Link>
          </div>
        }
      />

      <div className="mt-8 max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <EditPortfolioImageForm
          image={{
            id: image.id,
            title: image.title,
            slug: image.slug,
            imageUrl: image.imageUrl,
            altText: image.altText,
            description: image.description,
            featured: image.featured,
            active: image.active,
            displayOrder: image.displayOrder,
            category: image.category,
          }}
          categories={categories}
        />
      </div>
    </AdminShell>
  );
}
