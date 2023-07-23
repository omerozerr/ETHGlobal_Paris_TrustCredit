/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ipfs.io'], // your IPFS HTTP gateway domain
  },
    webpack: config => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
      },
}

module.exports = nextConfig
