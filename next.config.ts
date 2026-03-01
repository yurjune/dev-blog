import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // 개발 중에는 주석 처리
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
