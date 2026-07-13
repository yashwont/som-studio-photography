import { prisma } from "@/src/lib/prisma";

export function getAdminServices() {
  return prisma.service.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    select: {
      id: true,
      title: true,
      featured: true,
      active: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
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
      description: true,
      imageUrl: true,
      price: true,
      inclusions: true,
      category: true,
      featured: true,
      active: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
