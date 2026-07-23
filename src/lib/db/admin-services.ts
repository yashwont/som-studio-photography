import type { Prisma } from "@prisma/client";
import { prisma } from "@/src/lib/prisma";

export function getAdminServices() {
  return prisma.service.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    select: {
      id: true,
      title: true,
      imageUrls: true,
      featured: true,
      active: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export function getAdminPortfolioServices() {
  return prisma.service.findMany({
    orderBy: {
      displayOrder: "asc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrls: true,
      featured: true,
      active: true,
      displayOrder: true,
      updatedAt: true,
    },
  });
}

/**
 * If another service already occupies `targetOrder`, shifts it (and every
 * other service from that point on) up by one so `targetOrder` is free -
 * like inserting a row into a numbered list instead of creating a duplicate.
 * No-op when `targetOrder` is already unique. Must run inside the same
 * transaction as the create/update that will claim `targetOrder`.
 */
export async function makeRoomForServiceDisplayOrder(
  tx: Prisma.TransactionClient,
  targetOrder: number,
  excludeServiceId?: string
) {
  const conflict = await tx.service.findFirst({
    where: {
      displayOrder: targetOrder,
      ...(excludeServiceId ? { NOT: { id: excludeServiceId } } : {}),
    },
    select: { id: true },
  });

  if (!conflict) {
    return;
  }

  await tx.service.updateMany({
    where: {
      displayOrder: { gte: targetOrder },
      ...(excludeServiceId ? { NOT: { id: excludeServiceId } } : {}),
    },
    data: { displayOrder: { increment: 1 } },
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
      galleryIntro: true,
      galleryClosing: true,
      imageUrls: true,
      price: true,
      inclusions: true,
      featured: true,
      active: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
