import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Cấp phép cho ảnh mẫu Unsplash
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nowtrip.vn', // Cấp phép sẵn cho ảnh từ website cũ của bạn
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
