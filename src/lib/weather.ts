import {
  WeatherData,
  TimeseriesEntry,
  HourlyForecast,
  DailyForecast,
  DetailedHourly,
  DayDetail,
  GraphDataPoint,
} from "./types";

const USER_AGENT = "afriweather/1.0 github.com/afriweather";

const localeMap: Record<string, string> = {
  en: "en-ZA",
  fr: "fr-FR",
  ar: "ar-EG",
  pt: "pt-PT",
  sw: "sw-KE",
};

function getLocaleCode(locale?: string): string {
  return (locale && localeMap[locale]) || "en-ZA";
}

export async function fetchWeather(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }

  return res.json();
}

export function getCurrentWeather(data: WeatherData) {
  const now = data.properties.timeseries[0];
  if (!now) return null;

  const details = now.data.instant.details;
  const symbol =
    now.data.next_1_hours?.summary.symbol_code ||
    now.data.next_6_hours?.summary.symbol_code ||
    "cloudy";

  return {
    temperature: Math.round(details.air_temperature),
    feelsLike: Math.round(
      details.air_temperature -
        0.4 * (details.air_temperature - 10) * (1 - details.relative_humidity / 100)
    ),
    humidity: Math.round(details.relative_humidity),
    windSpeed: Math.round(details.wind_speed * 3.6),
    windDirection: details.wind_from_direction,
    pressure: Math.round(details.air_pressure_at_sea_level),
    cloudCover: Math.round(details.cloud_area_fraction),
    symbolCode: symbol,
    description: getWeatherDescription(symbol),
    updatedAt: now.time,
  };
}

export function getHourlyForecast(
  data: WeatherData,
  hours = 24,
  timezone = "Africa/Johannesburg",
  locale?: string
): HourlyForecast[] {
  const lc = getLocaleCode(locale);
  const now = new Date();
  return data.properties.timeseries
    .filter((entry) => new Date(entry.time) >= now)
    .slice(0, hours)
    .map((entry) => ({
      time: entry.time,
      hour: new Date(entry.time).toLocaleTimeString(lc, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone,
      }),
      temp: Math.round(entry.data.instant.details.air_temperature),
      symbolCode:
        entry.data.next_1_hours?.summary.symbol_code ||
        entry.data.next_6_hours?.summary.symbol_code ||
        "cloudy",
      windSpeed: Math.round(entry.data.instant.details.wind_speed * 3.6),
      windDirection: entry.data.instant.details.wind_from_direction,
      precipitation:
        entry.data.next_1_hours?.details.precipitation_amount || 0,
      humidity: Math.round(entry.data.instant.details.relative_humidity),
    }));
}

export function getDailyForecast(data: WeatherData, timezone = "Africa/Johannesburg", todayLabel = "Today", locale?: string): DailyForecast[] {
  const dailyMap = new Map<
    string,
    { temps: number[]; symbols: string[]; precip: number }
  >();

  for (const entry of data.properties.timeseries) {
    const date = entry.time.split("T")[0];
    if (!dailyMap.has(date)) {
      dailyMap.set(date, { temps: [], symbols: [], precip: 0 });
    }
    const day = dailyMap.get(date)!;
    day.temps.push(entry.data.instant.details.air_temperature);

    const symbol =
      entry.data.next_6_hours?.summary.symbol_code ||
      entry.data.next_1_hours?.summary.symbol_code;
    if (symbol) day.symbols.push(symbol);

    day.precip +=
      entry.data.next_6_hours?.details.precipitation_amount ||
      entry.data.next_1_hours?.details.precipitation_amount ||
      0;
  }

  const days: DailyForecast[] = [];
  const today = new Date().toISOString().split("T")[0];
  const lc = getLocaleCode(locale);

  for (const [date, day] of dailyMap) {
    if (days.length >= 7) break;
    const d = new Date(date + "T12:00:00");
    days.push({
      date,
      dayName:
        date === today
          ? todayLabel
          : d.toLocaleDateString(lc, {
              weekday: "short",
              timeZone: timezone,
            }),
      tempMax: Math.round(Math.max(...day.temps)),
      tempMin: Math.round(Math.min(...day.temps)),
      symbolCode: getMostFrequent(day.symbols) || "cloudy",
      precipitation: Math.round(day.precip * 10) / 10,
    });
  }

  return days;
}

function getMostFrequent(arr: string[]): string | undefined {
  const freq = new Map<string, number>();
  for (const item of arr) {
    freq.set(item, (freq.get(item) || 0) + 1);
  }
  let max = 0;
  let result: string | undefined;
  for (const [key, count] of freq) {
    if (count > max) {
      max = count;
      result = key;
    }
  }
  return result;
}

function computeFeelsLike(temp: number, humidity: number, windMs: number): number {
  if (temp >= 27 && humidity > 40) {
    return Math.round(
      temp - 0.4 * (temp - 10) * (1 - humidity / 100)
    );
  }
  if (temp <= 10 && windMs > 1.3) {
    const windKmh = windMs * 3.6;
    return Math.round(
      13.12 + 0.6215 * temp - 11.37 * Math.pow(windKmh, 0.16) + 0.3965 * temp * Math.pow(windKmh, 0.16)
    );
  }
  return Math.round(temp);
}

