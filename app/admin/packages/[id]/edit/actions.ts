"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import type { EditPackageState } from "./types";

export async function updatePackage(
  packageId: string,
  _previousState: EditPackageState,
  formData: FormData
): Promise<EditPackageState> {
  await requireAdmin();

  const serviceId = String(formData.get("serviceId") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const inclusionsRaw = String(formData.get("inclusions") ?? "");
  const displayOrderRaw = String(formData.get("displayOrder") ?? "");
  const active = formData.get("active") === "on";

  if (!serviceId) {
    return { error: "Service is required." };
  }

  if (!name) {
    return { error: "Package name is required." };
  }

  let price: number | null = null;

  if (priceRaw) {
    const parsedPrice = Number(priceRaw);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      return { error: "Price must be a valid non-negative number." };
    }

    price = parsedPrice;
  }

  const displayOrder = Number.parseInt(displayOrderRaw, 10);

  if (Number.isNaN(displayOrder)) {
    return { error: "Display order must be a number." };
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true },
  });

  if (!service) {
    return { error: "Selected service does not exist." };
  }

  const inclusions = inclusionsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  await prisma.package.update({
    where: { id: packageId },
    data: {
      serviceId,
      name,
      price,
      description: description || null,
      inclusions,
      active,
      displayOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/admin/packages");
  revalidatePath(`/admin/packages/${packageId}`);
  revalidatePath("/admin/services");

  redirect(`/admin/packages/${packageId}`);
}
