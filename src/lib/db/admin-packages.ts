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

export function getAdminPackageById(id: string) {
  return prisma.package.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      inclusions: true,
      active: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
      service: {
        select: {
          id: true,
          title: true,
          slug: true,
          active: true,
        },
      },
    },
  });
}
