/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['framer-motion'],
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;