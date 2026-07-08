import type { Metadata } from "next";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import AdminShell from "@/src/components/admin/AdminShell";
import AdminPageHeader from "@/src/components/admin/AdminPageHeader";
import AdminStatCard from "@/src/components/admin/AdminStatCard";

export const metadata: Metadata = {
  title: "Admin Dashboard | SomStudioPhotography",
};

export default async function AdminPage() {
  const admin = await requireAdmin();

  const [servicesCount, portfolioImagesCount, testimonialsCount, inquiriesCount] =
    await Promise.all([
      prisma.service.count(),
      prisma.portfolioImage.count(),
      prisma.testimonial.count(),
      prisma.inquiry.count(),
    ]);

  return (
    <AdminShell adminName={admin.name} adminEmail={admin.email}>
      <AdminPageHeader
        title="SomStudioPhotography Admin"
        description={`Logged in as ${admin.name} (${admin.email}).`}
      />

      <section className="grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Services" value={servicesCount} />
        <AdminStatCard label="Portfolio images" value={portfolioImagesCount} />
        <AdminStatCard label="Testimonials" value={testimonialsCount} />
        <AdminStatCard label="Inquiries" value={inquiriesCount} />
      </section>
    </AdminShell>
  );
}
