import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // inglês é o idioma principal: "/" serve a versão /en
  async rewrites() {
    return [{ source: "/", destination: "/en" }];
  },
  async redirects() {
    return [{ source: "/en", destination: "/", permanent: true }];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
