import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // for static deployment
  images: {
    unoptimized: true,
  },
  trailingSlash: false,
};

export default nextConfig;
