// next.config.mjs
import path from 'path'
import { fileURLToPath } from 'url'

/** @type {import('next').NextConfig} */

// Define __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const nextConfig = {
  basePath: process.env.BASEPATH,
  output: 'standalone',
  //output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tallulahstorageuqgmy.blob.core.windows.net',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'tallulahstorageiuvew.blob.core.windows.net',
        port: '',
        pathname: '/**'
      }
    ]
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en/dashboards/',
        permanent: true,
        locale: false
      },
      {
        source: '/:lang(en|fr|ar)',
        destination: '/:lang/dashboards',
        permanent: true,
        locale: false
      },
      {
        source: '/((?!(?:en|fr|ar|front-pages|favicon.ico)\b)):path',
        destination: '/en/:path',
        permanent: true,
        locale: false
      }
    ]
  },
  webpack: config => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'core/request': path.resolve(__dirname, 'src/libs/requestWrapper.ts')
    }
    return config
  }
}

export default nextConfig
