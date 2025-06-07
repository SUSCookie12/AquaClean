
import type {NextConfig} from 'next';
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
});

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
  experimental: {
    // Add the allowedDevOrigins configuration here
    allowedDevOrigins: [
      'https://6000-firebase-studio-1749106393004.cluster-ombtxv25tbd6yrjpp3lukp6zhc.cloudworkstations.dev',
    ],
  },
};

export default withPWA(nextConfig);
