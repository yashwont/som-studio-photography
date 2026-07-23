export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  highlights: string[];
  slug: string;
  featured: boolean;
}

export interface SiteImage {
  src: string;
  alt: string;
  credit?: string;
}

export interface SocialLink {
  platform: string;
  label: string;
  href: string;
}

export interface BusinessHours {
  days: string;
  hours: string;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  mapUrl: string;
  mapEmbedUrl: string;
  socialLinks: SocialLink[];
  businessHours: BusinessHours[];
  footerDescription: string;
  afterInquirySteps: [string, string, string];
}
