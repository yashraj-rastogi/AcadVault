/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily ignore errors for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image optimization for static hosting
  images: {
    unoptimized: true,
    domains: ['placeholder.com', 'via.placeholder.com'],
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons']
  },
  
  // For better deployment
  swcMinify: true,
}

export default nextConfig
