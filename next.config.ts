import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "localhost",
      "worker-1.esdrascamel.workers.dev"
    ]},
    devIndicators: {position: "bottom-right"},
    eslint: {
      // Não roda/verifica ESLint durante `next build`
      ignoreDuringBuilds: true,
    },
};

export default nextConfig;
