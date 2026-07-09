"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/auth/admin";
import { prisma } from "@/src/lib/prisma";
import type { InquiryStatus } from "@prisma/client";
import type { UpdateInquiryState } from "./types";

const VALID_STATUSES: InquiryStatus[] = [
  "NEW",
  "CONTACTED",
  "BOOKED",
  "CLOSED",
];

export async function updateInquiry(
  inquiryId: string,
  _previousState: UpdateInquiryState,
  formData: FormData
): Promise<UpdateInquiryState> {
  await requireAdmin();

  const status = String(formData.get("status") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!VALID_STATUSES.includes(status as InquiryStatus)) {
    return { error: "Invalid status." };
  }

  await prisma.inquiry.update({
    where: { id: inquiryId },
    data: {
      status: status as InquiryStatus,
      notes: notes || null,
    },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);
  revalidatePath("/admin");

  return { error: null };
}
