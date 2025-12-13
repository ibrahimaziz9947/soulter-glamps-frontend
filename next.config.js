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
}

module.exports = nextConfig
