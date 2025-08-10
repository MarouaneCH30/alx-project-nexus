import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.guim.co.uk" },
      { protocol: "https", hostname: "i.guim.co.uk" }, // Guardian sometimes uses this CDN
    ],
  },
};

export default nextConfig;
