import { DailyForecast as DailyForecastType } from "@/lib/types";
import { getWeatherEmoji } from "@/lib/weather";

interface DailyForecastProps {
  days: DailyForecastType[];
}

export function DailyForecast({ days }: DailyForecastProps) {
  const allTemps = days.flatMap((d) => [d.tempMax, d.tempMin]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = globalMax - globalMin || 1;

  return (
    <section>
      <h2 className="text-[17px] font-bold text-[var(--text-primary)] mb-4">
        7-Day Forecast
      </h2>
      <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
        {days.map((day, i) => {
          const leftPct = ((day.tempMin - globalMin) / range) * 100;
          const widthPct = ((day.tempMax - day.tempMin) / range) * 100;

          return (
            <div
              key={day.date}
              className={`flex items-center px-4 sm:px-5 py-3.5 gap-3 ${
                i !== days.length - 1
                  ? "border-b border-[var(--border-subtle)]"
                  : ""
              } ${i === 0 ? "bg-blue-50/40" : "hover:bg-gray-50/50"} transition-colors`}
            >
              <span
                className={`text-[13px] font-semibold w-10 shrink-0 ${
                  i === 0
                    ? "text-blue-600"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {day.dayName}
              </span>

              <span className="text-[22px] w-8 text-center shrink-0 leading-none">
                {getWeatherEmoji(day.symbolCode)}
              </span>

              {/* Rain indicator */}
              <div className="w-12 shrink-0 flex items-center justify-end">
                {day.precipitation > 0 ? (
                  <div className="flex items-center gap-0.5">
                    <svg
                      className="w-3 h-3 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2c0 0-8 9.5-8 14a8 8 0 0016 0C20 11.5 12 2 12 2z" />
                    </svg>
                    <span className="text-[11px] font-semibold text-blue-500 tabular-nums">
                      {day.precipitation}mm
                    </span>
                  </div>
                ) : null}
              </div>

              <span className="text-[13px] text-[var(--text-tertiary)] w-8 text-right tabular-nums shrink-0 font-medium">
                {day.tempMin}°
              </span>

              {/* Temperature bar */}
              <div className="flex-1 h-[6px] bg-gray-100 rounded-full relative mx-1">
                <div
                  className="absolute h-full rounded-full temp-bar"
                  style={{
                    left: `${leftPct}%`,
                    width: `${Math.max(widthPct, 10)}%`,
                    background: `linear-gradient(90deg, #60a5fa ${0}%, #fbbf24 ${50}%, #f97316 ${100}%)`,
                  }}
                />
              </div>

              <span className="text-[13px] font-bold text-[var(--text-primary)] w-8 tabular-nums shrink-0">
                {day.tempMax}°
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
