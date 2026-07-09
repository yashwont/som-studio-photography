import { prisma } from "@/src/lib/prisma";

export function getAdminInquiries() {
  return prisma.inquiry.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      serviceType: true,
      status: true,
      createdAt: true,
      service: {
        select: { id: true, title: true },
      },
      package: {
        select: { id: true, name: true },
      },
    },
  });
}

export function getAdminInquiryById(id: string) {
  return prisma.inquiry.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      serviceType: true,
      preferredDate: true,
      message: true,
      status: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      service: {
        select: { id: true, title: true, slug: true },
      },
      package: {
        select: { id: true, name: true },
      },
    },
  });
}
