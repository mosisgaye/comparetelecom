/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    domains: [
      'www.awin1.com',
      'tracking.publicidees.com',
      'telecom.bemove.fr',
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Suppression de la section rewrites qui n'est plus nécessaire
};

module.exports = nextConfig;
