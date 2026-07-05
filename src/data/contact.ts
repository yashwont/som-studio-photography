import type { ContactInfo } from "@/src/types/site";

export const contactInfo: ContactInfo = {
  phone: "+977-9800000000",
  whatsapp: "+9779800000000",
  email: "hello@somstudiophotography.com.np",
  address: "Lazimpat, Ward 2",
  city: "Kathmandu",
  country: "Nepal",
  socialLinks: [
    {
      platform: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/somstudio_ktm?igsh=cjlrdmEybzdkN3pj",
    },
    {
      platform: "facebook",
      label: "Facebook",
      href: "https://www.facebook.com/somphotography0",
    },
    {
      platform: "tiktok",
      label: "TikTok",
      href: "https://tiktok.com/@somstudiophotography",
    },
  ],
  businessHours: [
    { days: "Sunday - Friday", hours: "9:00 AM - 6:00 PM" },
    { days: "Saturday", hours: "10:00 AM - 4:00 PM" },
  ],
};
