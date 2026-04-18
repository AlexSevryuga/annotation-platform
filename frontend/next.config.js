/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    outputFileTracingRoot: '/Users/aleksej/annotation-platform/frontend',
  },
  output: 'standalone',
};

module.exports = nextConfig;