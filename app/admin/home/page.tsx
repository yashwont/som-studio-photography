import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/src/lib/auth/admin";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";

export const metadata: Metadata = {
  title: "Home Page | Admin | SomStudioPhotography",
};

const SECTIONS = [
  {
    href: "/admin/home/hero",
    title: "Hero",
    description: "Welcome text and trust points.",
  },
  {
    href: "/admin/home/about-teaser",
    title: "About Teaser",
    description: "The about paragraph, location tag, and its four value cards.",
  },
  {
    href: "/admin/home/services",
    title: "Services",
    description: "The service showcase section shown on the home page.",
  },
  {
    href: "/admin/home/reviews",
    title: "Reviews",
    description: "The client review testimonials shown on the home page.",
  },
  {
    href: "/admin/home/final-cta",
    title: "Final CTA",
    description: "The \"Plan your next photoshoot\" section near the bottom of the page.",
  },
] as const;

export default async function AdminHomePage() {
  const admin = await requireAdmin();

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="Home Page"
        description="Manage each section of the public home page."
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
