import { getWeatherEmoji, getWindDirectionLabel } from "@/lib/weather";

interface CurrentWeatherProps {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  cloudCover: number;
  symbolCode: string;
  description: string;
  cityName: string;
  countryName?: string;
  timezone?: string;
  updatedAt: string;
}

export function CurrentWeather({
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  windDirection,
  pressure,
  cloudCover,
  symbolCode,
  description,
  cityName,
  countryName,
  timezone = "Africa/Johannesburg",
  updatedAt,
}: CurrentWeatherProps) {
  const emoji = getWeatherEmoji(symbolCode);
  const windDir = getWindDirectionLabel(windDirection);
  const updateTime = new Date(updatedAt).toLocaleTimeString("en-ZA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });
  const tzAbbr = new Date(updatedAt)
    .toLocaleTimeString("en-ZA", { timeZoneName: "short", timeZone: timezone })
    .split(" ")
    .pop() || "";

  return (
    <div className="text-white relative z-10">
      {/* City name shown in hero — breadcrumbs rendered by parent page */}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Left: City + Temp */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1">
            {cityName}
          </h1>
          <p className="text-white/50 text-[13px] sm:text-sm font-medium mb-4 sm:mb-6">
            {countryName || "Africa"} &middot; Updated {updateTime} {tzAbbr}
          </p>
          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="text-[64px] sm:text-[80px] md:text-[100px] font-bold leading-none tracking-tighter">
              {temperature}°
            </span>
            <span className="text-4xl sm:text-5xl md:text-6xl mb-1">{emoji}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
            <span className="text-base sm:text-lg font-medium text-white/90">
              {description}
            </span>
            <span className="text-[13px] sm:text-sm text-white/40">
              Feels like {feelsLike}°C
            </span>
          </div>
        </div>
      </div>

      {/* Detail cards — glass panels */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <GlassCard
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
          }
          label="Humidity"
          value={`${humidity}%`}
        />
        <GlassCard
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          }
          label="Wind"
          value={`${windSpeed} km/h ${windDir}`}
        />
        <GlassCard
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          }
          label="Pressure"
          value={`${pressure} hPa`}
        />
        <GlassCard
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
          }
          label="Cloud Cover"
          value={`${cloudCover}%`}
        />
      </div>
    </div>
  );
}

function GlassCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 sm:py-3.5">
      <div className="flex items-center gap-1.5 text-white/50 mb-1">
        {icon}
        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-[13px] sm:text-[15px] font-semibold text-white">{value}</p>
    </div>
  );
}
