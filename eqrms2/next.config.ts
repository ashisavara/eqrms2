import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ This skips ESLint during Vercel builds
  },
  /* you can keep other config options below this */
};

export default nextConfig;
