import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchWeather,
  getCurrentWeather,
  getHourlyForecast,
  getDailyForecast,
  getWeatherGradient,
  getDayDetails,
  getGraphData,
} from "@/lib/weather";
import { CurrentWeather } from "@/components/weather/current-weather";
import { ForecastTabs } from "@/components/weather/forecast-tabs";

interface WeatherPageProps {
  searchParams: Promise<{ lat?: string; lon?: string; name?: string }>;
}

export async function generateMetadata({
  searchParams,
}: WeatherPageProps): Promise<Metadata> {
  const { lat, lon, name } = await searchParams;
  if (!lat || !lon) return { title: "Weather — AfriWeather" };

  const placeName = name || `${lat}, ${lon}`;
  let temp = "";

  try {
    const data = await fetchWeather(parseFloat(lat), parseFloat(lon));
    const current = getCurrentWeather(data);
    if (current) temp = `${current.temperature}°C`;
  } catch {}

  return {
    title: `${placeName} Weather${temp ? ` ${temp}` : ""} — Today's Forecast`,
    description: `Current weather in ${placeName}. Hourly and 7-day forecast updated every 30 minutes.`,
    robots: { index: false, follow: true },
  };
}

export default async function WeatherPage({ searchParams }: WeatherPageProps) {
  const { lat: latStr, lon: lonStr, name } = await searchParams;

  if (!latStr || !lonStr) notFound();

  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  if (isNaN(lat) || isNaN(lon)) notFound();

  const placeName = name ? decodeURIComponent(name) : `${lat.toFixed(2)}, ${lon.toFixed(2)}`;

  const data = await fetchWeather(lat, lon);
  const current = getCurrentWeather(data);
  const hourly = getHourlyForecast(data);
  const daily = getDailyForecast(data);
  const dayDetails = getDayDetails(data);
  const graphData = getGraphData(data);

  if (!current) notFound();

  const gradient = getWeatherGradient(current.symbolCode, current.temperature);

  return (
    <div>
      {/* Atmospheric hero */}
      <section
        className={`atmosphere grain relative bg-gradient-to-br ${gradient} overflow-hidden`}
      >
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-30%] right-[-5%] w-[400px] h-[400px] rounded-full bg-black/[0.08] blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-10 sm:pt-8 sm:pb-14">
          <CurrentWeather {...current} cityName={placeName} />
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        <ForecastTabs
          daily={daily}
          hourly={hourly}
          dayDetails={dayDetails}
          graphData={graphData}
          cityName={placeName}
          lat={lat}
          lon={lon}
        />

        {/* About section */}
        <section>
          <h2 className="text-[17px] font-bold text-[var(--text-primary)] mb-4">
            Weather in {placeName} Today
          </h2>
          <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm p-5 sm:p-6 space-y-4">
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
              {placeName} is located at coordinates {Math.abs(lat).toFixed(2)}&deg;{lat < 0 ? "S" : "N"},{" "}
              {Math.abs(lon).toFixed(2)}&deg;{lon < 0 ? "W" : "E"}. Right now the weather
              shows {current.description.toLowerCase()} with a temperature of{" "}
              {current.temperature}&deg;C, feeling like {current.feelsLike}&deg;C.
            </p>
            <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
              Today&apos;s forecast shows temperatures from {daily[0]?.tempMin}&deg;C
              to {daily[0]?.tempMax}&deg;C. Humidity is at {current.humidity}% with
              winds at {current.windSpeed} km/h. Pressure is {current.pressure} hPa
              with {current.cloudCover}% cloud cover.
            </p>
          </div>
        </section>

        {/* Breadcrumb nav */}
        <nav
          className="flex items-center gap-2 text-[13px] text-[var(--text-tertiary)] pt-4 border-t border-[var(--border-subtle)]"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
            Home
          </Link>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[var(--text-primary)] font-medium">
            {placeName}
          </span>
        </nav>
      </div>
    </div>
  );
}
