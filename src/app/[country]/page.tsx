import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCitiesByCountry, getCitiesByProvince } from "@/lib/cities";
import { africanCountries } from "@/lib/countries";
import { fetchWeatherPreviews, type WeatherPreview } from "@/lib/weather";
import { SearchBar } from "@/components/weather/search-bar";

export const revalidate = 1800; // 30 minutes

export function generateStaticParams() {
  return africanCountries.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: slug } = await params;
  const country = africanCountries.find((c) => c.slug === slug);
  if (!country) return { title: "Country Not Found" };

  const cities = getCitiesByCountry(slug);

  return {
    title: `${country.name} Weather — All Cities & Regions`,
    description: `Weather forecasts for ${cities.length} cities in ${country.name}. Browse by region with hourly and 7-day forecasts. Free, ad-free, updated every 30 minutes.`,
    alternates: { canonical: `/${country.slug}` },
    openGraph: {
      title: `Weather in ${country.name} ${country.flag}`,
      description: `Accurate weather for ${cities.length}+ cities in ${country.name}. Current conditions, hourly and 7-day forecasts.`,
      type: "website",
      siteName: "AfriWeather",
      images: [{ url: "/og-image.jpeg", width: 2048, height: 1152, alt: `Weather in ${country.name}` }],
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: slug } = await params;
  const country = africanCountries.find((c) => c.slug === slug);
  if (!country) notFound();

  const byProvince = getCitiesByProvince(slug);
  const provinces = Object.keys(byProvince).sort();
  const allCitiesInCountry = Object.values(byProvince).flat();
  const totalCities = allCitiesInCountry.length;
  const weatherData = await fetchWeatherPreviews(allCitiesInCountry);

  // Structured Data — BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://afriweather.za.com" },
      { "@type": "ListItem", position: 2, name: `${country.name} Weather`, item: `https://afriweather.za.com/${country.slug}` },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="atmosphere relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url('/countries/${slug}.jpeg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 pointer-events-none" />
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-emerald-300/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12 sm:pt-14 sm:pb-16 md:pt-16 md:pb-18">
          <nav className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-white/40 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-white/70 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/70">{country.name}</span>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
            <span className="text-2xl sm:text-3xl">{country.flag}</span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              {country.name} Weather
            </h1>
          </div>
          <p className="text-white/50 text-sm sm:text-base font-medium mb-6 sm:mb-8">
            {totalCities} cities across {provinces.length} regions
          </p>
          <SearchBar variant="hero" />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {provinces.map((province) => (
          <section key={province}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-[16px] font-bold text-[var(--text-primary)]">
                {province}
              </h2>
              <span className="text-[11px] font-semibold text-[var(--text-tertiary)] bg-gray-100 px-2 py-0.5 rounded-full">
                {byProvince[province].length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {byProvince[province].map((city) => {
                const weather = weatherData[city.slug];
                return (
                  <Link
                    key={city.slug}
                    href={`/weather/${slug}/${city.slug}`}
                    className="group flex items-center justify-between rounded-xl bg-white border border-[var(--border-subtle)] px-3.5 py-3 card-lift"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center shrink-0 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors">
                        {weather ? (
                          <span className="text-base leading-none">{weather.emoji}</span>
                        ) : (
                          <svg
                            className="w-3.5 h-3.5 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-[13px] font-semibold text-[var(--text-primary)] group-hover:text-blue-600 transition-colors truncate">
                        {city.name}
                      </span>
                    </div>
                    {weather && (
                      <span className="text-[15px] font-bold text-[var(--text-primary)] shrink-0 ml-2">
                        {weather.temperature}°
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
