import Link from "next/link";
import { City } from "@/lib/types";
import { WeatherPreview } from "@/lib/weather";

interface CityGridProps {
  cities: City[];
  title?: string;
  showProvince?: boolean;
  weatherData?: Record<string, WeatherPreview>;
}

export function CityGrid({ cities, title, showProvince, weatherData }: CityGridProps) {
  return (
    <section>
      {title && (
        <h2 className="text-[17px] font-bold text-[var(--text-primary)] mb-4">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {cities.map((city) => {
          const weather = weatherData?.[city.slug];
          return (
            <Link
              key={city.slug}
              href={`/weather/${city.country}/${city.slug}`}
              className="group flex items-center justify-between rounded-xl bg-white border border-[var(--border-subtle)] px-4 py-3 card-lift"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center shrink-0 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors">
                  {weather ? (
                    <span className="text-lg leading-none">{weather.emoji}</span>
                  ) : (
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-[13px] font-semibold text-[var(--text-primary)] group-hover:text-blue-600 transition-colors block truncate">
                    {city.name}
                  </span>
                  {showProvince && city.province && (
                    <span className="text-[11px] text-[var(--text-tertiary)] block truncate">
                      {city.province}
                    </span>
                  )}
                </div>
              </div>
              {weather && (
                <span className="text-[15px] font-bold text-[var(--text-primary)] shrink-0 ml-3">
                  {weather.temperature}°
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
