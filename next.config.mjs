const nextConfig = {
  images: {
    domains: ['firouzehjavaherian.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'firouzehjavaherian.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
