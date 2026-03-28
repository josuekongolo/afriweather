import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/weather?"],
      },
    ],
    sitemap: "https://afriweather.com/sitemap.xml",
    host: "https://afriweather.com",
  };
}
