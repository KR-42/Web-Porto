import type { NextConfig } from "next";
const nextConfig: NextConfig = { reactStrictMode: true, async headers() { return [{ source: "/documents/Rafly-Athallah-CV-2026-v2.pdf", headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }, { key: "Content-Disposition", value: "attachment; filename=\"Rafly-Athallah-CV-2026.pdf\"" }] }]; } };
export default nextConfig;
