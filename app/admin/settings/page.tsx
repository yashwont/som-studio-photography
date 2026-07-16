import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Settings | Admin | SomStudioPhotography",
};

const SECTIONS = [
  {
    href: "/admin/settings/contact",
    title: "Contact Details",
    description: "Phone, WhatsApp number, email, and studio address.",
  },
  {
    href: "/admin/settings/map",
    title: "Map",
    description: "The Google Maps link and embed URL shown on the site.",
  },
  {
    href: "/admin/settings/social-links",
    title: "Social Links",
    description: "Up to 5 social profile links shown in the footer and contact page.",
  },
  {
    href: "/admin/settings/business-hours",
    title: "Business Hours",
    description: "Up to 4 rows of studio hours.",
  },
  {
    href: "/admin/settings/account",
    title: "Your Account",
    description: "Change the password for your own admin login.",
  },
] as const;

export default async function AdminSettingsPage() {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Settings"
        description="Manage site-wide contact details and business settings."
      />

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded border border-neutral-800 bg-neutral-900 p-5 transition-colors hover:border-gold"
          >
            <h2 className="font-semibold text-neutral-50">{section.title}</h2>
            <p className="mt-2 text-sm text-neutral-400">{section.description}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
