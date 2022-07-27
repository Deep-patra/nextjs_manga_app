/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['uploads.mangadex.org'],
  },
<<<<<<< HEAD
  rewrites: [
    {
      source: '/api/cover/:path*',
      destination: 'https://api.mangadex.org/cover/:path*'
    }
  ],
=======
>>>>>>> 30d751c1f1d194aec065be2d32b36718e7ac33af
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
