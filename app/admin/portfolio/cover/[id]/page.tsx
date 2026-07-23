import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminServiceById } from "@/src/lib/db/admin-services";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

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
    title: `${service.title.replace(/ Photography$/i, "")} Cover | Admin | SomStudioPhotography`,
  };
}

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

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-neutral-700/50 text-neutral-400"
      }`}
    >
      {active ? "Public" : "Hidden"}
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

export default async function AdminPortfolioCoverDetailPage({
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
  const coverUrl = getSafeImageUrl(service.imageUrls[0]);

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title={`${title} Cover`}
        description={`${service.slug} · ${service.active ? "Public" : "Hidden"}`}
        action={
          <Link
            href="/admin/portfolio/cover"
            className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
          >
            &larr; Back to Portfolio Covers
          </Link>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DetailCard title="Cover Photo">
          {coverUrl ? (
            <div
              aria-label={`${title} cover photo`}
              role="img"
              className="h-56 w-full rounded border border-neutral-800 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${JSON.stringify(coverUrl)})` }}
            />
          ) : (
            <div className="flex h-56 w-full items-center justify-center rounded border border-neutral-800 bg-neutral-950 text-sm text-neutral-500">
              No cover photo
            </div>
          )}
        </DetailCard>

        <DetailCard title="Placement & Status">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Order</dt>
              <dd className="mt-1 text-neutral-100">
                {String(service.displayOrder + 1).padStart(2, "0")}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Status</dt>
              <dd className="mt-1">
                <StatusBadge active={service.active} />
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

        <DetailCard title="Title">
          <p className="text-sm leading-relaxed text-neutral-200">{title}</p>
        </DetailCard>

        <DetailCard title="Description">
          <p className="text-sm leading-relaxed text-neutral-200">
            {service.description}
          </p>
        </DetailCard>
      </div>
    </AdminShell>
  );
}
