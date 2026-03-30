import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCitiesByCountry, getCityByCountryAndSlug, getNearbyCities } from "@/lib/cities";
import { africanCountries, getISOFromFlag, getTimezone } from "@/lib/countries";
import {
  fetchWeather,
  getCurrentWeather,
  getHourlyForecast,
  getDailyForecast,
  getWeatherGradient,
  getDayDetails,
  getGraphData,
  getTranslatedDescription,
} from "@/lib/weather";
import { CurrentWeather } from "@/components/weather/current-weather";
import { ForecastTabs } from "@/components/weather/forecast-tabs";
import { CityGrid } from "@/components/weather/city-grid";
import { getDictionary, hasLocale } from "../../../dictionaries";
import { locales } from "@/i18n/config";

export const revalidate = 1800;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; country: string; city: string }>;
}): Promise<Metadata> {
  const { lang, country: countrySlug, city: citySlug } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang);
  const city = getCityByCountryAndSlug(countrySlug, citySlug);
  if (!city) return { title: dict.notFound.title };

  const country = africanCountries.find((c) => c.slug === countrySlug);
  const countryName = dict.countries[countrySlug as keyof typeof dict.countries] || country?.name || city.countryName;

  let description = `${dict.city.weatherInToday.replace("{city}", city.name)}, ${countryName}.`;
  let temp = "";

  try {
    const data = await fetchWeather(city.latitude, city.longitude);
    const current = getCurrentWeather(data);
    if (current) {
      temp = `${current.temperature}°C`;
      const desc = getTranslatedDescription(current.symbolCode, dict.weather as Record<string, string>);
      description = `${city.name}: ${current.temperature}°C, ${desc}. ${countryName}.`;
    }
  } catch {}

  return {
    title: `${city.name} ${dict.weather.forecast}${temp ? ` ${temp}` : ""} — ${dict.city.todaysForecast}`,
    description,
    alternates: {
      canonical: `/${lang}/weather/${countrySlug}/${city.slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/weather/${countrySlug}/${city.slug}`])
      ),
    },
    openGraph: {
      title: `${dict.city.weatherInToday.replace("{city}", city.name)}, ${countryName}${temp ? ` — ${temp}` : ""}`,
      description,
      type: "website",
      siteName: "AfriWeather",
      images: [{ url: "/og-image.jpeg", width: 2048, height: 1152, alt: `${city.name}, ${countryName}` }],
    },
  };
}

