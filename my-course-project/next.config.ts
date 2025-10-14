import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // Allow all HTTP hostnames
      },
      {
        protocol: "https",
        hostname: "**", // Allow all HTTPS hostnames
      },
    ],
  },
};

export default nextConfig;
