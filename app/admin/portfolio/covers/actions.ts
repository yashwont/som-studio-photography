"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import { uploadServiceImage } from "@/src/lib/storage/cloudinary";
import type { PortfolioCoverState } from "./types";

function revalidatePortfolioCoverPaths(serviceId: string) {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/admin/services");
  revalidatePath(`/admin/services/${serviceId}`);
  revalidatePath(`/admin/services/${serviceId}/edit`);
  revalidatePath("/admin/portfolio");
  revalidatePath("/admin/portfolio/covers");
}

export async function updatePortfolioCover(
  serviceId: string,
  _previousState: PortfolioCoverState,
  formData: FormData
): Promise<PortfolioCoverState> {
  await requireAdmin();

  const file = formData.get("coverImage");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a cover image first.", success: null };
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { imageUrls: true },
  });

  if (!service) {
    return { error: "Service not found.", success: null };
  }

  const uploadResult = await uploadServiceImage(file);

  if (!uploadResult.ok) {
    return { error: uploadResult.error, success: null };
  }

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      imageUrls: [uploadResult.url, ...service.imageUrls.slice(1)],
    },
  });

  revalidatePortfolioCoverPaths(serviceId);

  return { error: null, success: "Cover image saved." };
}

export async function deletePortfolioCover(
  serviceId: string,
  _previousState: PortfolioCoverState
): Promise<PortfolioCoverState> {
  void _previousState;

  await requireAdmin();

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { imageUrls: true },
  });

  if (!service) {
    return { error: "Service not found.", success: null };
  }

  await prisma.service.update({
    where: { id: serviceId },
    data: {
      imageUrls: service.imageUrls.slice(1),
    },
  });

  revalidatePortfolioCoverPaths(serviceId);

  return { error: null, success: "Cover image removed." };
}
