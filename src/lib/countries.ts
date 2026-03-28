export interface Country {
  name: string;
  slug: string;
  capital: string;
  region: AfricaRegion;
  flag: string;
  live: boolean;
  population: number; // millions
}

export type AfricaRegion =
  | "Southern Africa"
  | "East Africa"
  | "West Africa"
  | "Central Africa"
  | "North Africa";

export const africanCountries: Country[] = [
  // ── Southern Africa ──────────────────────────────────────────
  { name: "South Africa", slug: "south-africa", capital: "Pretoria", region: "Southern Africa", flag: "\u{1F1FF}\u{1F1E6}", live: true, population: 62 },
  { name: "Botswana", slug: "botswana", capital: "Gaborone", region: "Southern Africa", flag: "\u{1F1E7}\u{1F1FC}", live: true, population: 2.6 },
  { name: "Zimbabwe", slug: "zimbabwe", capital: "Harare", region: "Southern Africa", flag: "\u{1F1FF}\u{1F1FC}", live: true, population: 16.3 },
  { name: "Mozambique", slug: "mozambique", capital: "Maputo", region: "Southern Africa", flag: "\u{1F1F2}\u{1F1FF}", live: true, population: 33 },
  { name: "Zambia", slug: "zambia", capital: "Lusaka", region: "Southern Africa", flag: "\u{1F1FF}\u{1F1F2}", live: true, population: 20 },
  { name: "Malawi", slug: "malawi", capital: "Lilongwe", region: "Southern Africa", flag: "\u{1F1F2}\u{1F1FC}", live: true, population: 20.4 },
  { name: "Namibia", slug: "namibia", capital: "Windhoek", region: "Southern Africa", flag: "\u{1F1F3}\u{1F1E6}", live: true, population: 2.6 },
  { name: "Lesotho", slug: "lesotho", capital: "Maseru", region: "Southern Africa", flag: "\u{1F1F1}\u{1F1F8}", live: true, population: 2.3 },
  { name: "Eswatini", slug: "eswatini", capital: "Mbabane", region: "Southern Africa", flag: "\u{1F1F8}\u{1F1FF}", live: true, population: 1.2 },
  { name: "Madagascar", slug: "madagascar", capital: "Antananarivo", region: "Southern Africa", flag: "\u{1F1F2}\u{1F1EC}", live: true, population: 30 },
  { name: "Mauritius", slug: "mauritius", capital: "Port Louis", region: "Southern Africa", flag: "\u{1F1F2}\u{1F1FA}", live: true, population: 1.3 },
  { name: "Comoros", slug: "comoros", capital: "Moroni", region: "Southern Africa", flag: "\u{1F1F0}\u{1F1F2}", live: true, population: 0.9 },
  { name: "Angola", slug: "angola", capital: "Luanda", region: "Southern Africa", flag: "\u{1F1E6}\u{1F1F4}", live: true, population: 36 },

  // ── East Africa ──────────────────────────────────────────────
  { name: "Kenya", slug: "kenya", capital: "Nairobi", region: "East Africa", flag: "\u{1F1F0}\u{1F1EA}", live: true, population: 56 },
  { name: "Tanzania", slug: "tanzania", capital: "Dodoma", region: "East Africa", flag: "\u{1F1F9}\u{1F1FF}", live: true, population: 65 },
  { name: "Uganda", slug: "uganda", capital: "Kampala", region: "East Africa", flag: "\u{1F1FA}\u{1F1EC}", live: true, population: 49 },
  { name: "Ethiopia", slug: "ethiopia", capital: "Addis Ababa", region: "East Africa", flag: "\u{1F1EA}\u{1F1F9}", live: true, population: 126 },
  { name: "Rwanda", slug: "rwanda", capital: "Kigali", region: "East Africa", flag: "\u{1F1F7}\u{1F1FC}", live: true, population: 14 },
  { name: "Burundi", slug: "burundi", capital: "Gitega", region: "East Africa", flag: "\u{1F1E7}\u{1F1EE}", live: true, population: 13 },
  { name: "South Sudan", slug: "south-sudan", capital: "Juba", region: "East Africa", flag: "\u{1F1F8}\u{1F1F8}", live: true, population: 11.4 },
  { name: "Somalia", slug: "somalia", capital: "Mogadishu", region: "East Africa", flag: "\u{1F1F8}\u{1F1F4}", live: true, population: 18 },
  { name: "Djibouti", slug: "djibouti", capital: "Djibouti", region: "East Africa", flag: "\u{1F1E9}\u{1F1EF}", live: true, population: 1.1 },
  { name: "Eritrea", slug: "eritrea", capital: "Asmara", region: "East Africa", flag: "\u{1F1EA}\u{1F1F7}", live: true, population: 3.7 },
  { name: "Seychelles", slug: "seychelles", capital: "Victoria", region: "East Africa", flag: "\u{1F1F8}\u{1F1E8}", live: true, population: 0.1 },

  // ── West Africa ──────────────────────────────────────────────
  { name: "Nigeria", slug: "nigeria", capital: "Abuja", region: "West Africa", flag: "\u{1F1F3}\u{1F1EC}", live: true, population: 224 },
  { name: "Ghana", slug: "ghana", capital: "Accra", region: "West Africa", flag: "\u{1F1EC}\u{1F1ED}", live: true, population: 34 },
  { name: "Senegal", slug: "senegal", capital: "Dakar", region: "West Africa", flag: "\u{1F1F8}\u{1F1F3}", live: true, population: 18 },
  { name: "Ivory Coast", slug: "ivory-coast", capital: "Yamoussoukro", region: "West Africa", flag: "\u{1F1E8}\u{1F1EE}", live: true, population: 28 },
  { name: "Mali", slug: "mali", capital: "Bamako", region: "West Africa", flag: "\u{1F1F2}\u{1F1F1}", live: true, population: 23 },
  { name: "Burkina Faso", slug: "burkina-faso", capital: "Ouagadougou", region: "West Africa", flag: "\u{1F1E7}\u{1F1EB}", live: true, population: 23 },
  { name: "Niger", slug: "niger", capital: "Niamey", region: "West Africa", flag: "\u{1F1F3}\u{1F1EA}", live: true, population: 27 },
  { name: "Guinea", slug: "guinea", capital: "Conakry", region: "West Africa", flag: "\u{1F1EC}\u{1F1F3}", live: true, population: 14 },
  { name: "Sierra Leone", slug: "sierra-leone", capital: "Freetown", region: "West Africa", flag: "\u{1F1F8}\u{1F1F1}", live: true, population: 8.6 },
  { name: "Liberia", slug: "liberia", capital: "Monrovia", region: "West Africa", flag: "\u{1F1F1}\u{1F1F7}", live: true, population: 5.4 },
  { name: "Togo", slug: "togo", capital: "Lome", region: "West Africa", flag: "\u{1F1F9}\u{1F1EC}", live: true, population: 9 },
  { name: "Benin", slug: "benin", capital: "Porto-Novo", region: "West Africa", flag: "\u{1F1E7}\u{1F1EF}", live: true, population: 13.4 },
  { name: "Gambia", slug: "gambia", capital: "Banjul", region: "West Africa", flag: "\u{1F1EC}\u{1F1F2}", live: true, population: 2.7 },
  { name: "Guinea-Bissau", slug: "guinea-bissau", capital: "Bissau", region: "West Africa", flag: "\u{1F1EC}\u{1F1FC}", live: true, population: 2.1 },
  { name: "Cape Verde", slug: "cape-verde", capital: "Praia", region: "West Africa", flag: "\u{1F1E8}\u{1F1FB}", live: true, population: 0.6 },
  { name: "Mauritania", slug: "mauritania", capital: "Nouakchott", region: "West Africa", flag: "\u{1F1F2}\u{1F1F7}", live: true, population: 4.9 },

  // ── Central Africa ───────────────────────────────────────────
  { name: "DR Congo", slug: "dr-congo", capital: "Kinshasa", region: "Central Africa", flag: "\u{1F1E8}\u{1F1E9}", live: true, population: 102 },
  { name: "Cameroon", slug: "cameroon", capital: "Yaounde", region: "Central Africa", flag: "\u{1F1E8}\u{1F1F2}", live: true, population: 28 },
  { name: "Congo", slug: "congo", capital: "Brazzaville", region: "Central Africa", flag: "\u{1F1E8}\u{1F1EC}", live: true, population: 6 },
  { name: "Gabon", slug: "gabon", capital: "Libreville", region: "Central Africa", flag: "\u{1F1EC}\u{1F1E6}", live: true, population: 2.4 },
  { name: "Central African Republic", slug: "central-african-republic", capital: "Bangui", region: "Central Africa", flag: "\u{1F1E8}\u{1F1EB}", live: true, population: 5.5 },
  { name: "Chad", slug: "chad", capital: "N'Djamena", region: "Central Africa", flag: "\u{1F1F9}\u{1F1E9}", live: true, population: 18 },
  { name: "Equatorial Guinea", slug: "equatorial-guinea", capital: "Malabo", region: "Central Africa", flag: "\u{1F1EC}\u{1F1F6}", live: true, population: 1.7 },
  { name: "São Tomé and Príncipe", slug: "sao-tome-and-principe", capital: "São Tomé", region: "Central Africa", flag: "\u{1F1F8}\u{1F1F9}", live: true, population: 0.2 },

  // ── North Africa ─────────────────────────────────────────────
  { name: "Egypt", slug: "egypt", capital: "Cairo", region: "North Africa", flag: "\u{1F1EA}\u{1F1EC}", live: true, population: 112 },
  { name: "Morocco", slug: "morocco", capital: "Rabat", region: "North Africa", flag: "\u{1F1F2}\u{1F1E6}", live: true, population: 38 },
  { name: "Algeria", slug: "algeria", capital: "Algiers", region: "North Africa", flag: "\u{1F1E9}\u{1F1FF}", live: true, population: 45 },
  { name: "Tunisia", slug: "tunisia", capital: "Tunis", region: "North Africa", flag: "\u{1F1F9}\u{1F1F3}", live: true, population: 12 },
  { name: "Libya", slug: "libya", capital: "Tripoli", region: "North Africa", flag: "\u{1F1F1}\u{1F1FE}", live: true, population: 7 },
  { name: "Sudan", slug: "sudan", capital: "Khartoum", region: "North Africa", flag: "\u{1F1F8}\u{1F1E9}", live: true, population: 48 },
];

