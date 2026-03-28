import { City } from "./types";
import { africanCities } from "./african-cities";

export const southAfricaCities: City[] = [
  { name: "Cape Town", slug: "cape-town", latitude: -33.9249, longitude: 18.4241, country: "south-africa", countryName: "South Africa", population: 4618000, province: "Western Cape" },
  { name: "Johannesburg", slug: "johannesburg", latitude: -26.2041, longitude: 28.0473, country: "south-africa", countryName: "South Africa", population: 5635000, province: "Gauteng" },
  { name: "Durban", slug: "durban", latitude: -29.8587, longitude: 31.0218, country: "south-africa", countryName: "South Africa", population: 3720000, province: "KwaZulu-Natal" },
  { name: "Pretoria", slug: "pretoria", latitude: -25.7479, longitude: 28.2293, country: "south-africa", countryName: "South Africa", population: 2560000, province: "Gauteng" },
  { name: "Gqeberha", slug: "gqeberha", latitude: -33.918, longitude: 25.5701, country: "south-africa", countryName: "South Africa", population: 1260000, province: "Eastern Cape" },
  { name: "Bloemfontein", slug: "bloemfontein", latitude: -29.0852, longitude: 26.1596, country: "south-africa", countryName: "South Africa", population: 556000, province: "Free State" },
  { name: "East London", slug: "east-london", latitude: -33.0153, longitude: 27.9116, country: "south-africa", countryName: "South Africa", population: 478000, province: "Eastern Cape" },
  { name: "Pietermaritzburg", slug: "pietermaritzburg", latitude: -29.6006, longitude: 30.3794, country: "south-africa", countryName: "South Africa", population: 750000, province: "KwaZulu-Natal" },
  { name: "Nelspruit", slug: "nelspruit", latitude: -25.4753, longitude: 30.9694, country: "south-africa", countryName: "South Africa", population: 110000, province: "Mpumalanga" },
  { name: "Polokwane", slug: "polokwane", latitude: -23.9045, longitude: 29.4689, country: "south-africa", countryName: "South Africa", population: 797000, province: "Limpopo" },
  { name: "Kimberley", slug: "kimberley", latitude: -28.7282, longitude: 24.7499, country: "south-africa", countryName: "South Africa", population: 228000, province: "Northern Cape" },
  { name: "Rustenburg", slug: "rustenburg", latitude: -25.6715, longitude: 27.242, country: "south-africa", countryName: "South Africa", population: 626000, province: "North West" },
  { name: "eMalahleni", slug: "emalahleni", latitude: -25.8761, longitude: 29.2332, country: "south-africa", countryName: "South Africa", population: 455000, province: "Mpumalanga" },
  { name: "Soweto", slug: "soweto", latitude: -26.2485, longitude: 27.8546, country: "south-africa", countryName: "South Africa", population: 1270000, province: "Gauteng" },
  { name: "Benoni", slug: "benoni", latitude: -26.1883, longitude: 28.3209, country: "south-africa", countryName: "South Africa", population: 605000, province: "Gauteng" },
  { name: "Centurion", slug: "centurion", latitude: -25.8603, longitude: 28.1894, country: "south-africa", countryName: "South Africa", population: 236000, province: "Gauteng" },
  { name: "Sandton", slug: "sandton", latitude: -26.1076, longitude: 28.0567, country: "south-africa", countryName: "South Africa", population: 222000, province: "Gauteng" },
  { name: "Roodepoort", slug: "roodepoort", latitude: -26.1625, longitude: 27.8727, country: "south-africa", countryName: "South Africa", population: 326000, province: "Gauteng" },
  { name: "Randburg", slug: "randburg", latitude: -26.0935, longitude: 28.0, country: "south-africa", countryName: "South Africa", population: 337000, province: "Gauteng" },
  { name: "Krugersdorp", slug: "krugersdorp", latitude: -26.0859, longitude: 27.7699, country: "south-africa", countryName: "South Africa", population: 378000, province: "Gauteng" },
  { name: "George", slug: "george", latitude: -33.963, longitude: 22.4617, country: "south-africa", countryName: "South Africa", population: 209000, province: "Western Cape" },
  { name: "Stellenbosch", slug: "stellenbosch", latitude: -33.9346, longitude: 18.8602, country: "south-africa", countryName: "South Africa", population: 177000, province: "Western Cape" },
  { name: "Paarl", slug: "paarl", latitude: -33.7342, longitude: 18.9708, country: "south-africa", countryName: "South Africa", population: 206000, province: "Western Cape" },
  { name: "Worcester", slug: "worcester", latitude: -33.6464, longitude: 19.4483, country: "south-africa", countryName: "South Africa", population: 108000, province: "Western Cape" },
  { name: "Knysna", slug: "knysna", latitude: -34.0356, longitude: 23.0488, country: "south-africa", countryName: "South Africa", population: 77000, province: "Western Cape" },
  { name: "Mossel Bay", slug: "mossel-bay", latitude: -34.1826, longitude: 22.1458, country: "south-africa", countryName: "South Africa", population: 130000, province: "Western Cape" },
  { name: "Oudtshoorn", slug: "oudtshoorn", latitude: -33.5888, longitude: 22.2026, country: "south-africa", countryName: "South Africa", population: 95000, province: "Western Cape" },
  { name: "Hermanus", slug: "hermanus", latitude: -34.4187, longitude: 19.2345, country: "south-africa", countryName: "South Africa", population: 45000, province: "Western Cape" },
  { name: "Richards Bay", slug: "richards-bay", latitude: -28.783, longitude: 32.0377, country: "south-africa", countryName: "South Africa", population: 252000, province: "KwaZulu-Natal" },
  { name: "Newcastle", slug: "newcastle", latitude: -27.757, longitude: 29.932, country: "south-africa", countryName: "South Africa", population: 364000, province: "KwaZulu-Natal" },
  { name: "Ladysmith", slug: "ladysmith", latitude: -28.5597, longitude: 29.7811, country: "south-africa", countryName: "South Africa", population: 237000, province: "KwaZulu-Natal" },
  { name: "Upington", slug: "upington", latitude: -28.4478, longitude: 21.2561, country: "south-africa", countryName: "South Africa", population: 93000, province: "Northern Cape" },
  { name: "Mahikeng", slug: "mahikeng", latitude: -25.8653, longitude: 25.6446, country: "south-africa", countryName: "South Africa", population: 291000, province: "North West" },
  { name: "Potchefstroom", slug: "potchefstroom", latitude: -26.7145, longitude: 27.0986, country: "south-africa", countryName: "South Africa", population: 248000, province: "North West" },
  { name: "Klerksdorp", slug: "klerksdorp", latitude: -26.8522, longitude: 26.6598, country: "south-africa", countryName: "South Africa", population: 183000, province: "North West" },
  { name: "Welkom", slug: "welkom", latitude: -27.9736, longitude: 26.7346, country: "south-africa", countryName: "South Africa", population: 432000, province: "Free State" },
  { name: "Kroonstad", slug: "kroonstad", latitude: -27.65, longitude: 27.2333, country: "south-africa", countryName: "South Africa", population: 103000, province: "Free State" },
  { name: "Makhanda", slug: "makhanda", latitude: -33.3048, longitude: 26.5225, country: "south-africa", countryName: "South Africa", population: 67000, province: "Eastern Cape" },
  { name: "Uitenhage", slug: "uitenhage", latitude: -33.7667, longitude: 25.4, country: "south-africa", countryName: "South Africa", population: 228000, province: "Eastern Cape" },
  { name: "Jeffreys Bay", slug: "jeffreys-bay", latitude: -33.933, longitude: 25.0, country: "south-africa", countryName: "South Africa", population: 33000, province: "Eastern Cape" },
  { name: "Plettenberg Bay", slug: "plettenberg-bay", latitude: -34.0527, longitude: 23.3716, country: "south-africa", countryName: "South Africa", population: 36000, province: "Western Cape" },
  { name: "Umhlanga", slug: "umhlanga", latitude: -29.7231, longitude: 31.0819, country: "south-africa", countryName: "South Africa", population: 40000, province: "KwaZulu-Natal" },
  { name: "Ballito", slug: "ballito", latitude: -29.5393, longitude: 31.2136, country: "south-africa", countryName: "South Africa", population: 30000, province: "KwaZulu-Natal" },
  { name: "Pinetown", slug: "pinetown", latitude: -29.8171, longitude: 30.8572, country: "south-africa", countryName: "South Africa", population: 144000, province: "KwaZulu-Natal" },
  { name: "Midrand", slug: "midrand", latitude: -25.9884, longitude: 28.1272, country: "south-africa", countryName: "South Africa", population: 200000, province: "Gauteng" },
  { name: "Boksburg", slug: "boksburg", latitude: -26.2125, longitude: 28.2625, country: "south-africa", countryName: "South Africa", population: 363000, province: "Gauteng" },
  { name: "Springs", slug: "springs", latitude: -26.2525, longitude: 28.4394, country: "south-africa", countryName: "South Africa", population: 186000, province: "Gauteng" },
  { name: "Vereeniging", slug: "vereeniging", latitude: -26.6736, longitude: 27.9264, country: "south-africa", countryName: "South Africa", population: 474000, province: "Gauteng" },
  { name: "Vanderbijlpark", slug: "vanderbijlpark", latitude: -26.7113, longitude: 27.8386, country: "south-africa", countryName: "South Africa", population: 95000, province: "Gauteng" },
  { name: "Tembisa", slug: "tembisa", latitude: -26.0, longitude: 28.2167, country: "south-africa", countryName: "South Africa", population: 463000, province: "Gauteng" },
  { name: "Musina", slug: "musina", latitude: -22.3381, longitude: 30.0404, country: "south-africa", countryName: "South Africa", population: 42000, province: "Limpopo" },
  { name: "Thohoyandou", slug: "thohoyandou", latitude: -22.9506, longitude: 30.4833, country: "south-africa", countryName: "South Africa", population: 69000, province: "Limpopo" },
  { name: "Tzaneen", slug: "tzaneen", latitude: -23.832, longitude: 30.1627, country: "south-africa", countryName: "South Africa", population: 39000, province: "Limpopo" },
  { name: "Lephalale", slug: "lephalale", latitude: -23.6905, longitude: 27.7008, country: "south-africa", countryName: "South Africa", population: 68000, province: "Limpopo" },
  { name: "Saldanha Bay", slug: "saldanha-bay", latitude: -33.0047, longitude: 17.9238, country: "south-africa", countryName: "South Africa", population: 99000, province: "Western Cape" },
  { name: "Swellendam", slug: "swellendam", latitude: -34.0236, longitude: 20.4419, country: "south-africa", countryName: "South Africa", population: 18000, province: "Western Cape" },
  { name: "Franschhoek", slug: "franschhoek", latitude: -33.9133, longitude: 19.1167, country: "south-africa", countryName: "South Africa", population: 16000, province: "Western Cape" },
  { name: "Graaff-Reinet", slug: "graaff-reinet", latitude: -32.2519, longitude: 24.5308, country: "south-africa", countryName: "South Africa", population: 36000, province: "Eastern Cape" },
  { name: "Mthatha", slug: "mthatha", latitude: -31.5889, longitude: 28.7844, country: "south-africa", countryName: "South Africa", population: 136000, province: "Eastern Cape" },
  { name: "Secunda", slug: "secunda", latitude: -26.5167, longitude: 29.1667, country: "south-africa", countryName: "South Africa", population: 40000, province: "Mpumalanga" },
];

