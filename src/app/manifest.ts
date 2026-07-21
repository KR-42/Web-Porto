import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
export default function manifest(): MetadataRoute.Manifest { return { name: profile.siteName, short_name: profile.siteName, description: profile.summary, start_url: "/", display: "standalone", background_color: "#07101d", theme_color: "#07101d", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }] }; }
