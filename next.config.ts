import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Static export (deployed on Vercel as static files)
  output: "export",
  images: { unoptimized: true },
  // Dev only: allow testing from 127.0.0.1 or a phone on the local network
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*", "10.*.*.*"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