// ── Combined dataset ──────────────────────────────────────────────────────
export const allCities: City[] = [...southAfricaCities, ...africanCities];

// ── Country-generic helpers ───────────────────────────────────────────────

export function getCitiesByCountry(countrySlug: string): City[] {
  return allCities.filter((c) => c.country === countrySlug);
}

export function getCityByCountryAndSlug(
  countrySlug: string,
  citySlug: string
): City | undefined {
  return allCities.find(
    (c) => c.country === countrySlug && c.slug === citySlug
  );
}

export function getCitiesByProvince(countrySlug?: string): Record<string, City[]> {
  const cities = countrySlug ? getCitiesByCountry(countrySlug) : southAfricaCities;
  const grouped: Record<string, City[]> = {};
  for (const city of cities) {
    const province = city.province || "Other";
    if (!grouped[province]) grouped[province] = [];
    grouped[province].push(city);
  }
  for (const key of Object.keys(grouped)) {
    grouped[key].sort((a, b) => b.population - a.population);
  }
  return grouped;
}

export function getNearbyCities(city: City, limit = 6): City[] {
  const countryCities = getCitiesByCountry(city.country);
  return countryCities
    .filter((c) => c.slug !== city.slug)
    .map((c) => ({
      ...c,
      distance: Math.sqrt(
        Math.pow(c.latitude - city.latitude, 2) +
          Math.pow(c.longitude - city.longitude, 2)
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

// ── Kept for backwards compat (SA-specific) ───────────────────────────────

export function getCityBySlug(slug: string): City | undefined {
  return southAfricaCities.find((c) => c.slug === slug);
}

export function getPopularCities(limit = 12): City[] {
  return [...southAfricaCities]
    .sort((a, b) => b.population - a.population)
    .slice(0, limit);
}
