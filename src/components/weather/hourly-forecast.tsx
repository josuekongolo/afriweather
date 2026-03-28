"use client";

import { HourlyForecast as HourlyForecastType } from "@/lib/types";
import { getWeatherEmoji } from "@/lib/weather";

interface HourlyForecastProps {
  hours: HourlyForecastType[];
}

export function HourlyForecast({ hours }: HourlyForecastProps) {
  return (
    <section>
      <h2 className="text-[17px] font-bold text-[var(--text-primary)] mb-4">
        Hourly Forecast
      </h2>
      <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div
            className="flex px-2 py-4 gap-0"
            style={{ minWidth: "max-content" }}
          >
            {hours.map((hour, i) => (
              <div
                key={hour.time}
                className={`flex flex-col items-center px-3.5 py-2 min-w-[68px] rounded-xl transition-colors ${
                  i === 0
                    ? "bg-blue-50/80"
                    : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`text-[12px] font-semibold mb-2 ${
                    i === 0
                      ? "text-blue-600"
                      : "text-[var(--text-tertiary)]"
                  }`}
                >
                  {i === 0 ? "Now" : hour.hour}
                </span>
                <span className="text-[22px] leading-none mb-2">
                  {getWeatherEmoji(hour.symbolCode)}
                </span>
                <span
                  className={`text-[14px] font-bold tabular-nums ${
                    i === 0
                      ? "text-blue-700"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {hour.temp}°
                </span>
                {hour.precipitation > 0 && (
                  <div className="flex items-center gap-0.5 mt-1.5">
                    <svg
                      className="w-2.5 h-2.5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2c0 0-8 9.5-8 14a8 8 0 0016 0C20 11.5 12 2 12 2z" />
                    </svg>
                    <span className="text-[10px] font-semibold text-blue-500">
                      {hour.precipitation}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
