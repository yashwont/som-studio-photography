interface SocialIconProps {
  platform: string;
  className?: string;
}

// Alternate spellings/abbreviations admins might type into the "Platform" field,
// mapped to the canonical key handled below.
const PLATFORM_ALIASES: Record<string, string> = {
  x: "twitter",
  ig: "instagram",
  fb: "facebook",
  wa: "whatsapp",
  yt: "youtube",
  web: "website",
  site: "website",
  link: "website",
};

function GenericLinkIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M8.5 15.5a3.5 3.5 0 0 1 0-5l2-2a3.5 3.5 0 0 1 5 5l-1 1" />
      <path d="M15.5 8.5a3.5 3.5 0 0 1 0 5l-2 2a3.5 3.5 0 0 1-5-5l1-1" />
    </svg>
  );
}

export default function SocialIcon({ platform, className = "h-5 w-5" }: SocialIconProps) {
  const key = platform.trim().toLowerCase();
  const normalized = PLATFORM_ALIASES[key] ?? key;

  switch (normalized) {
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M13.5 21v-8.2h2.75l.41-3.19h-3.16V7.55c0-.92.26-1.55 1.58-1.55h1.68V3.14C15.94 3.06 15.03 3 13.95 3 11.32 3 9.5 4.6 9.5 7.28v2.33H6.75v3.19H9.5V21h4z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M16.5 3c.31 2.14 1.66 3.63 3.7 3.9v2.62c-1.32.11-2.62-.29-3.7-1v6.4c0 3.19-2.58 5.62-5.66 5.44-2.83-.17-5.04-2.5-5.04-5.44 0-3 2.5-5.44 5.5-5.44.3 0 .6.02.9.07v2.72a2.72 2.72 0 1 0 1.9 2.6V3h2.4z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3.2 8.75h3.5V21H3.2V8.75zM9.75 8.75h3.36v1.68h.05c.47-.89 1.6-1.83 3.31-1.83 3.54 0 4.19 2.33 4.19 5.36V21h-3.5v-6.35c0-1.51-.03-3.46-2.11-3.46-2.11 0-2.44 1.65-2.44 3.35V21h-3.5V8.75z" />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M18.9 3h3.1l-6.79 7.77L23 21h-6.56l-5.14-6.72L5.4 21H2.28l7.26-8.3L2 3h6.72l4.64 5.82L18.9 3zm-1.2 16.1h1.72L7.4 4.8H5.56l12.14 14.3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M22.5 7.2a3 3 0 0 0-2.1-2.1C18.6 4.7 12 4.7 12 4.7s-6.6 0-8.4.4a3 3 0 0 0-2.1 2.1A31 31 0 0 0 1 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.8.4 8.4.4 8.4.4s6.6 0 8.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23 12a31 31 0 0 0-.5-4.8zM9.8 15.3V8.7l6 3.3-6 3.3z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.17-2.01.04-2.88.19-.79 1.23-5.02 1.23-5.02s-.31-.63-.31-1.55c0-1.45.84-2.53 1.89-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.89 1.55 1.89 1.86 0 3.29-1.96 3.29-4.79 0-2.5-1.8-4.26-4.36-4.26-2.97 0-4.71 2.23-4.71 4.53 0 .9.34 1.86.78 2.38.09.1.1.19.07.3l-.28 1.14c-.04.19-.15.23-.34.14-1.26-.59-2.05-2.42-2.05-3.9 0-3.18 2.31-6.1 6.66-6.1 3.5 0 6.22 2.49 6.22 5.83 0 3.48-2.19 6.28-5.24 6.28-1.02 0-1.99-.53-2.32-1.16l-.63 2.4c-.23.87-.85 1.97-1.26 2.63.95.29 1.95.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zm0 18.09a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 1 1 7 3.86zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.65.81-.79.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.38-1.73-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.16-.48-.28z" />
        </svg>
      );
    case "telegram":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M21.9 4.6 18.7 20c-.24 1.06-.87 1.32-1.76.82l-4.86-3.58-2.35 2.26c-.26.26-.48.48-.98.48l.35-4.98 9.06-8.19c.39-.35-.09-.55-.61-.2L7.3 13.03l-4.9-1.53c-1.06-.33-1.08-1.06.22-1.57L20.6 3.4c.89-.32 1.66.21 1.3 1.2z" />
        </svg>
      );
    case "email":
    case "mail":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "website":
      return <GenericLinkIcon className={className} />;
    default:
      return <GenericLinkIcon className={className} />;
  }
}
