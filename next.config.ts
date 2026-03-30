import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Redirect old /:lang/:country/:city URLs to /:lang/weather/:country/:city
        source: "/:lang(en|fr|ar|pt|sw)/:country((?!api|weather|_next|countries).*)/:city",
        destination: "/:lang/weather/:country/:city",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
