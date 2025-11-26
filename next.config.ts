import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // kalau pakai image optimization di cloud, uncomment ini:
  // images: {
  //   unoptimized: true,
  // },
};

export default nextConfig;
