/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@todo/services"],
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  eslint: {
    dirs: ['src'],
  },
  output: 'standalone',
};

module.exports = nextConfig;
