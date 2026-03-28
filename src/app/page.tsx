import { getPopularCities, getCitiesByCountry } from "@/lib/cities";
import { CityGrid } from "@/components/weather/city-grid";
import { SearchBar } from "@/components/weather/search-bar";
import { fetchWeatherPreviews, type WeatherPreview } from "@/lib/weather";
import {
  africanCountries,
  getCountriesByRegion,
  type Country,
  type AfricaRegion,
} from "@/lib/countries";
import Link from "next/link";

const regionIcons: Record<AfricaRegion, string> = {
  "Southern Africa":
    "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
  "East Africa":
    "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
  "West Africa":
    "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
  "Central Africa":
    "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
  "North Africa":
    "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
};

const regionColors: Record<AfricaRegion, { from: string; to: string; accent: string }> = {
  "Southern Africa": { from: "from-emerald-50", to: "to-teal-50", accent: "text-emerald-600" },
  "East Africa": { from: "from-amber-50", to: "to-orange-50", accent: "text-amber-600" },
  "West Africa": { from: "from-blue-50", to: "to-indigo-50", accent: "text-blue-600" },
  "Central Africa": { from: "from-violet-50", to: "to-purple-50", accent: "text-violet-600" },
  "North Africa": { from: "from-rose-50", to: "to-pink-50", accent: "text-rose-600" },
};

function CountryCard({ country, weather }: { country: Country; weather?: WeatherPreview }) {
  return (
    <Link
      href={`/${country.slug}`}
      className="group flex items-center justify-between rounded-xl bg-white border border-[var(--border-subtle)] px-3.5 py-3 card-lift"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl shrink-0">{country.flag}</span>
        <div className="min-w-0">
          <span className="text-[13px] font-semibold text-[var(--text-primary)] group-hover:text-blue-600 transition-colors block truncate">
            {country.name}
          </span>
          <span className="text-[11px] text-[var(--text-tertiary)]">
            {country.capital}
          </span>
        </div>
      </div>
      {weather && (
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <span className="text-base leading-none">{weather.emoji}</span>
          <span className="text-[15px] font-bold text-[var(--text-primary)]">
            {weather.temperature}°
          </span>
        </div>
      )}
    </Link>
  );
}

export const revalidate = 1800; // 30 minutes

export default async function Home() {
  const popular = getPopularCities(12);
  const byRegion = getCountriesByRegion();
  const totalCountries = africanCountries.length;
  const weatherData = await fetchWeatherPreviews(popular);

  // Fetch weather for each country's capital (use first/largest city as proxy)
  const capitalCities = africanCountries.map((country) => {
    const cities = getCitiesByCountry(country.slug);
    const capital = cities[0]; // sorted by population, largest first
    return { countrySlug: country.slug, city: capital };
  }).filter((c) => c.city);

  const capitalWeatherData = await fetchWeatherPreviews(
    capitalCities.map((c) => c.city)
  );
  // Map country slug -> weather (using city slug as key in the weather map)
  const countryWeather: Record<string, WeatherPreview> = {};
  for (const { countrySlug, city } of capitalCities) {
    if (capitalWeatherData[city.slug]) {
      countryWeather[countrySlug] = capitalWeatherData[city.slug];
    }
  }

  // Structured Data — WebSite with SearchAction (enables Google sitelinks search box)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AfriWeather",
    url: "https://afriweather.io",
    description: `Accurate weather forecasts for ${totalCountries} African countries and 5,900+ cities. Free, ad-free, updated every 30 minutes.`,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://afriweather.io/weather?name={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero */}
      <section className="atmosphere relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: "url('/hero-bg.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2847]/70 via-[#0f2847]/50 to-[#0f2847]/80 pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-400/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-400/8 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 md:pt-24 md:pb-28 text-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/8 border border-white/10 text-white/60 text-[11px] sm:text-[12px] font-medium tracking-wide mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE WEATHER DATA &middot; {totalCountries} AFRICAN COUNTRIES
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-3 sm:mb-4 leading-[1.1]">
            Weather in
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-200 to-white bg-clip-text text-transparent">
              Africa
            </span>
          </h1>

          <p className="text-white/80 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-md mx-auto font-medium leading-relaxed">
            Accurate forecasts for {totalCountries} African countries. Current
            conditions, hourly and 7-day forecasts for 5,900+ cities.
          </p>

          <SearchBar variant="hero" />

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6 text-[11px] sm:text-[12px] text-white/30 font-medium">
            <span>Cape Town</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Nairobi</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Lagos</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Cairo</span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-14">
        {/* Popular Cities */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
              Popular Cities
            </h2>
            <Link
              href="/south-africa"
              className="text-[13px] text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              South Africa &rarr;
            </Link>
          </div>
          <CityGrid cities={popular} title="" showProvince weatherData={weatherData} />
        </section>

        {/* Browse by Region */}
        {(Object.keys(byRegion) as AfricaRegion[]).map((region) => {
          const countries = byRegion[region];
          const colors = regionColors[region];

          const sectionId = region.toLowerCase().replace(/\s+/g, "-");

          return (
            <section key={region} id={sectionId}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center shrink-0`}
                >
                  <svg
                    className={`w-4.5 h-4.5 ${colors.accent}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={regionIcons[region]} />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[var(--text-primary)]">
                    {region}
                  </h2>
                  <p className="text-[11px] text-[var(--text-tertiary)]">
                    {countries.length} countries
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {countries.map((country) => (
                  <CountryCard key={country.slug} country={country} weather={countryWeather[country.slug]} />
                ))}
              </div>
            </section>
          );
        })}

        {/* About CTA */}
        <section className="text-center py-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 px-6 py-10 max-w-2xl mx-auto">
            <p className="text-3xl mb-3">&#127757;</p>
            <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-2">
              Weather for All of Africa
            </h2>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
              Free, ad-free weather forecasts for {totalCountries} African countries
              and 5,900+ cities. Powered by open data from MET Norway, updated
              every 30 minutes.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
