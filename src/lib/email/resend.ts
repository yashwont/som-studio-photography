import { Resend } from "resend";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type SendEmailResult = { ok: true } | { ok: false; error: string };

function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.INQUIRY_FROM_EMAIL);
}

export async function sendEmail(
  input: SendEmailInput
): Promise<SendEmailResult> {
  if (!isEmailConfigured()) {
    return { ok: false, error: "Email notifications are not configured." };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.INQUIRY_FROM_EMAIL as string,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });

    if (error) {
      return { ok: false, error: error.message ?? "Failed to send email." };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to send email.",
    };
  }
}
