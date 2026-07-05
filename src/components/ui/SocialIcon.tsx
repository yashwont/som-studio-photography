interface SocialIconProps {
  platform: string;
  className?: string;
}

export default function SocialIcon({ platform, className = "h-5 w-5" }: SocialIconProps) {
  switch (platform) {
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
    default:
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
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
