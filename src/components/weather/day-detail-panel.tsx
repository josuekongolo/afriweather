"use client";

import type { DayDetail } from "@/lib/types";
import { getWeatherEmoji, getWindDirectionLabel } from "@/lib/weather";

interface DayDetailPanelProps {
  day: DayDetail;
}

export function DayDetailPanel({ day }: DayDetailPanelProps) {
  return (
    <div className="border-t border-b border-[var(--border-subtle)] bg-slate-50/80">
      <div className="px-3 sm:px-5 py-3">
        <p className="text-[13px] font-semibold text-[var(--text-primary)] mb-3">
          {day.dayLabel} &mdash; Hourly Breakdown
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
                <span>Feels {h.feelsLike}&deg;</span>
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
                <th className="text-left py-1.5 pr-2">Time</th>
                <th className="text-center py-1.5 px-1">Weather</th>
                <th className="text-right py-1.5 px-2">Temp</th>
                <th className="text-right py-1.5 px-2">Feels</th>
                <th className="text-right py-1.5 px-2">Precip.</th>
                <th className="text-right py-1.5 px-2">Wind</th>
                <th className="text-right py-1.5 px-2">Humidity</th>
                <th className="text-right py-1.5 px-2">Pressure</th>
                <th className="text-right py-1.5 pl-2">Cloud</th>
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
