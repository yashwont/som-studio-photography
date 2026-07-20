import type { ContactInfo } from "@/src/types/site";

export const contactInfo: ContactInfo = {
  phone: "+9779841255294",
  whatsapp: "+9779841255294",
  email: "somphotographystudio@gmail.com",
  address: "Basundhara Road, Tokha-5",
  city: "Kathmandu",
  country: "Nepal",
  mapUrl:
    "https://www.google.com/maps/place/SOM+PHOTO+STUDIO/@27.7424254,85.3317994,17z/data=!4m15!1m8!3m7!1s0x39eb19370a975f3d:0x46e16a975c9ca45d!2sSOM+PHOTO+STUDIO!8m2!3d27.7424254!4d85.3317994!10e1!16s%2Fg%2F11df7_tgfg!3m5!1s0x39eb19370a975f3d:0x46e16a975c9ca45d!8m2!3d27.7424254!4d85.3317994!16s%2Fg%2F11df7_tgfg?entry=ttu&g_ep=EgoyMDI2MDYyOS4wIKXMDSoASAFQAw%3D%3D",
  mapEmbedUrl:
    "https://www.google.com/maps?q=27.7424254,85.3317994&z=17&output=embed",
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
    { days: "Saturday", hours: "Closed" },
  ],
  footerDescription:
    "A professional photography studio in {city}, {country} with 30 years of experience, specializing in weddings, pre-weddings, portraits, events, maternity, kids, graduation, and product photography. Proudly serving Kathmandu, Lalitpur, and Bhaktapur.",
  afterInquirySteps: [
    "We review your inquiry and check availability for your preferred date.",
    "We reach back via phone or WhatsApp ({whatsapp}) to discuss details and confirm a plan.",
    "Once everything is agreed, your session is confirmed and we prepare for the shoot.",
  ],
};
