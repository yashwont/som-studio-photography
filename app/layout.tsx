import type { Metadata } from "next";
import {
  absoluteUrl,
  defaultDescription,
  defaultOgImage,
  localBusinessJsonLd,
  siteName,
  siteUrl,
} from "@/src/lib/seo";
import { getContactInfo } from "@/src/lib/db/contact";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Photography Studio in Kathmandu`,
    template: `%s - ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName,
    title: `${siteName} - Photography Studio in Kathmandu`,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - Photography Studio in Kathmandu`,
    description: defaultDescription,
    images: [defaultOgImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const contactInfo = await getContactInfo();
  const jsonLd = localBusinessJsonLd(contactInfo);

  return (
    <html
      lang="en"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
