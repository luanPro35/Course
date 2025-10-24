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
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.json$/,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