export function getDetailedHourly(data: WeatherData, timezone = "Africa/Johannesburg", todayLabel = "Today", locale?: string): DetailedHourly[] {
  const lc = getLocaleCode(locale);
  const today = new Date().toISOString().split("T")[0];

  return data.properties.timeseries.map((entry) => {
    const d = entry.data.instant.details;
    const t = new Date(entry.time);
    const dateStr = entry.time.split("T")[0];

    return {
      time: entry.time,
      hour: t.toLocaleTimeString(lc, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timezone,
      }),
      date: dateStr,
      dayLabel:
        dateStr === today
          ? todayLabel
          : t.toLocaleDateString(lc, {
              weekday: "long",
              day: "numeric",
              month: "short",
              timeZone: timezone,
            }),
      temp: Math.round(d.air_temperature),
      feelsLike: computeFeelsLike(d.air_temperature, d.relative_humidity, d.wind_speed),
      dewPoint: Math.round(d.dew_point_temperature ?? (d.air_temperature - (100 - d.relative_humidity) / 5)),
      symbolCode:
        entry.data.next_1_hours?.summary.symbol_code ||
        entry.data.next_6_hours?.summary.symbol_code ||
        "cloudy",
      windSpeed: Math.round(d.wind_speed * 10) / 10,
      windDirection: d.wind_from_direction,
      precipitation:
        entry.data.next_1_hours?.details.precipitation_amount || 0,
      humidity: Math.round(d.relative_humidity),
      pressure: Math.round(d.air_pressure_at_sea_level),
      cloudCover: Math.round(d.cloud_area_fraction),
      uvIndex: Math.round(d.ultraviolet_index_clear_sky ?? 0),
    };
  });
}

export function getDayDetails(data: WeatherData, timezone = "Africa/Johannesburg", todayLabel = "Today", locale?: string): DayDetail[] {
  const detailed = getDetailedHourly(data, timezone, todayLabel, locale);
  const grouped = new Map<string, DetailedHourly[]>();

  for (const h of detailed) {
    if (!grouped.has(h.date)) grouped.set(h.date, []);
    grouped.get(h.date)!.push(h);
  }

  const days: DayDetail[] = [];
  for (const [date, hours] of grouped) {
    if (days.length >= 10) break;

    const getSymbolForPeriod = (startH: number, endH: number) => {
      const periodHours = hours.filter((h) => {
        const hr = parseInt(h.hour.split(":")[0]);
        return hr >= startH && hr < endH;
      });
      const symbols = periodHours.map((h) => h.symbolCode).filter(Boolean);
      return getMostFrequent(symbols) || "cloudy";
    };

    days.push({
      date,
      dayLabel: hours[0].dayLabel,
      hours,
      periodSymbols: {
        night: getSymbolForPeriod(0, 6),
        morning: getSymbolForPeriod(6, 12),
        afternoon: getSymbolForPeriod(12, 18),
        evening: getSymbolForPeriod(18, 24),
      },
      tempMax: Math.max(...hours.map((h) => h.temp)),
      tempMin: Math.min(...hours.map((h) => h.temp)),
      totalPrecip: Math.round(hours.reduce((s, h) => s + h.precipitation, 0) * 10) / 10,
      maxWind: Math.max(...hours.map((h) => h.windSpeed)),
    });
  }

  return days;
}

export function getGraphData(data: WeatherData, timezone = "Africa/Johannesburg", todayLabel = "Today", locale?: string): GraphDataPoint[] {
  const detailed = getDetailedHourly(data, timezone, todayLabel, locale);
  let prevDate = "";

  return detailed.map((h) => {
    const isDayBoundary = h.date !== prevDate;
    prevDate = h.date;
    return {
      time: h.time,
      label: h.hour,
      temp: h.temp,
      dewPoint: h.dewPoint,
      precipitation: h.precipitation,
      wind: h.windSpeed,
      pressure: h.pressure,
      humidity: h.humidity,
      dayBoundary: isDayBoundary,
      dayLabel: isDayBoundary ? h.dayLabel : undefined,
    };
  });
}

export function getTranslatedDescription(
  symbolCode: string,
  weatherDict?: Record<string, string>
): string {
  const base = symbolCode.replace(/_day|_night|_polartwilight/g, "");
  if (weatherDict) {
    const key = base === "rain" ? "rain_desc" : base;
    if (weatherDict[key]) return weatherDict[key];
  }
  return getWeatherDescription(symbolCode);
}

