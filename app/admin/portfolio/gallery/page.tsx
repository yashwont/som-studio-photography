import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminPortfolioServices } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import DeleteGalleryButton from "./DeleteGalleryButton";

export const metadata: Metadata = {
  title: "Gallery Pages | Admin | SomStudioPhotography",
};

type AdminPortfolioService = Awaited<
  ReturnType<typeof getAdminPortfolioServices>
>[number];

function getSafeImageUrl(imageUrl: string | undefined) {
  const trimmedUrl = imageUrl?.trim() ?? "";

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

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function GalleryCard({ service }: { service: AdminPortfolioService }) {
  const title = service.title.replace(/ Photography$/i, "");
  const coverUrl = getSafeImageUrl(service.imageUrls[0]);
  const galleryCount = service.imageUrls.length;

  return (
    <article className="overflow-hidden rounded border border-neutral-800 bg-neutral-950">
      {coverUrl ? (
        <div
          aria-label={`${title} gallery cover`}
          role="img"
          className="h-40 w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${JSON.stringify(coverUrl)})` }}
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-neutral-950 text-xs text-neutral-500">
          No gallery photo
        </div>
      )}

      <div className="p-4">
        <h2 className="font-medium text-neutral-50">{title}</h2>
        <p className="mt-1 text-xs text-neutral-500">{service.slug}</p>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div>
            <dt className="text-neutral-500">Photos</dt>
            <dd className="text-neutral-300">{galleryCount}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Updated</dt>
            <dd className="text-neutral-300">{formatDate(service.updatedAt)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/portfolio/${service.slug}`}
            target="_blank"
            className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            View
          </Link>
          <Link
            href={`/admin/portfolio/gallery/${service.id}/edit`}
            className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            Edit
          </Link>
          <DeleteGalleryButton
            serviceId={service.id}
            title={title}
            disabled={galleryCount === 0}
          />
        </div>
      </div>
    </article>
  );
}

export default async function AdminPortfolioGalleryPage() {
  const admin = await requireAdmin();
  const services = await getAdminPortfolioServices();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Gallery Pages"
        description="Manage the images shown inside each individual portfolio category page."
        action={
          <Link
            href="/admin/portfolio"
            className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            &larr; Back to Portfolio
          </Link>
        }
      />

      <section className="mt-8">
        {services.length === 0 ? (
          <div className="rounded border border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-300">
              No portfolio categories exist yet. Add a service first.
            </p>
            <Link
              href="/admin/services/new"
              className="mt-4 inline-flex rounded bg-gold px-4 py-2 text-sm font-semibold text-neutral-950 transition-colors hover:bg-yellow-500"
            >
              Add Service
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service: AdminPortfolioService) => (
              <GalleryCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
