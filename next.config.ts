import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  output: 'standalone',
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.*.*'],
};

export default nextConfig;
