import { prisma } from "@/src/lib/prisma";

export async function getAdminDashboardStats() {
  const [
    totalInquiries,
    newInquiries,
    contactedInquiries,
    bookedInquiries,
    closedInquiries,
    servicesCount,
    recentInquiries,
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.count({ where: { status: "CONTACTED" } }),
    prisma.inquiry.count({ where: { status: "BOOKED" } }),
    prisma.inquiry.count({ where: { status: "CLOSED" } }),
    prisma.service.count(),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        serviceType: true,
        service: {
          select: { title: true },
        },
        package: {
          select: { name: true },
        },
      },
    }),
  ]);

  return {
    totalInquiries,
    newInquiries,
    contactedInquiries,
    bookedInquiries,
    closedInquiries,
    servicesCount,
    recentInquiries,
  };
}

export type AdminDashboardRecentInquiry = Awaited<
  ReturnType<typeof getAdminDashboardStats>
>["recentInquiries"][number];
