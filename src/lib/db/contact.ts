import { cache } from "react";
import { contactInfo as defaultContactInfo } from "@/src/data/contact";
import type { BusinessHours, ContactInfo, SocialLink } from "@/src/types/site";
import { getSiteSetting, setSiteSetting } from "@/src/lib/db/site-settings";

export const CONTACT_INFO_KEY = "contact.info";

function parseSocialLinks(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) {
    return defaultContactInfo.socialLinks;
  }

  const links = value
    .filter(
      (item): item is { platform: unknown; label: unknown; href: unknown } =>
        typeof item === "object" && item !== null
    )
    .map((item) => ({
      platform: String((item as { platform?: unknown }).platform ?? ""),
      label: String((item as { label?: unknown }).label ?? ""),
      href: String((item as { href?: unknown }).href ?? ""),
    }))
    .filter((item) => item.platform && item.label && item.href);

  return links.length > 0 ? links : defaultContactInfo.socialLinks;
}

function parseBusinessHours(value: unknown): BusinessHours[] {
  if (!Array.isArray(value)) {
    return defaultContactInfo.businessHours;
  }

  const hours = value
    .filter(
      (item): item is { days: unknown; hours: unknown } =>
        typeof item === "object" && item !== null
    )
    .map((item) => ({
      days: String((item as { days?: unknown }).days ?? ""),
      hours: String((item as { hours?: unknown }).hours ?? ""),
    }))
    .filter((item) => item.days || item.hours);

  return hours.length > 0 ? hours : defaultContactInfo.businessHours;
}

function parseFooterDescription(value: unknown): string {
  return typeof value === "string" && value.trim()
    ? value
    : defaultContactInfo.footerDescription;
}

function parseAfterInquirySteps(value: unknown): [string, string, string] {
  if (!Array.isArray(value) || value.length !== 3) {
    return defaultContactInfo.afterInquirySteps;
  }

  const steps = value.map((item) => (typeof item === "string" ? item.trim() : ""));

  return steps.every((step) => step)
    ? (steps as [string, string, string])
    : defaultContactInfo.afterInquirySteps;
}

/** Reads contact.info from SiteSetting, falling back to src/data/contact.ts's
 * static default if the row is missing or malformed. Wrapped in cache() so the
 * many pages/layout that each need this only hit the database once per request. */
export const getContactInfo = cache(async (): Promise<ContactInfo> => {
  const setting = await getSiteSetting(CONTACT_INFO_KEY);

  if (!setting) {
    return defaultContactInfo;
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(setting.value);
  } catch {
    return defaultContactInfo;
  }

  if (!parsed || typeof parsed !== "object") {
    return defaultContactInfo;
  }

  const candidate = parsed as Record<string, unknown>;

  const isValidShape =
    typeof candidate.phone === "string" &&
    typeof candidate.whatsapp === "string" &&
    typeof candidate.email === "string" &&
    typeof candidate.address === "string" &&
    typeof candidate.city === "string" &&
    typeof candidate.country === "string" &&
    typeof candidate.mapUrl === "string" &&
    typeof candidate.mapEmbedUrl === "string";

  if (!isValidShape) {
    return defaultContactInfo;
  }

  return {
    phone: candidate.phone as string,
    whatsapp: candidate.whatsapp as string,
    email: candidate.email as string,
    address: candidate.address as string,
    city: candidate.city as string,
    country: candidate.country as string,
    mapUrl: candidate.mapUrl as string,
    mapEmbedUrl: candidate.mapEmbedUrl as string,
    socialLinks: parseSocialLinks(candidate.socialLinks),
    businessHours: parseBusinessHours(candidate.businessHours),
    footerDescription: parseFooterDescription(candidate.footerDescription),
    afterInquirySteps: parseAfterInquirySteps(candidate.afterInquirySteps),
  };
});

/** Saves a partial update to contact.info, merging it onto whatever is
 * currently stored so that a section-specific settings page (e.g. just the
 * Map fields) never clobbers fields owned by another section. */
export async function saveContactInfo(partial: Partial<ContactInfo>): Promise<void> {
  const current = await getContactInfo();
  const next: ContactInfo = { ...current, ...partial };

  await setSiteSetting(CONTACT_INFO_KEY, JSON.stringify(next));
}
