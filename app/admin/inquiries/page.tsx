import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import {
  getAdminInquiries,
  type AdminInquiryListItem,
} from "@/src/lib/db/admin-inquiries";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Inquiries | Admin | SomStudioPhotography",
};

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
      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] ?? "bg-neutral-700/50 text-neutral-400"
      }`}
    >
      {status}
    </span>
  );
}

function InquiryCard({ inquiry }: { inquiry: AdminInquiryListItem }) {
  return (
    <div className="rounded border border-neutral-800 bg-neutral-950 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-medium text-neutral-50">{inquiry.name}</h3>
        <StatusBadge status={inquiry.status} />
      </div>

      <div className="mt-2 text-sm text-neutral-300">
        <div>{inquiry.phone}</div>
        {inquiry.email && (
          <div className="text-neutral-500">{inquiry.email}</div>
        )}
      </div>

      <p className="mt-2 text-sm text-neutral-400">
        {inquiry.service?.title ??
          inquiry.package?.name ??
          inquiry.serviceType ??
          "—"}
      </p>

      <p className="mt-2 text-xs text-neutral-500">
        Submitted {formatDate(inquiry.createdAt)}
      </p>

      <div className="mt-4">
        <Link
          href={`/admin/inquiries/${inquiry.id}`}
          className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
        >
          View
        </Link>
      </div>
    </div>
  );
}

export default async function AdminInquiriesPage() {
  const admin = await requireAdmin();
  const inquiries = await getAdminInquiries();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Inquiries"
        description="Review and manage inquiries submitted through the contact form."
      />

      <section className="mt-8">
        {inquiries.length === 0 ? (
          <div className="rounded border border-neutral-800 bg-neutral-900 p-8 text-center">
            <p className="text-sm text-neutral-300">
              No inquiries found. Submissions from the contact form will
              appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inquiries.map((inquiry: AdminInquiryListItem) => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