export function getWeatherDescription(symbolCode: string): string {
  const base = symbolCode.replace(/_day|_night|_polartwilight/g, "");
  const descriptions: Record<string, string> = {
    clearsky: "Clear sky",
    fair: "Fair",
    partlycloudy: "Partly cloudy",
    cloudy: "Cloudy",
    lightrainshowers: "Light rain showers",
    rainshowers: "Rain showers",
    heavyrainshowers: "Heavy rain showers",
    lightrainshowersandthunder: "Light rain showers and thunder",
    rainshowersandthunder: "Rain showers and thunder",
    heavyrainshowersandthunder: "Heavy rain showers and thunder",
    lightrain: "Light rain",
    rain: "Rain",
    heavyrain: "Heavy rain",
    lightrainandthunder: "Light rain and thunder",
    rainandthunder: "Rain and thunder",
    heavyrainandthunder: "Heavy rain and thunder",
    lightsleetshowers: "Light sleet showers",
    sleetshowers: "Sleet showers",
    heavysleetshowers: "Heavy sleet showers",
    lightsleet: "Light sleet",
    sleet: "Sleet",
    heavysleet: "Heavy sleet",
    lightsnowshowers: "Light snow showers",
    snowshowers: "Snow showers",
    heavysnowshowers: "Heavy snow showers",
    lightsnow: "Light snow",
    snow: "Snow",
    heavysnow: "Heavy snow",
    fog: "Fog",
  };
  return descriptions[base] || "Cloudy";
}

export function getWindDirectionLabel(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

export function getWeatherGradient(symbolCode: string, temp: number): string {
  const base = symbolCode.replace(/_day|_night|_polartwilight/g, "");
  const isNight = symbolCode.includes("_night");

  if (isNight) {
    return "from-slate-900 via-indigo-950 to-slate-800";
  }

  if (base.includes("thunder")) {
    return "from-gray-800 via-purple-900 to-gray-700";
  }
  if (base.includes("heavyrain") || base.includes("heavysleet")) {
    return "from-gray-600 via-slate-700 to-gray-500";
  }
  if (base.includes("rain") || base.includes("sleet")) {
    return "from-slate-500 via-blue-600 to-slate-400";
  }
  if (base.includes("snow")) {
    return "from-blue-200 via-slate-300 to-blue-100";
  }
  if (base === "fog") {
    return "from-gray-400 via-gray-300 to-gray-400";
  }
  if (base === "cloudy") {
    return "from-gray-400 via-slate-500 to-gray-400";
  }
  if (base === "partlycloudy") {
    if (temp > 30) return "from-amber-400 via-orange-400 to-yellow-300";
    return "from-sky-400 via-blue-400 to-sky-300";
  }
  if (base === "clearsky" || base === "fair") {
    if (temp > 35) return "from-orange-500 via-amber-400 to-yellow-300";
    if (temp > 25) return "from-sky-400 via-blue-500 to-cyan-400";
    return "from-sky-500 via-blue-600 to-cyan-500";
  }

  return "from-sky-500 via-blue-500 to-cyan-400";
}

export interface WeatherPreview {
  temperature: number;
  symbolCode: string;
  emoji: string;
}

export async function fetchWeatherPreview(
  lat: number,
  lon: number
): Promise<WeatherPreview | null> {
  try {
    const data = await fetchWeather(lat, lon);
    const now = data.properties.timeseries[0];
    if (!now) return null;
    const temp = Math.round(now.data.instant.details.air_temperature);
    const symbol =
      now.data.next_1_hours?.summary.symbol_code ||
      now.data.next_6_hours?.summary.symbol_code ||
      "cloudy";
    return { temperature: temp, symbolCode: symbol, emoji: getWeatherEmoji(symbol) };
  } catch {
    return null;
  }
}

export async function fetchWeatherPreviews(
  cities: { slug: string; latitude: number; longitude: number }[]
): Promise<Record<string, WeatherPreview>> {
  const results = await Promise.allSettled(
    cities.map(async (city) => {
      const preview = await fetchWeatherPreview(city.latitude, city.longitude);
      return { slug: city.slug, preview };
    })
  );

  const map: Record<string, WeatherPreview> = {};
  for (const result of results) {
    if (result.status === "fulfilled" && result.value.preview) {
      map[result.value.slug] = result.value.preview;
    }
  }
  return map;
}

export function getWeatherEmoji(symbolCode: string): string {
  const base = symbolCode.replace(/_day|_night|_polartwilight/g, "");
  const isNight = symbolCode.includes("_night");

  if (base === "clearsky") return isNight ? "\u{1F319}" : "\u{2600}\u{FE0F}";
  if (base === "fair") return isNight ? "\u{1F319}" : "\u{1F324}\u{FE0F}";
  if (base === "partlycloudy") return isNight ? "\u{2601}\u{FE0F}" : "\u{26C5}";
  if (base === "cloudy") return "\u{2601}\u{FE0F}";
  if (base === "fog") return "\u{1F32B}\u{FE0F}";
  if (base.includes("thunder")) return "\u{26C8}\u{FE0F}";
  if (base.includes("heavyrain")) return "\u{1F327}\u{FE0F}";
  if (base.includes("rain")) return "\u{1F326}\u{FE0F}";
  if (base.includes("sleet")) return "\u{1F328}\u{FE0F}";
  if (base.includes("snow")) return "\u{2744}\u{FE0F}";
  return "\u{2601}\u{FE0F}";
}
