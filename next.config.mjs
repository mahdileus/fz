const nextConfig = {
  images: {
    domains: ['firouzehjavaherian.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firouzehjavaherian.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
