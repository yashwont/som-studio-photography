import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminServiceById } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import CoverBlockForm from "../../CoverBlockForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const service = await getAdminServiceById(id);

  if (!service) {
    return { title: "Cover Block Not Found | Admin | SomStudioPhotography" };
  }

  return {
    title: `Edit ${service.title.replace(/ Photography$/i, "")} Cover | Admin | SomStudioPhotography`,
  };
}

export default async function AdminPortfolioCoverEditPage({
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

  const title = service.title.replace(/ Photography$/i, "");

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Edit Cover Block"
        description={`${title} · ${service.slug}`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/portfolio/cover"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Portfolio Covers
            </Link>
            <Link
              href={`/admin/portfolio/cover/${service.id}`}
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              View Cover
            </Link>
          </div>
        }
      />

      <div className="mt-8 max-w-3xl rounded border border-neutral-800 bg-neutral-900 p-6">
        <CoverBlockForm
          mode="edit"
          block={{
            id: service.id,
            title,
            description: service.description,
            displayOrder: service.displayOrder,
            active: service.active,
            coverUrl: service.imageUrls[0] ?? null,
          }}
        />
      </div>
    </AdminShell>
  );
}
