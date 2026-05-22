import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode for development
  reactStrictMode: true,

  // Optimize images
  images: {
    unoptimized: false,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: "Mystery Message",
  },
};

export default nextConfig;
