import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  // Cache the static export so the app shell and assets work offline.
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // Disable the service worker in development to avoid stale caches.
  disable: process.env.NODE_ENV === "development" || process.env.DISABLE_PWA === "1",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // Fully static, installable PWA that runs offline without a Node server.
  output: "export",
  images: {
    // Static export cannot use the Next image optimization server.
    unoptimized: true,
  },
  reactStrictMode: true,
  // The webpack filesystem cache fails to snapshot deps on some Node 23 setups,
  // which can stall static generation. Disable it for a reliable build.
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default withPWA(nextConfig);
