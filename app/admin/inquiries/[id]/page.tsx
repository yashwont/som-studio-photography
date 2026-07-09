import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/src/lib/auth/admin";
import { getAdminInquiryById } from "@/src/lib/db/admin-inquiries";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import UpdateInquiryForm from "./UpdateInquiryForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const inquiry = await getAdminInquiryById(id);

  if (!inquiry) {
    return { title: "Inquiry Not Found | Admin | SomStudioPhotography" };
  }

  return { title: `${inquiry.name} | Admin | SomStudioPhotography` };
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-400",
  CONTACTED: "bg-amber-500/10 text-amber-400",
  BOOKED: "bg-emerald-500/10 text-emerald-400",
  CLOSED: "bg-neutral-700/50 text-neutral-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] ?? "bg-neutral-700/50 text-neutral-400"
      }`}
    >
      {status}
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

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  const { id } = await params;
  const inquiry = await getAdminInquiryById(id);

  if (!inquiry) {
    notFound();
  }

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title={inquiry.name}
        description={`Submitted ${formatDate(inquiry.createdAt)}`}
        action={
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={inquiry.status} />
            <Link
              href="/admin/inquiries"
              className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
            >
              &larr; Back to Inquiries
            </Link>
          </div>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DetailCard title="Contact Details">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Phone</dt>
              <dd className="mt-1 text-neutral-100">{inquiry.phone}</dd>
            </div>
            <div>
              <dt className="text-neutral-500">Email</dt>
              <dd className="mt-1 text-neutral-100">
                {inquiry.email ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Preferred date</dt>
              <dd className="mt-1 text-neutral-100">
                {inquiry.preferredDate
                  ? formatDate(inquiry.preferredDate)
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Submitted</dt>
              <dd className="mt-1 text-neutral-100">
                {formatDateTime(inquiry.createdAt)}
              </dd>
            </div>
          </dl>
        </DetailCard>

        <DetailCard title="Service / Package">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-neutral-500">Service</dt>
              <dd className="mt-1 text-neutral-100">
                {inquiry.service ? (
                  <Link
                    href={`/admin/services/${inquiry.service.id}`}
                    className="font-medium text-neutral-100 transition-colors hover:text-gold"
                  >
                    {inquiry.service.title}
                  </Link>
                ) : (
                  inquiry.serviceType ?? "—"
                )}
              </dd>
            </div>
            {inquiry.package && (
              <div>
                <dt className="text-neutral-500">Package</dt>
                <dd className="mt-1 text-neutral-100">
                  {inquiry.package.name}
                </dd>
              </div>
            )}
          </dl>
        </DetailCard>

        <DetailCard title="Message">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-200">
            {inquiry.message}
          </p>
        </DetailCard>

        <DetailCard title="Update Status & Notes">
          <UpdateInquiryForm
            inquiryId={inquiry.id}
            status={inquiry.status}
            notes={inquiry.notes}
          />
        </DetailCard>
      </div>
    </AdminShell>
  );
}
