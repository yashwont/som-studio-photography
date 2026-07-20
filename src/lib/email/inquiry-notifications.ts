import { absoluteUrl } from "@/src/lib/seo";
import { sendEmail, type SendEmailResult } from "./resend";

const ADMIN_INQUIRY_EMAIL = "somphotographystudio@gmail.com";

export type InquiryNotificationData = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  serviceLabel: string | null;
  preferredDate: Date | null;
  message: string;
};

function formatEventDate(date: Date | null) {
  if (!date) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toHtml(lines: string[]) {
  return `<div>${lines
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("")}</div>`;
}

export async function sendInquiryAdminNotification(
  inquiry: InquiryNotificationData
): Promise<SendEmailResult> {
  const notifyEmail = process.env.INQUIRY_NOTIFY_EMAIL || ADMIN_INQUIRY_EMAIL;

  const adminUrl = absoluteUrl(`/admin/inquiries/${inquiry.id}`);
  const eventDate = formatEventDate(inquiry.preferredDate);

  const lines = [
    `Name: ${inquiry.name}`,
    `Phone: ${inquiry.phone}`,
    inquiry.email ? `Email: ${inquiry.email}` : null,
    inquiry.serviceLabel ? `Service: ${inquiry.serviceLabel}` : null,
    eventDate ? `Preferred date: ${eventDate}` : null,
    `Message: ${inquiry.message}`,
    `View in admin: ${adminUrl}`,
  ].filter((line): line is string => line !== null);

  return sendEmail({
    to: notifyEmail,
    subject: `New inquiry from ${inquiry.name}`,
    text: lines.join("\n"),
    html: toHtml(lines),
  });
}

export async function sendInquiryAutoReply(
  inquiry: InquiryNotificationData
): Promise<SendEmailResult> {
  if (!inquiry.email) {
    return { ok: false, error: "No client email provided." };
  }

  const lines = [
    `Hi ${inquiry.name},`,
    "Thanks for reaching out to SomStudioPhotography. We've received your inquiry and will get back to you shortly.",
    "- SomStudioPhotography",
  ];

  return sendEmail({
    to: inquiry.email,
    subject: "We received your inquiry - SomStudioPhotography",
    text: lines.join("\n\n"),
    html: toHtml(lines),
  });
}
