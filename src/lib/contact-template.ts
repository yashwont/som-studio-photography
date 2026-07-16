import type { ContactInfo } from "@/src/types/site";

/** Substitutes {phone}/{whatsapp}/{email}/{city}/{country} tokens in
 * admin-authored text so content stays in sync when contact details change. */
export function renderContactTemplate(template: string, contact: ContactInfo): string {
  return template
    .replaceAll("{phone}", contact.phone)
    .replaceAll("{whatsapp}", contact.whatsapp)
    .replaceAll("{email}", contact.email)
    .replaceAll("{city}", contact.city)
    .replaceAll("{country}", contact.country);
}
