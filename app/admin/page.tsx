import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import {
  getAdminDashboardStats,
  type AdminDashboardRecentInquiry,
} from "@/src/lib/db/admin-dashboard";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import AdminStatCard from "@/src/components/admin/AdminStatCard";

export const metadata: Metadata = {
  title: "Admin Dashboard | SomStudioPhotography",
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

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex rounded border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:border-gold hover:text-gold"
    >
      {label}
    </Link>
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400">
      {children}
    </h2>
  );
}

export default async function AdminPage() {
  const admin = await requireAdmin();

  const stats = await getAdminDashboardStats();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="SomStudioPhotography Admin"
        description={`Logged in as ${admin.name} (${admin.email}).`}
      />

      <section className="mt-8">
        <SectionHeading>Inquiries</SectionHeading>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <AdminStatCard label="Total" value={stats.totalInquiries} />
          <AdminStatCard label="New" value={stats.newInquiries} />
          <AdminStatCard label="Contacted" value={stats.contactedInquiries} />
          <AdminStatCard label="Booked" value={stats.bookedInquiries} />
          <AdminStatCard label="Closed" value={stats.closedInquiries} />
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading>Content</SectionHeading>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <AdminStatCard label="Services" value={stats.servicesCount} />
          <AdminStatCard label="Packages" value={stats.packagesCount} />
          <AdminStatCard
            label="Portfolio categories"
            value={stats.portfolioCategoriesCount}
          />
          <AdminStatCard
            label="Portfolio images"
            value={stats.portfolioImagesCount}
          />
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading>Quick Links</SectionHeading>
        <div className="mt-4 flex flex-wrap gap-3">
          <QuickLink href="/admin/services" label="Manage Services" />
          <QuickLink href="/admin/portfolio" label="Manage Portfolio" />
          <QuickLink href="/admin/inquiries" label="View Inquiries" />
        </div>
      </section>

      <section className="mt-8">
        <SectionHeading>Recent Inquiries</SectionHeading>
        <div className="mt-4 rounded border border-neutral-800 bg-neutral-900">
          {stats.recentInquiries.length === 0 ? (
            <p className="p-6 text-sm text-neutral-300">
              No inquiries yet. New submissions from the contact form will
              appear here.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-800">
              {stats.recentInquiries.map((inquiry: AdminDashboardRecentInquiry) => (
                <li key={inquiry.id}>
                  <Link
                    href={`/admin/inquiries/${inquiry.id}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-neutral-800/60"
                  >
                    <div>
                      <p className="font-medium text-neutral-50">
                        {inquiry.name}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {inquiry.service?.title ??
                          inquiry.package?.name ??
                          inquiry.serviceType ??
                          "General inquiry"}{" "}
                        · {formatDate(inquiry.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={inquiry.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </AdminShell>
  );
}
