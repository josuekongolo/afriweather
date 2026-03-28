"use client";

import { useState } from "react";
import type { DayDetail, GraphDataPoint, DailyForecast, HourlyForecast } from "@/lib/types";
import { ForecastView } from "./forecast-view";
import { DetailsView } from "./details-view";
import { WeatherMapView } from "./weather-map-view";

type Tab = "forecast" | "details" | "map";

interface ForecastTabsProps {
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  dayDetails: DayDetail[];
  graphData: GraphDataPoint[];
  cityName: string;
  lat: number;
  lon: number;
}

export function ForecastTabs({
  daily,
  hourly,
  dayDetails,
  graphData,
  cityName,
  lat,
  lon,
}: ForecastTabsProps) {
  const [tab, setTab] = useState<Tab>("forecast");

  const tabs: { id: Tab; label: string }[] = [
    { id: "forecast", label: "Forecast" },
    { id: "details", label: "Details" },
    { id: "map", label: "Map" },
  ];

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-all touch-manipulation ${
              tab === t.id
                ? "bg-white text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "forecast" && (
        <ForecastView daily={daily} hourly={hourly} dayDetails={dayDetails} graphData={graphData} />
      )}
      {tab === "details" && (
        <DetailsView dayDetails={dayDetails} graphData={graphData} />
      )}
      {tab === "map" && (
        <WeatherMapView cityName={cityName} lat={lat} lon={lon} />
      )}
    </div>
  );
}
