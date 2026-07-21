import { profile } from "./profile";
export const socialLinks = [
  { label: "GitHub", href: "https://github.com/KR-42" },
  { label: "LinkedIn", href: "https://linkedin.com/in/raflyathallah" },
  { label: "Email", href: `mailto:${profile.email}` },
] as const;
