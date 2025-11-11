// next.config.ts
const nextConfig = {
  images: {
    domains: ["localhost", "worker-1.esdrascamel.workers.dev","icmsede.com.br"],
  },
  devIndicators: { position: "bottom-right" },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;