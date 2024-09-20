/** @type {import('next').NextConfig} */
const nextConfig = {

  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
    serverComponentsExternalPackages: ["mongoose"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "ibs.it",
      },
      {
        protocol: "https",
        hostname: "www.ibs.it",  // Aggiungi questo per il sottodominio
      },
      {
        protocol:"https",
        hostname:"files.edgestore.dev"
      },
      {
        protocol:"https",
        hostname:"www.files.edgestore.dev"
      }
    ],
  },
};

module.exports = nextConfig;
