import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: allow testing from 127.0.0.1 or a phone on the local network
  allowedDevOrigins: ["127.0.0.1", "192.168.*.*", "10.*.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
