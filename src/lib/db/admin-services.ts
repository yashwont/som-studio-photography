import { prisma } from "@/src/lib/prisma";

export function getAdminServices() {
  return prisma.service.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      featured: true,
      active: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { packages: true },
      },
    },
  });
}
