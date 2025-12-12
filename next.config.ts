// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "worker-1.esdrascamel.workers.dev",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "icmsede.com.br",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/**"
      }
    ]
  },
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;