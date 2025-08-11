const nextConfig = {
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'firouzehjavaherian.com',
      pathname: '/uploads/**',
    },
  ],
},
}

export default nextConfig;