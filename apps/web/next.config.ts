import type { NextConfig } from 'next';

// next dev --webpack (in package.json) avoids Turbopack's Rust Unicode panic
// triggered by the 'é' in the project path (Downloads/Léargas).
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
