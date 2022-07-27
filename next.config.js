/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['uploads.mangadex.org'],
  },
  experimental: {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'uploads.mangadex.org',
          pathname: '/covers/**/**'
        }
      ]
    }
  }
}

module.exports = nextConfig
