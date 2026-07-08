import { prisma } from "@/src/lib/prisma";

export function getAdminPackages() {
  return prisma.package.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      active: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
      service: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });
}
