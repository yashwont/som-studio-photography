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
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] ?? "bg-neutral-700/50 text-neutral-400"
      }`}
    >
      {status}
    </span>
  );
}

function ViewInquiryLink({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/inquiries/${id}`}
      className="rounded border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
    >
      View
    </Link>
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
          <div className="overflow-x-auto rounded border border-neutral-800">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-neutral-900 text-xs uppercase tracking-wide text-neutral-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Service / Package</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                  <th className="px-4 py-3 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {inquiries.map((inquiry: AdminInquiryListItem) => (
                  <tr
                    key={inquiry.id}
                    className="bg-neutral-950 hover:bg-neutral-900/60"
                  >
                    <td className="px-4 py-3 font-medium text-neutral-50">
                      {inquiry.name}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      <div>{inquiry.phone}</div>
                      {inquiry.email && (
                        <div className="text-neutral-500">
                          {inquiry.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-300">
                      {inquiry.service?.title ??
                        inquiry.package?.name ??
                        inquiry.serviceType ??
                        "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={inquiry.status} />
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {formatDate(inquiry.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <ViewInquiryLink id={inquiry.id} />
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
