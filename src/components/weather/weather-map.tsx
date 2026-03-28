"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { getNearbyCities, getCityBySlug, southAfricaCities } from "@/lib/cities";

// Fix Leaflet default marker icon
const defaultIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#3b82f6,#06b6d4);border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

const nearbyIcon = L.divIcon({
  className: "",
  html: `<div style="width:18px;height:18px;background:#64748b;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.15);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -9],
});

interface WeatherMapProps {
  cityName: string;
  lat: number;
  lon: number;
}

export default function WeatherMap({ cityName, lat, lon }: WeatherMapProps) {
  // Find nearby cities
  const city = southAfricaCities.find(
    (c) => Math.abs(c.latitude - lat) < 0.01 && Math.abs(c.longitude - lon) < 0.01
  );
  const nearby = city ? getNearbyCities(city, 10) : [];

  const [precipLayer, setPrecipLayer] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-[var(--border-subtle)] shadow-sm overflow-hidden">
      {/* Layer toggle */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border-subtle)] bg-gray-50/50">
        <span className="text-[12px] font-semibold text-[var(--text-tertiary)]">
          Layers:
        </span>
        <button
          onClick={() => setPrecipLayer(!precipLayer)}
          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
            precipLayer
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-[var(--text-tertiary)]"
          }`}
        >
          Precipitation
        </button>
      </div>

      <div style={{ height: 500 }}>
        <MapContainer
          center={[lat, lon]}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Precipitation layer from MET Norway */}
          {precipLayer && (
            <TileLayer
              url="https://api.met.no/weatherapi/radar/2.0/reflectivity_composite/latest.png?area=south_africa&content=animation&type=5level_reflectivity"
              opacity={0.5}
            />
          )}

          {/* Main city marker */}
          <Marker position={[lat, lon]} icon={defaultIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-sm">{cityName}</p>
                <p className="text-xs text-gray-500">South Africa</p>
              </div>
            </Popup>
          </Marker>

          {/* Nearby city markers */}
          {nearby.map((c) => (
            <Marker
              key={c.slug}
              position={[c.latitude, c.longitude]}
              icon={nearbyIcon}
            >
              <Popup>
                <div className="text-center">
                  <a
                    href={`/weather/south-africa/${c.slug}`}
                    className="font-semibold text-sm text-blue-600 hover:underline"
                  >
                    {c.name}
                  </a>
                  <p className="text-xs text-gray-500">{c.province}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
