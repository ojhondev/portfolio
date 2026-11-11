import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // inglês é o idioma principal: "/" serve a versão /en
  async rewrites() {
    return [{ source: "/", destination: "/en" }];
  },
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      // www → domínio principal
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.devjhon.tech" }],
        destination: "https://devjhon.tech/:path*",
        permanent: true,
      },
    ];
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
