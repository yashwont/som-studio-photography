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

export function getAdminServiceById(id: string) {
  return prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      fullDescription: true,
      highlights: true,
      category: true,
      featured: true,
      active: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
      packages: {
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          inclusions: true,
          active: true,
          displayOrder: true,
        },
      },
    },
  });
}
