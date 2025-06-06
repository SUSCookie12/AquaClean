
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows any HTTPS hostname
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**', // Allows any HTTP hostname
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
