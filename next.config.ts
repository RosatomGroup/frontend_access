/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  transpilePackages: ['antd'],
  trailingSlash: true,
  assetPrefix: '/',
  images: {
    unoptimized: true,
  },

};

module.exports = nextConfig;
