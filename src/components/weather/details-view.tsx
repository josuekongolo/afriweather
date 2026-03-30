"use client";

import { useState } from "react";
import type { DayDetail, GraphDataPoint } from "@/lib/types";
import { getWeatherEmoji, getWindDirectionLabel } from "@/lib/weather";
import { useDictionary } from "@/i18n/dictionary-provider";
import { WeatherGraph } from "./weather-graph";

interface DetailsViewProps {
  dayDetails: DayDetail[];
  graphData: GraphDataPoint[];
}

function UvBadge({ uv }: { uv: number }) {
  if (uv <= 0) return <span className="text-[var(--text-tertiary)]">0</span>;
  const color =
    uv >= 8
      ? "text-red-600"
      : uv >= 6
      ? "text-orange-500"
      : uv >= 3
      ? "text-amber-500"
      : "text-green-600";
  return <span className={`font-semibold ${color}`}>{uv}</span>;
}

export function DetailsView({ dayDetails, graphData }: DetailsViewProps) {
  const [mode, setMode] = useState<"table" | "graph">("table");
  const { dict } = useDictionary();

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
          {dict.weather.detailedForecast}
        </h2>
        <div className="flex items-center gap-1 p-0.5 bg-gray-100 rounded-lg">
          <button
            onClick={() => setMode("table")}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-all ${
              mode === "table"
                ? "bg-white text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-tertiary)]"
            }`}
          >
            {dict.weather.table}
          </button>
          <button
            onClick={() => setMode("graph")}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-all ${
              mode === "graph"
                ? "bg-white text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-tertiary)]"
            }`}
          >
            {dict.weather.graph}
          </button>
        </div>
      </div>

      {mode === "table" ? (
        <div className="space-y-6">
          {dayDetails.map((day) => (
            <div key={day.date}>
              <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-3">
                {day.dayLabel}
              </h3>

              {/* Mobile: compact hour cards */}
              <div className="sm:hidden space-y-1.5">
                {day.hours.map((h) => (
                  <div
                    key={h.time}
                    className="bg-white rounded-xl border border-[var(--border-subtle)] px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[12px] font-bold text-[var(--text-secondary)] w-10">
                        {h.hour}
                      </span>
                      <span className="text-lg">{getWeatherEmoji(h.symbolCode)}</span>
                      <span
                        className={`text-[15px] font-bold tabular-nums ${
                          h.temp >= 25
                            ? "text-red-600"
                            : h.temp <= 5
                            ? "text-blue-600"
                            : "text-[var(--text-primary)]"
                        }`}
                      >
                        {h.temp}&deg;
                      </span>
                      <span className="text-[11px] text-[var(--text-tertiary)] tabular-nums">
                        {dict.weather.feelsShort} {h.feelsLike}&deg;
                      </span>
                      {h.precipitation > 0 && (
                        <span className="text-[11px] font-semibold text-blue-600 ml-auto tabular-nums">
                          {h.precipitation}mm
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-[var(--text-tertiary)]">
                      <span>
                        {dict.weather.wind} {h.windSpeed} m/s {getWindDirectionLabel(h.windDirection)}
                      </span>
                      <span>{dict.weather.humidity} {h.humidity}%</span>
                      <span>{h.pressure} hPa</span>
                      <span>{dict.weather.cloud} {h.cloudCover}%</span>
                      <span>{dict.weather.dew} {h.dewPoint}&deg;</span>
                      <span>
                        UV <UvBadge uv={h.uvIndex} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: full table */}
              <div className="hidden sm:block bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="w-full text-[12px]" style={{ minWidth: 800 }}>
                    <thead>
                      <tr className="text-[var(--text-tertiary)] text-[11px] font-semibold uppercase tracking-wider border-b border-[var(--border-subtle)]">
                        <th className="text-left py-2.5 px-4">{dict.weather.time}</th>
                        <th className="text-center py-2.5 px-2">{dict.weather.forecast}</th>
                        <th className="text-right py-2.5 px-2">{dict.weather.temp}</th>
                        <th className="text-right py-2.5 px-2">{dict.weather.feelsShort}</th>
                        <th className="text-right py-2.5 px-2">{dict.weather.dewPoint}</th>
                        <th className="text-right py-2.5 px-2">{dict.weather.precipMm}</th>
                        <th className="text-right py-2.5 px-2">{dict.weather.windMs}</th>
                        <th className="text-right py-2.5 px-2">{dict.weather.pressureHpa}</th>
                        <th className="text-right py-2.5 px-2">{dict.weather.humidityPercent}</th>
                        <th className="text-right py-2.5 px-2">{dict.weather.cloudPercent}</th>
                        <th className="text-right py-2.5 px-4">{dict.weather.uv}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.hours.map((h, i) => (
                        <tr
                          key={h.time}
                          className={`hover:bg-blue-50/30 transition-colors ${
                            i !== day.hours.length - 1
                              ? "border-b border-[var(--border-subtle)]/50"
                              : ""
                          }`}
                        >
                          <td className="py-2.5 px-4 font-semibold text-[var(--text-secondary)]">
                            {h.hour}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className="text-base">
                              {getWeatherEmoji(h.symbolCode)}
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right font-bold text-[var(--text-primary)] tabular-nums">
                            <span
                              className={
                                h.temp >= 25
                                  ? "text-red-600"
                                  : h.temp <= 5
                                  ? "text-blue-600"
                                  : ""
                              }
                            >
                              {h.temp}&deg;
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right text-[var(--text-secondary)] tabular-nums">
                            <span
                              className={
                                h.feelsLike >= 25
                                  ? "text-red-500"
                                  : h.feelsLike <= 5
                                  ? "text-blue-500"
                                  : ""
                              }
                            >
                              {h.feelsLike}&deg;
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right text-[var(--text-tertiary)] tabular-nums">
                            {h.dewPoint}&deg;
                          </td>
                          <td className="py-2.5 px-2 text-right tabular-nums">
                            {h.precipitation > 0 ? (
                              <span className="text-blue-600 font-semibold">
                                {h.precipitation}
                              </span>
                            ) : (
                              <span className="text-[var(--text-tertiary)]">
                                &mdash;
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 text-right tabular-nums whitespace-nowrap">
                            <span className="text-[var(--text-secondary)]">
                              {h.windSpeed}
                            </span>{" "}
                            <span
                              className="inline-block text-[var(--text-tertiary)]"
                              style={{
                                transform: `rotate(${h.windDirection + 180}deg)`,
                              }}
                            >
                              &uarr;
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-right text-[var(--text-secondary)] tabular-nums">
                            {h.pressure}
                          </td>
                          <td className="py-2.5 px-2 text-right text-[var(--text-secondary)] tabular-nums">
                            {h.humidity}
                          </td>
                          <td className="py-2.5 px-2 text-right text-[var(--text-secondary)] tabular-nums">
                            {h.cloudCover}
                          </td>
                          <td className="py-2.5 px-4 text-right tabular-nums">
                            <UvBadge uv={h.uvIndex} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <WeatherGraph data={graphData} variant="detailed" />
      )}
    </div>
  );
}
