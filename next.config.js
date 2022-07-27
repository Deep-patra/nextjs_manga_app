/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['uploads.mangadex.org'],
  },
  rewrites: [
    {
      source: '/api/cover/:path*',
      destination: 'https://api.mangadex.org/cover/:path*'
    }
  ],
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
