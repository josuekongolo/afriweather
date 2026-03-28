/**
 * Pre-generates sitemap.xml into public/ with every single page on the site.
 *
 * Run: npx tsx scripts/generate-sitemap.ts
 */

import { writeFileSync } from "fs";
import { resolve } from "path";

// Import data directly from source
import { allCities } from "../src/lib/cities";
import { africanCountries } from "../src/lib/countries";

const BASE_URL = "https://afriweather.io";
const today = new Date().toISOString().split("T")[0];

interface SitemapEntry {
  url: string;
  changefreq: string;
  priority: number;
}

const entries: SitemapEntry[] = [];

// 1. Homepage
entries.push({ url: BASE_URL, changefreq: "daily", priority: 1.0 });

// 2. All 54 country hub pages
for (const country of africanCountries) {
  entries.push({
    url: `${BASE_URL}/${country.slug}`,
    changefreq: "daily",
    priority: 0.9,
  });
}

// 3. Every single city weather page
for (const city of allCities) {
  entries.push({
    url: `${BASE_URL}/weather/${city.country}/${city.slug}`,
    changefreq: "hourly",
    priority: 0.8,
  });
}

// Build XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const outPath = resolve(__dirname, "../public/sitemap.xml");
writeFileSync(outPath, xml, "utf-8");

console.log(
  `Sitemap generated: ${entries.length} URLs (1 home + ${africanCountries.length} countries + ${allCities.length} cities)`
);
console.log(`Written to: ${outPath}`);
