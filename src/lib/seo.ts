import { contactInfo } from "@/src/data/contact";
import { services } from "@/src/data/services";
import { heroImage } from "@/src/data/visuals";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://somstudiophotography.com.np";

export const siteName = "SomStudioPhotography";

export const defaultDescription =
  "Professional photography studio in Basundhara, Kathmandu for newborn, kids, maternity, family, graduation, portrait, wedding, pre-wedding, event, and product photography.";

export const defaultOgImage = {
  url: heroImage.src,
  width: 1600,
  height: 1067,
  alt: heroImage.alt,
};

export const siteRoutes = [
  { path: "/", priority: 1 },
  { path: "/about", priority: 0.8 },
  { path: "/services", priority: 0.9 },
  { path: "/portfolio", priority: 0.9 },
  { path: "/testimonials", priority: 0.7 },
  { path: "/contact", priority: 0.9 },
];

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#localbusiness`,
    name: siteName,
    url: siteUrl,
    image: heroImage.src,
    description: defaultDescription,
    telephone: contactInfo.phone,
    email: contactInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contactInfo.address,
      addressLocality: contactInfo.city,
      addressCountry: contactInfo.country,
    },
    areaServed: [
      { "@type": "City", name: "Kathmandu" },
      { "@type": "City", name: "Lalitpur" },
      { "@type": "City", name: "Bhaktapur" },
    ],
    sameAs: contactInfo.socialLinks.map((link) => link.href),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Photography services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
      })),
    },
  };
}
