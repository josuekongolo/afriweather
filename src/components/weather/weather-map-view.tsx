"use client";

import dynamic from "next/dynamic";

const WeatherMap = dynamic(() => import("./weather-map"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      <div className="h-[500px] flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-[13px] text-[var(--text-tertiary)]">Loading map...</p>
        </div>
      </div>
    </div>
  ),
});

interface WeatherMapViewProps {
  cityName: string;
  lat: number;
  lon: number;
}

export function WeatherMapView({ cityName, lat, lon }: WeatherMapViewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-[17px] font-bold text-[var(--text-primary)]">
        Map &mdash; {cityName}
      </h2>
      <WeatherMap cityName={cityName} lat={lat} lon={lon} />
    </div>
  );
}
