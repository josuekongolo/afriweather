/**
 * Downloads GeoNames cities database and expands African city coverage.
 * Uses cities5000.zip (all cities globally with population > 5,000).
 *
 * Run: npx tsx scripts/expand-cities.ts
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

const GEONAMES_URL = "https://download.geonames.org/export/dump/cities5000.zip";
const TMP_DIR = resolve(__dirname, "../.tmp");
const OUT_FILE = resolve(__dirname, "../src/lib/african-cities.ts");

// Map ISO country codes → our slugs
const codeToSlug: Record<string, { slug: string; name: string }> = {
  ZA: { slug: "south-africa", name: "South Africa" },
  BW: { slug: "botswana", name: "Botswana" },
  ZW: { slug: "zimbabwe", name: "Zimbabwe" },
  MZ: { slug: "mozambique", name: "Mozambique" },
  ZM: { slug: "zambia", name: "Zambia" },
  MW: { slug: "malawi", name: "Malawi" },
  NA: { slug: "namibia", name: "Namibia" },
  LS: { slug: "lesotho", name: "Lesotho" },
  SZ: { slug: "eswatini", name: "Eswatini" },
  MG: { slug: "madagascar", name: "Madagascar" },
  MU: { slug: "mauritius", name: "Mauritius" },
  KM: { slug: "comoros", name: "Comoros" },
  AO: { slug: "angola", name: "Angola" },
  KE: { slug: "kenya", name: "Kenya" },
  TZ: { slug: "tanzania", name: "Tanzania" },
  UG: { slug: "uganda", name: "Uganda" },
  ET: { slug: "ethiopia", name: "Ethiopia" },
  RW: { slug: "rwanda", name: "Rwanda" },
  BI: { slug: "burundi", name: "Burundi" },
  SS: { slug: "south-sudan", name: "South Sudan" },
  SO: { slug: "somalia", name: "Somalia" },
  DJ: { slug: "djibouti", name: "Djibouti" },
  ER: { slug: "eritrea", name: "Eritrea" },
  SC: { slug: "seychelles", name: "Seychelles" },
  NG: { slug: "nigeria", name: "Nigeria" },
  GH: { slug: "ghana", name: "Ghana" },
  SN: { slug: "senegal", name: "Senegal" },
  CI: { slug: "ivory-coast", name: "Ivory Coast" },
  ML: { slug: "mali", name: "Mali" },
  BF: { slug: "burkina-faso", name: "Burkina Faso" },
  NE: { slug: "niger", name: "Niger" },
  GN: { slug: "guinea", name: "Guinea" },
  SL: { slug: "sierra-leone", name: "Sierra Leone" },
  LR: { slug: "liberia", name: "Liberia" },
  TG: { slug: "togo", name: "Togo" },
  BJ: { slug: "benin", name: "Benin" },
  GM: { slug: "gambia", name: "Gambia" },
  GW: { slug: "guinea-bissau", name: "Guinea-Bissau" },
  CV: { slug: "cape-verde", name: "Cape Verde" },
  MR: { slug: "mauritania", name: "Mauritania" },
  CD: { slug: "dr-congo", name: "DR Congo" },
  CM: { slug: "cameroon", name: "Cameroon" },
  CG: { slug: "congo", name: "Congo" },
  GA: { slug: "gabon", name: "Gabon" },
  CF: { slug: "central-african-republic", name: "Central African Republic" },
  TD: { slug: "chad", name: "Chad" },
  GQ: { slug: "equatorial-guinea", name: "Equatorial Guinea" },
  ST: { slug: "sao-tome-and-principe", name: "São Tomé and Príncipe" },
  EG: { slug: "egypt", name: "Egypt" },
  MA: { slug: "morocco", name: "Morocco" },
  DZ: { slug: "algeria", name: "Algeria" },
  TN: { slug: "tunisia", name: "Tunisia" },
  LY: { slug: "libya", name: "Libya" },
  SD: { slug: "sudan", name: "Sudan" },
};

const africanCodes = new Set(Object.keys(codeToSlug));

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// GeoNames admin1 codes → human-readable province/state names
// We'll use the admin1 name from the data where available
async function loadAdmin1Names(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const adminUrl = "https://download.geonames.org/export/dump/admin1CodesASCII.txt";
    console.log("Downloading admin1 codes...");
    execSync(`curl -sL "${adminUrl}" -o "${TMP_DIR}/admin1.txt"`, { timeout: 30000 });
    const data = readFileSync(`${TMP_DIR}/admin1.txt`, "utf-8");
    for (const line of data.split("\n")) {
      if (!line.trim()) continue;
      const parts = line.split("\t");
      // Format: CC.ADMIN1_CODE \t name \t ascii_name \t geonameid
      if (parts.length >= 2) {
        map.set(parts[0], parts[1]);
      }
    }
  } catch (e) {
    console.warn("Could not load admin1 codes, provinces will be empty");
  }
  return map;
}

async function main() {
  // Create tmp dir
  if (!existsSync(TMP_DIR)) mkdirSync(TMP_DIR, { recursive: true });

  // Download GeoNames data
  const zipPath = `${TMP_DIR}/cities5000.zip`;
  const txtPath = `${TMP_DIR}/cities5000.txt`;

  if (!existsSync(txtPath)) {
    console.log("Downloading GeoNames cities5000.zip...");
    execSync(`curl -sL "${GEONAMES_URL}" -o "${zipPath}"`, { timeout: 120000 });
    console.log("Extracting...");
    execSync(`unzip -o "${zipPath}" -d "${TMP_DIR}"`, { timeout: 30000 });
  } else {
    console.log("Using cached cities5000.txt");
  }

  // Load admin1 names for provinces
  const admin1Names = await loadAdmin1Names();

  // Parse TSV
  // Columns: geonameid, name, asciiname, alternatenames, latitude, longitude,
  //          feature_class, feature_code, country_code, cc2, admin1_code,
  //          admin2_code, admin3_code, admin4_code, population, elevation,
  //          dem, timezone, modification_date
  console.log("Parsing cities data...");
  const raw = readFileSync(txtPath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());

  // Load existing South Africa cities to exclude (they're in cities.ts)
  const existingSlugs = new Set<string>();
  try {
    const citiesFile = readFileSync(
      resolve(__dirname, "../src/lib/cities.ts"),
      "utf-8"
    );
    const slugMatches = citiesFile.matchAll(/slug: "([^"]+)"/g);
    for (const m of slugMatches) {
      existingSlugs.add(m[1]);
    }
  } catch {}

  interface CityEntry {
    name: string;
    slug: string;
    latitude: number;
    longitude: number;
    country: string;
    countryName: string;
    population: number;
    province: string;
  }

  const cities: CityEntry[] = [];
  const seenSlugs = new Set<string>();

  for (const line of lines) {
    const cols = line.split("\t");
    if (cols.length < 15) continue;

    const countryCode = cols[8];
    if (!africanCodes.has(countryCode)) continue;

    // Skip South Africa — those are in cities.ts
    if (countryCode === "ZA") continue;

    const name = cols[1]; // use the primary name
    const asciiName = cols[2];
    const lat = parseFloat(cols[4]);
    const lon = parseFloat(cols[5]);
    const population = parseInt(cols[14]) || 0;
    const admin1Code = cols[10];
    const countryInfo = codeToSlug[countryCode];

    if (!countryInfo) continue;

    // Get province name from admin1
    const admin1Key = `${countryCode}.${admin1Code}`;
    const province = admin1Names.get(admin1Key) || "";

    // Create slug, ensure uniqueness per country
    let slug = slugify(asciiName || name);
    if (!slug) continue;

    const fullKey = `${countryInfo.slug}/${slug}`;
    if (seenSlugs.has(fullKey) || existingSlugs.has(slug)) {
      // Add country prefix or number to make unique
      slug = `${slug}-${slugify(province || countryCode.toLowerCase())}`;
      const fullKey2 = `${countryInfo.slug}/${slug}`;
      if (seenSlugs.has(fullKey2)) continue;
      seenSlugs.add(fullKey2);
    } else {
      seenSlugs.add(fullKey);
    }

    cities.push({
      name,
      slug,
      latitude: Math.round(lat * 10000) / 10000,
      longitude: Math.round(lon * 10000) / 10000,
      country: countryInfo.slug,
      countryName: countryInfo.name,
      population,
      province,
    });
  }

  // Sort by country then population desc
  cities.sort((a, b) => {
    if (a.country !== b.country) return a.country.localeCompare(b.country);
    return b.population - a.population;
  });

  console.log(`Found ${cities.length} African cities (excl. South Africa)`);

  // Count per country
  const perCountry = new Map<string, number>();
  for (const c of cities) {
    perCountry.set(c.countryName, (perCountry.get(c.countryName) || 0) + 1);
  }
  for (const [country, count] of [...perCountry.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${country}: ${count}`);
  }

  // Generate TypeScript file
  const tsContent = `import { City } from "./types";

// Auto-generated from GeoNames (cities with population > 5,000)
// Generated: ${new Date().toISOString().split("T")[0]}
// Total: ${cities.length} cities across ${perCountry.size} countries

export const africanCities: City[] = [
${cities
  .map(
    (c) =>
      `  { name: ${JSON.stringify(c.name)}, slug: ${JSON.stringify(c.slug)}, latitude: ${c.latitude}, longitude: ${c.longitude}, country: ${JSON.stringify(c.country)}, countryName: ${JSON.stringify(c.countryName)}, population: ${c.population}, province: ${JSON.stringify(c.province)} },`
  )
  .join("\n")}
];
`;

  writeFileSync(OUT_FILE, tsContent, "utf-8");
  console.log(`\nWritten to: ${OUT_FILE}`);
  console.log(`Total cities: ${cities.length} (+ South Africa cities in cities.ts)`);
}

main().catch(console.error);