export const regions: AfricaRegion[] = [
  "Southern Africa",
  "East Africa",
  "West Africa",
  "Central Africa",
  "North Africa",
];

export function getCountriesByRegion(): Record<AfricaRegion, Country[]> {
  const grouped = {} as Record<AfricaRegion, Country[]>;
  for (const region of regions) {
    grouped[region] = africanCountries
      .filter((c) => c.region === region)
      .sort((a, b) => b.population - a.population);
  }
  return grouped;
}

export function getLiveCountries(): Country[] {
  return africanCountries.filter((c) => c.live);
}

export function getComingSoonCountries(): Country[] {
  return africanCountries.filter((c) => !c.live);
}

/** IANA timezone for each country (capital city). */
const countryTimezones: Record<string, string> = {
  "south-africa": "Africa/Johannesburg",
  botswana: "Africa/Gaborone",
  zimbabwe: "Africa/Harare",
  mozambique: "Africa/Maputo",
  zambia: "Africa/Lusaka",
  malawi: "Africa/Blantyre",
  namibia: "Africa/Windhoek",
  lesotho: "Africa/Maseru",
  eswatini: "Africa/Mbabane",
  madagascar: "Indian/Antananarivo",
  mauritius: "Indian/Mauritius",
  comoros: "Indian/Comoro",
  angola: "Africa/Luanda",
  kenya: "Africa/Nairobi",
  tanzania: "Africa/Dar_es_Salaam",
  uganda: "Africa/Kampala",
  ethiopia: "Africa/Addis_Ababa",
  rwanda: "Africa/Kigali",
  burundi: "Africa/Bujumbura",
  "south-sudan": "Africa/Juba",
  somalia: "Africa/Mogadishu",
  djibouti: "Africa/Djibouti",
  eritrea: "Africa/Asmara",
  seychelles: "Indian/Mahe",
  nigeria: "Africa/Lagos",
  ghana: "Africa/Accra",
  senegal: "Africa/Dakar",
  "ivory-coast": "Africa/Abidjan",
  mali: "Africa/Bamako",
  "burkina-faso": "Africa/Ouagadougou",
  niger: "Africa/Niamey",
  guinea: "Africa/Conakry",
  "sierra-leone": "Africa/Freetown",
  liberia: "Africa/Monrovia",
  togo: "Africa/Lome",
  benin: "Africa/Porto-Novo",
  gambia: "Africa/Banjul",
  "guinea-bissau": "Africa/Bissau",
  "cape-verde": "Atlantic/Cape_Verde",
  mauritania: "Africa/Nouakchott",
  "dr-congo": "Africa/Kinshasa",
  cameroon: "Africa/Douala",
  congo: "Africa/Brazzaville",
  gabon: "Africa/Libreville",
  "central-african-republic": "Africa/Bangui",
  chad: "Africa/Ndjamena",
  "equatorial-guinea": "Africa/Malabo",
  "sao-tome-and-principe": "Africa/Sao_Tome",
  egypt: "Africa/Cairo",
  morocco: "Africa/Casablanca",
  algeria: "Africa/Algiers",
  tunisia: "Africa/Tunis",
  libya: "Africa/Tripoli",
  sudan: "Africa/Khartoum",
};

export function getTimezone(countrySlug: string): string {
  return countryTimezones[countrySlug] || "Africa/Johannesburg";
}

/** Extract ISO 3166-1 alpha-2 code from a flag emoji (regional indicator symbols). */
export function getISOFromFlag(flag: string): string {
  const codePoints = [...flag].map((c) => c.codePointAt(0)!);
  return codePoints
    .filter((cp) => cp >= 0x1f1e6 && cp <= 0x1f1ff)
    .map((cp) => String.fromCharCode(cp - 0x1f1e6 + 65))
    .join("");
}
