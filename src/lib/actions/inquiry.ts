"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/src/lib/prisma";
import {
  sendInquiryAdminNotification,
  sendInquiryAutoReply,
} from "@/src/lib/email/inquiry-notifications";

export type SubmitInquiryResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitInquiry(
  formData: FormData
): Promise<SubmitInquiryResult> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const serviceValue = String(formData.get("service") ?? "").trim();
  const dateRaw = String(formData.get("date") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name) {
    return { ok: false, error: "Name is required." };
  }

  if (!phone) {
    return { ok: false, error: "Phone number is required." };
  }

  if (!message) {
    return { ok: false, error: "Message is required." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  let preferredDate: Date | null = null;

  if (dateRaw) {
    const parsedDate = new Date(dateRaw);

    if (!Number.isNaN(parsedDate.getTime())) {
      preferredDate = parsedDate;
    }
  }

  let serviceId: string | null = null;
  let serviceType: string | null = null;

  if (serviceValue) {
    const service = await prisma.service.findUnique({
      where: { id: serviceValue },
      select: { id: true, title: true },
    });

    if (service) {
      serviceId = service.id;
      serviceType = service.title;
    } else {
      serviceType = serviceValue;
    }
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name,
      phone,
      email: email || null,
      serviceType,
      serviceId,
      preferredDate,
      message,
    },
    select: { id: true },
  });

  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");

  const notificationData = {
    id: inquiry.id,
    name,
    phone,
    email: email || null,
    serviceLabel: serviceType,
    preferredDate,
    message,
  };

  await Promise.allSettled([
    sendInquiryAdminNotification(notificationData),
    sendInquiryAutoReply(notificationData),
  ]);

  return { ok: true };
}
