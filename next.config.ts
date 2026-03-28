import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Redirect old /:country/:city URLs to /weather/:country/:city
        source: "/:country((?!api|weather|_next|countries).*)/:city",
        destination: "/weather/:country/:city",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
