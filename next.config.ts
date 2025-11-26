import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
  // kalau pakai image optimization di cloud, uncomment ini:
  // images: {
  //   unoptimized: true,
  // },
};

export default nextConfig;
