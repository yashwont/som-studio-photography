"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import {
  makeRoomForServiceDisplayOrder,
} from "@/src/lib/db/admin-services";
import { uploadServiceImage } from "@/src/lib/storage/cloudinary";
import type { PortfolioCoverBlockState } from "./types";

function revalidatePortfolioCoverPaths(serviceId?: string) {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/portfolio");
  revalidatePath("/admin/services");
  revalidatePath("/admin/portfolio");
  revalidatePath("/admin/portfolio/cover");

  if (serviceId) {
    revalidatePath(`/admin/services/${serviceId}`);
    revalidatePath(`/admin/services/${serviceId}/edit`);
  }
}

function parseCoverBlockFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const displayOrderRaw = String(formData.get("displayOrder") ?? "").trim();
  const active = formData.get("active") === "on";

  if (!title) {
    return { ok: false, error: "Title is required." } as const;
  }

  if (!description) {
    return { ok: false, error: "Description is required." } as const;
  }

  const displayOrderInput = Number.parseInt(displayOrderRaw, 10);

  if (Number.isNaN(displayOrderInput) || displayOrderInput < 1) {
    return {
      ok: false,
      error: "Display order must be 1 or greater.",
    } as const;
  }

  return {
    ok: true,
    title,
    description,
    displayOrder: displayOrderInput - 1,
    active,
  } as const;
}

function parseCreateCoverBlockFields(formData: FormData) {
  const serviceId = String(formData.get("serviceId") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const displayOrderRaw = String(formData.get("displayOrder") ?? "").trim();
  const active = formData.get("active") === "on";

  if (!serviceId) {
    return { ok: false, error: "Choose a service." } as const;
  }

  if (!description) {
    return { ok: false, error: "Description is required." } as const;
  }

  const displayOrderInput = Number.parseInt(displayOrderRaw, 10);

  if (Number.isNaN(displayOrderInput) || displayOrderInput < 1) {
    return {
      ok: false,
      error: "Display order must be 1 or greater.",
    } as const;
  }

  return {
    ok: true,
    serviceId,
    description,
    displayOrder: displayOrderInput - 1,
    active,
  } as const;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uniqueSlugForTitle(title: string, excludeServiceId?: string) {
  const baseSlug = slugify(title);

  if (!baseSlug) {
    return null;
  }

  let slug = baseSlug;
  let suffix = 2;

  while (
    await prisma.service.findFirst({
      where: {
        slug,
        ...(excludeServiceId ? { NOT: { id: excludeServiceId } } : {}),
      },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function createPortfolioCoverBlock(
  _previousState: PortfolioCoverBlockState,
  formData: FormData
): Promise<PortfolioCoverBlockState> {
  await requireAdmin();

  const parsed = parseCreateCoverBlockFields(formData);

  if (!parsed.ok) {
    return { error: parsed.error, success: null };
  }

  const existingService = await prisma.service.findUnique({
    where: { id: parsed.serviceId },
    select: { id: true, imageUrls: true, displayOrder: true },
  });

  if (!existingService) {
    return { error: "Service not found.", success: null };
  }

  let imageUrls = existingService.imageUrls;
  const file = formData.get("coverImage");

  if (file instanceof File && file.size > 0) {
    const uploadResult = await uploadServiceImage(file);

    if (!uploadResult.ok) {
      return { error: uploadResult.error, success: null };
    }

    imageUrls = [uploadResult.url, ...existingService.imageUrls.slice(1)];
  }

  await prisma.$transaction(async (tx) => {
    if (parsed.displayOrder !== existingService.displayOrder) {
      await makeRoomForServiceDisplayOrder(
        tx,
        parsed.displayOrder,
        existingService.id
      );
    }

    await tx.service.update({
      where: { id: existingService.id },
      data: {
        description: parsed.description,
        imageUrls,
        active: parsed.active,
        displayOrder: parsed.displayOrder,
      },
    });
  });

  revalidatePortfolioCoverPaths(existingService.id);

  return { error: null, success: "Cover block created." };
}

export async function updatePortfolioCoverBlock(
  serviceId: string,
  _previousState: PortfolioCoverBlockState,
  formData: FormData
): Promise<PortfolioCoverBlockState> {
  await requireAdmin();

  const parsed = parseCoverBlockFields(formData);

  if (!parsed.ok) {
    return { error: parsed.error, success: null };
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { imageUrls: true, displayOrder: true },
  });

  if (!service) {
    return { error: "Cover block not found.", success: null };
  }

  const slug = await uniqueSlugForTitle(parsed.title, serviceId);

  if (!slug) {
    return {
      error: "Title must contain at least one letter or number.",
      success: null,
    };
  }

  let imageUrls = service.imageUrls;
  const file = formData.get("coverImage");

  if (file instanceof File && file.size > 0) {
    const uploadResult = await uploadServiceImage(file);

    if (!uploadResult.ok) {
      return { error: uploadResult.error, success: null };
    }

    imageUrls = [uploadResult.url, ...service.imageUrls.slice(1)];
  }

  await prisma.$transaction(async (tx) => {
    if (parsed.displayOrder !== service.displayOrder) {
      await makeRoomForServiceDisplayOrder(tx, parsed.displayOrder, serviceId);
    }

    await tx.service.update({
      where: { id: serviceId },
      data: {
        title: parsed.title,
        slug,
        description: parsed.description,
        imageUrls,
        active: parsed.active,
        displayOrder: parsed.displayOrder,
      },
    });
  });

  revalidatePortfolioCoverPaths(serviceId);

  return { error: null, success: "Cover block saved." };
}

export async function deletePortfolioCoverBlock(serviceId: string) {
  await requireAdmin();

  await prisma.$transaction(async (tx) => {
    const service = await tx.service.findUnique({
      where: { id: serviceId },
      select: { displayOrder: true },
    });

    if (!service) {
      return;
    }

    await tx.service.delete({ where: { id: serviceId } });

    await tx.service.updateMany({
      where: { displayOrder: { gt: service.displayOrder } },
      data: { displayOrder: { decrement: 1 } },
    });
  });

  revalidatePortfolioCoverPaths();
}
