import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminServiceById } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import DeleteServiceButton from "../DeleteServiceButton";

type AdminServiceDetail = NonNullable<
  Awaited<ReturnType<typeof getAdminServiceById>>
>;

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

function formatPrice(price: AdminServiceDetail["price"]) {
  if (!price) {
    return "Contact for pricing";
  }

  return `NRS ${price.toNumber().toLocaleString("en-US")}`;
}

function getSafeImageUrl(imageUrl: string) {
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

  const photoUrls = service.imageUrls
    .map((url: string) => getSafeImageUrl(url))
    .filter((url: string | null): url is string => url !== null);

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title={service.title}
        description={`${service.slug} · ${service.active ? "Active" : "Inactive"}`}
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
            <DeleteServiceButton
              serviceId={service.id}
              serviceTitle={service.title}
              className="px-4 py-2"
            />
          </div>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DetailCard title="Photos">
          {photoUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {photoUrls.map((url: string, index: number) => (
                <div
                  key={url}
                  aria-label={`${service.title} photo ${index + 1}`}
                  role="img"
                  className="h-28 w-full rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${JSON.stringify(url)})` }}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-40 w-full items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-sm text-neutral-500">
              No photo uploaded
            </div>
          )}
        </DetailCard>

        <DetailCard title="Basic Details">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Price</dt>
              <dd className="mt-1 text-neutral-100">
                {formatPrice(service.price)}
              </dd>
            </div>
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

        <DetailCard title="Inclusions">
          {service.inclusions.length === 0 ? (
            <p className="text-sm text-neutral-400">No inclusions added.</p>
          ) : (
            <ul className="space-y-2 text-sm text-neutral-200">
              {service.inclusions.map((inclusion: string) => (
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
      </div>
    </AdminShell>
  );
}