export default async function CityWeatherPage({
  params,
}: {
  params: Promise<{ lang: string; country: string; city: string }>;
}) {
  const { lang, country: countrySlug, city: citySlug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const city = getCityByCountryAndSlug(countrySlug, citySlug);
  if (!city) notFound();

  const country = africanCountries.find((c) => c.slug === countrySlug);
  const countryName = dict.countries[countrySlug as keyof typeof dict.countries] || country?.name || city.countryName;

  const tz = getTimezone(countrySlug);
  const data = await fetchWeather(city.latitude, city.longitude);
  const current = getCurrentWeather(data);
  const hourly = getHourlyForecast(data, 24, tz, lang);
  const daily = getDailyForecast(data, tz, dict.weather.today, lang);
  const dayDetails = getDayDetails(data, tz, dict.weather.today, lang);
  const graphData = getGraphData(data, tz, dict.weather.today, lang);
  const nearby = getNearbyCities(city, 8);

  if (!current) notFound();

  const gradient = getWeatherGradient(current.symbolCode, current.temperature);

  const descTranslated = getTranslatedDescription(current.symbolCode, dict.weather as Record<string, string>);
  const windDirLabel = getWindDir(current.windDirection);
  const weekForecast = daily.map((d) => `${d.dayName}: ${d.tempMin}°C — ${d.tempMax}°C`).join(". ");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t(dict.city.faqQ1, { city: city.name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(dict.city.faqA1, { city: city.name, temp: current.temperature, desc: descTranslated.toLowerCase(), humidity: current.humidity, wind: current.windSpeed, windDir: windDirLabel }),
        },
      },
      {
        "@type": "Question",
        name: t(dict.city.faqQ2, { city: city.name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(dict.city.faqA2, { city: city.name, weekForecast }),
        },
      },
      {
        "@type": "Question",
        name: t(dict.city.faqQ3, { city: city.name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(dict.city.faqA3, { city: city.name, country: countryName, temp: current.temperature, feelsLike: current.feelsLike, high: daily[0]?.tempMax ?? "", low: daily[0]?.tempMin ?? "" }),
        },
      },
      {
        "@type": "Question",
        name: t(dict.city.faqQ4, { city: city.name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: daily[0]?.precipitation > 0
            ? t(dict.city.faqA4Yes, { amount: daily[0].precipitation, city: city.name })
            : t(dict.city.faqA4No, { city: city.name }),
        },
      },
      {
        "@type": "Question",
        name: t(dict.city.faqQ5, { city: city.name }),
        acceptedAnswer: {
          "@type": "Answer",
          text: t(dict.city.faqA5, { city: city.name, humidity: current.humidity, pressure: current.pressure }),
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://afriweather.io" },
      { "@type": "ListItem", position: 2, name: country?.name || city.countryName, item: `https://afriweather.io/${lang}/${countrySlug}` },
      { "@type": "ListItem", position: 3, name: city.name, item: `https://afriweather.io/${lang}/weather/${countrySlug}/${city.slug}` },
    ],
  };

  const placeSchema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${city.name}, ${country?.name || city.countryName}`,
    geo: { "@type": "GeoCoordinates", latitude: city.latitude, longitude: city.longitude },
    address: { "@type": "PostalAddress", addressRegion: city.province || "", addressCountry: country ? getISOFromFlag(country.flag) : "" },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([faqSchema, breadcrumbSchema, placeSchema]),
        }}
      />

      <section
        className={`atmosphere grain relative bg-gradient-to-br ${gradient} overflow-hidden`}
      >
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-30%] right-[-5%] w-[400px] h-[400px] rounded-full bg-black/[0.08] blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-8 sm:pt-8 sm:pb-12 md:pt-8 md:pb-14">
          <CurrentWeather {...current} cityName={city.name} countryName={countryName} timezone={getTimezone(countrySlug)} />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        <ForecastTabs
          daily={daily}
          hourly={hourly}
          dayDetails={dayDetails}
          graphData={graphData}
          cityName={city.name}
          lat={city.latitude}
          lon={city.longitude}
        />

        <section>
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] mb-4">
            {dict.city.weatherInToday.replace("{city}", city.name)}
          </h2>
          <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm p-5 sm:p-6 space-y-4">
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
              {t(dict.city.locatedIn, { city: city.name, province: city.province || countryName, country: countryName, lat: Math.abs(city.latitude).toFixed(2), latDir: city.latitude < 0 ? "S" : "N", lon: Math.abs(city.longitude).toFixed(2), lonDir: city.longitude < 0 ? "W" : "E" })}{" "}
              {t(dict.city.currentlyShowing, { desc: descTranslated.toLowerCase(), temp: current.temperature, feelsLike: current.feelsLike })}
            </p>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
              {t(dict.city.todayRange, { city: city.name, min: daily[0]?.tempMin ?? "", max: daily[0]?.tempMax ?? "", humidity: current.humidity, wind: current.windSpeed, pressure: current.pressure, cloud: current.cloudCover })}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] mb-4">
            {dict.city.weatherFaq.replace("{city}", city.name)}
          </h2>
          <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
            {faqSchema.mainEntity.map(
              (
                item: { name: string; acceptedAnswer: { text: string } },
                i: number
              ) => (
                <details
                  key={i}
                  className={`group ${
                    i !== faqSchema.mainEntity.length - 1
                      ? "border-b border-[var(--border-subtle)]"
                      : ""
                  }`}
                >
                  <summary className="px-5 py-4 text-[14px] font-semibold text-[var(--text-primary)] cursor-pointer flex items-center justify-between gap-4 hover:bg-gray-50/50 active:bg-gray-50 transition-colors touch-manipulation">
                    <span>{item.name}</span>
                    <svg
                      className="faq-chevron w-4 h-4 text-[var(--text-tertiary)] shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4">
                    <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
                      {item.acceptedAnswer.text}
                    </p>
                  </div>
                </details>
              )
            )}
          </div>
        </section>

        <CityGrid
          cities={nearby}
          title={dict.city.weatherNear.replace("{city}", city.name)}
          showProvince
          lang={lang}
        />

        <nav
          className="flex items-center gap-2 text-[13px] text-[var(--text-tertiary)] pt-4 border-t border-[var(--border-subtle)]"
          aria-label="Breadcrumb"
        >
          <Link href={`/${lang}`} className="hover:text-[var(--text-primary)] transition-colors">
            {dict.breadcrumb.home}
          </Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/${lang}/${countrySlug}`} className="hover:text-[var(--text-primary)] transition-colors">
            {countryName}
          </Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[var(--text-primary)] font-medium">
            {city.name}
          </span>
        </nav>
      </div>
    </div>
  );
}

function getWindDir(degrees: number): string {
  const directions = [
    "north", "northeast", "east", "southeast",
    "south", "southwest", "west", "northwest",
  ];
  return directions[Math.round(degrees / 45) % 8];
}

function t(template: string, vars: Record<string, string | number>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{${key}}`, String(value));
  }
  return result;
}
