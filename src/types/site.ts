// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

// ─── Services ────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  slug: string;
  featured: boolean;
}

// ─── Portfolio ───────────────────────────────────────────────────────────────

export interface PortfolioCategory {
  id: string;
  title: string;
  description: string;
  slug: string;
}

// ─── Booking Process ─────────────────────────────────────────────────────────

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  service: string;
  location: string;
}

// ─── Contact ─────────────────────────────────────────────────────────────────

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
  socialLinks: SocialLink[];
  businessHours: BusinessHours[];
}
