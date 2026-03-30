"use client";

import { useState } from "react";
import type { DailyForecast, HourlyForecast, DayDetail, GraphDataPoint } from "@/lib/types";
import { getWeatherEmoji } from "@/lib/weather";
import { useDictionary } from "@/i18n/dictionary-provider";
import { HourlyForecast as HourlyStrip } from "./hourly-forecast";
import { DayDetailPanel } from "./day-detail-panel";
import { WeatherGraph } from "./weather-graph";

interface ForecastViewProps {
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  dayDetails: DayDetail[];
  graphData: GraphDataPoint[];
}

export function ForecastView({ daily, hourly, dayDetails, graphData }: ForecastViewProps) {
  const [mode, setMode] = useState<"table" | "graph">("table");
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const { dict } = useDictionary();

  const allTemps = daily.flatMap((d) => [d.tempMax, d.tempMin]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = globalMax - globalMin || 1;

  return (
    <div className="space-y-6">
      <HourlyStrip hours={hourly} />

      {/* Table / Graph Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
          {dict.weather.sevenDayForecast}
        </h2>
        <div className="flex items-center gap-1 p-0.5 bg-gray-100 rounded-lg">
          <button
            onClick={() => setMode("table")}
            className={`px-3 py-2 text-[12px] font-semibold rounded-md transition-all touch-manipulation ${
              mode === "table"
                ? "bg-white text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-tertiary)]"
            }`}
          >
            {dict.weather.table}
          </button>
          <button
            onClick={() => setMode("graph")}
            className={`px-3 py-2 text-[12px] font-semibold rounded-md transition-all touch-manipulation ${
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
        <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
          {/* Column headers — desktop only */}
          <div className="hidden sm:grid grid-cols-[80px_32px_80px_80px_1fr_48px_48px] gap-2 px-5 py-2 text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider border-b border-[var(--border-subtle)]">
            <span>{dict.weather.day}</span>
            <span />
            <span className="text-center">{dict.weather.nightMorn}</span>
            <span className="text-center">{dict.weather.aftnEve}</span>
            <span className="text-center">{dict.weather.temperature}</span>
            <span className="text-right">{dict.weather.rain}</span>
            <span className="text-right">{dict.weather.wind}</span>
          </div>

          {daily.map((day, i) => {
            const detail = dayDetails.find((d) => d.date === day.date);
            const isExpanded = expandedDay === day.date;
            const leftPct = ((day.tempMin - globalMin) / range) * 100;
            const widthPct = ((day.tempMax - day.tempMin) / range) * 100;

            return (
              <div key={day.date}>
                <button
                  onClick={() =>
                    setExpandedDay(isExpanded ? null : day.date)
                  }
                  className={`w-full px-3 sm:px-5 py-3.5 sm:py-3.5 touch-manipulation transition-colors ${
                    i !== daily.length - 1 && !isExpanded
                      ? "border-b border-[var(--border-subtle)]"
                      : ""
                  } ${isExpanded ? "bg-blue-50/50" : "hover:bg-gray-50/50"}`}
                >
                  {/* Mobile layout */}
                  <div className="sm:hidden">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[13px] font-semibold w-12 shrink-0 text-left ${
                          i === 0 ? "text-blue-600" : "text-[var(--text-secondary)]"
                        }`}
                      >
                        {day.dayName}
                      </span>
                      <span className="text-[20px] w-7 text-center shrink-0 leading-none">
                        {getWeatherEmoji(day.symbolCode)}
                      </span>
                      <span className="text-[12px] text-[var(--text-tertiary)] w-7 text-right tabular-nums shrink-0">
                        {day.tempMin}&deg;
                      </span>
                      <div className="flex-1 h-[5px] bg-gray-100 rounded-full relative mx-0.5 min-w-[40px]">
                        <div
                          className="absolute h-full rounded-full temp-bar"
                          style={{
                            left: `${leftPct}%`,
                            width: `${Math.max(widthPct, 12)}%`,
                            background: "linear-gradient(90deg, #60a5fa, #fbbf24, #f97316)",
                          }}
                        />
                      </div>
                      <span className="text-[12px] font-bold text-[var(--text-primary)] w-7 tabular-nums shrink-0">
                        {day.tempMax}&deg;
                      </span>
                      {day.precipitation > 0 && (
                        <span className="text-[10px] font-semibold text-blue-500 tabular-nums shrink-0">
                          {day.precipitation}mm
                        </span>
                      )}
                      <svg
                        className={`w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
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
                    </div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:flex items-center gap-3">
                    <span
                      className={`text-[13px] font-semibold w-14 shrink-0 text-left ${
                        i === 0 ? "text-blue-600" : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {day.dayName}
                    </span>

                    <span className="text-[22px] w-8 text-center shrink-0 leading-none">
                      {getWeatherEmoji(day.symbolCode)}
                    </span>

                    {detail && (
                      <div className="flex gap-1 w-20 shrink-0 justify-center">
                        <span className="text-sm" title="Night">{getWeatherEmoji(detail.periodSymbols.night)}</span>
                        <span className="text-sm" title="Morning">{getWeatherEmoji(detail.periodSymbols.morning)}</span>
                      </div>
                    )}
                    {detail && (
                      <div className="flex gap-1 w-20 shrink-0 justify-center">
                        <span className="text-sm" title="Afternoon">{getWeatherEmoji(detail.periodSymbols.afternoon)}</span>
                        <span className="text-sm" title="Evening">{getWeatherEmoji(detail.periodSymbols.evening)}</span>
                      </div>
                    )}

                    <span className="text-[13px] text-[var(--text-tertiary)] w-8 text-right tabular-nums shrink-0 font-medium">
                      {day.tempMin}&deg;
                    </span>

                    <div className="flex-1 h-[6px] bg-gray-100 rounded-full relative mx-1">
                      <div
                        className="absolute h-full rounded-full temp-bar"
                        style={{
                          left: `${leftPct}%`,
                          width: `${Math.max(widthPct, 10)}%`,
                          background: "linear-gradient(90deg, #60a5fa, #fbbf24, #f97316)",
                        }}
                      />
                    </div>

                    <span className="text-[13px] font-bold text-[var(--text-primary)] w-8 tabular-nums shrink-0">
                      {day.tempMax}&deg;
                    </span>

                    <div className="w-12 shrink-0 text-right">
                      {day.precipitation > 0 && (
                        <span className="text-[11px] font-semibold text-blue-500 tabular-nums">
                          {day.precipitation}mm
                        </span>
                      )}
                    </div>

                    {detail && (
                      <span className="text-[11px] text-[var(--text-tertiary)] w-10 text-right tabular-nums shrink-0">
                        {Math.round(detail.maxWind * 3.6)} km/h
                      </span>
                    )}

                    <svg
                      className={`w-4 h-4 text-[var(--text-tertiary)] shrink-0 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
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
                  </div>
                </button>

                {isExpanded && detail && (
                  <DayDetailPanel day={detail} />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <WeatherGraph data={graphData} variant="simple" />
      )}
    </div>
  );
}
