import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  // Add empty turbopack config to silence the warning
  turbopack: {},
  // Increase serverless function payload size for PDF generation
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  // Ensure PDF libraries are not bundled incorrectly
  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;
