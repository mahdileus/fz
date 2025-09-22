/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firouzehjavaherian.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.firouzehjavaherian.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },

};

export default nextConfig;
