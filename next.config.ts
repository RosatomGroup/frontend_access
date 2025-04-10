/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd'],
  trailingSlash: true,
  output: 'export',
  assetPrefix: '/',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
