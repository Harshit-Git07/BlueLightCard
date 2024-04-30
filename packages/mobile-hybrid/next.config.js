/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    swcPlugins: [['@swc-jotai/react-refresh', {}]],
  },
};

module.exports = nextConfig;
