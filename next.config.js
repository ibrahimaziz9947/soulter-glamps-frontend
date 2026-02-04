/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Exclude VS Code history and large files from Next.js processing
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/.history/**', '**/*.log', '**/node_modules/**'],
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://web-production-9eb74.up.railway.app/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
