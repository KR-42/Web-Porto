import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./video.css";
import { ThemeProvider } from "@/components/theme-provider";
import { profile } from "@/data/profile";
const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const title = `${profile.siteName} | Network Security & Technology Projects`;
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://raflyathallah.vercel.app"),
  title: { default: title, template: `%s | ${profile.siteName}` }, description: `${profile.name} — ${profile.positioning}`,
  applicationName: profile.siteName, alternates: { canonical: "/" }, manifest: "/manifest.webmanifest",
  openGraph: { title, siteName: profile.siteName, description: profile.summary, type: "website", images: ["/opengraph-image"] },
  twitter: { card: "summary_large_image", title, description: profile.summary, images: ["/opengraph-image"] }, icons: { icon: "/icon.svg" },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" data-theme="dark" suppressHydrationWarning><body className={`${sans.variable} ${mono.variable}`}><ThemeProvider>{children}</ThemeProvider></body></html>; }
