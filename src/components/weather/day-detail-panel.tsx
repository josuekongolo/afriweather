"use client";

import type { DayDetail } from "@/lib/types";
import { getWeatherEmoji, getWindDirectionLabel } from "@/lib/weather";
import { useDictionary } from "@/i18n/dictionary-provider";

interface DayDetailPanelProps {
  day: DayDetail;
}

export function DayDetailPanel({ day }: DayDetailPanelProps) {
  const { dict } = useDictionary();
  return (
    <div className="border-t border-b border-[var(--border-subtle)] bg-slate-50/80">
      <div className="px-3 sm:px-5 py-3">
        <p className="text-[13px] font-semibold text-[var(--text-primary)] mb-3">
          {day.dayLabel} &mdash; {dict.weather.hourlyBreakdown}
        </p>

        {/* Mobile: compact card per hour */}
        <div className="sm:hidden space-y-2">
          {day.hours.map((h) => (
            <div
              key={h.time}
              className="flex items-center gap-2 bg-white/70 rounded-lg px-3 py-2"
            >
              <span className="text-[12px] font-semibold text-[var(--text-secondary)] w-10 shrink-0">
                {h.hour}
              </span>
              <span className="text-base shrink-0">
                {getWeatherEmoji(h.symbolCode)}
              </span>
              <span className="text-[13px] font-bold text-[var(--text-primary)] tabular-nums w-8 shrink-0">
                {h.temp}&deg;
              </span>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-[var(--text-tertiary)] min-w-0">
                <span>{dict.weather.feelsShort} {h.feelsLike}&deg;</span>
                <span>{h.windSpeed} m/s {getWindDirectionLabel(h.windDirection)}</span>
                <span>{h.humidity}%</span>
                {h.precipitation > 0 && (
                  <span className="text-blue-500 font-semibold">
                    {h.precipitation}mm
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: full table */}
        <div className="hidden sm:block overflow-x-auto scrollbar-hide">
          <table className="w-full text-[12px]" style={{ minWidth: 600 }}>
            <thead>
              <tr className="text-[var(--text-tertiary)] font-semibold uppercase tracking-wider">
                <th className="text-left py-1.5 pr-2">{dict.weather.time}</th>
                <th className="text-center py-1.5 px-1">{dict.weather.forecast}</th>
                <th className="text-right py-1.5 px-2">{dict.weather.temp}</th>
                <th className="text-right py-1.5 px-2">{dict.weather.feelsShort}</th>
                <th className="text-right py-1.5 px-2">{dict.weather.precip}</th>
                <th className="text-right py-1.5 px-2">{dict.weather.wind}</th>
                <th className="text-right py-1.5 px-2">{dict.weather.humidity}</th>
                <th className="text-right py-1.5 px-2">{dict.weather.pressure}</th>
                <th className="text-right py-1.5 pl-2">{dict.weather.cloud}</th>
              </tr>
            </thead>
            <tbody>
              {day.hours.map((h) => (
                <tr
                  key={h.time}
                  className="border-t border-[var(--border-subtle)]/50 hover:bg-white/60 transition-colors"
                >
                  <td className="py-2 pr-2 font-semibold text-[var(--text-secondary)]">
                    {h.hour}
                  </td>
                  <td className="py-2 px-1 text-center">
                    <span className="text-base">
                      {getWeatherEmoji(h.symbolCode)}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right font-bold text-[var(--text-primary)] tabular-nums">
                    {h.temp}&deg;
                  </td>
                  <td className="py-2 px-2 text-right text-[var(--text-tertiary)] tabular-nums">
                    {h.feelsLike}&deg;
                  </td>
                  <td className="py-2 px-2 text-right tabular-nums">
                    {h.precipitation > 0 ? (
                      <span className="text-blue-500 font-semibold">
                        {h.precipitation}mm
                      </span>
                    ) : (
                      <span className="text-[var(--text-tertiary)]">
                        &mdash;
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-right text-[var(--text-secondary)] tabular-nums whitespace-nowrap">
                    {h.windSpeed} m/s{" "}
                    <span className="text-[var(--text-tertiary)]">
                      {getWindDirectionLabel(h.windDirection)}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right text-[var(--text-secondary)] tabular-nums">
                    {h.humidity}%
                  </td>
                  <td className="py-2 px-2 text-right text-[var(--text-secondary)] tabular-nums">
                    {h.pressure}
                  </td>
                  <td className="py-2 pl-2 text-right text-[var(--text-secondary)] tabular-nums">
                    {h.cloudCover}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
