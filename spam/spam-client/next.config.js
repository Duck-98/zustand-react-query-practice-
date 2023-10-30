/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: 'https://auth.mailplug.com/:path*',
      },
      {
        source: '/login/:path*',
        destination: 'https://testm01.mail-server.kr:path*',
      },
    ];
  },
};

module.exports = nextConfig;
