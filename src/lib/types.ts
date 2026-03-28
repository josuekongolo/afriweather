export interface City {
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  country: string;
  countryName: string;
  population: number;
  province?: string;
}

export interface WeatherData {
  updated_at: string;
  properties: {
    meta: {
      updated_at: string;
      units: {
        air_pressure_at_sea_level: string;
        air_temperature: string;
        cloud_area_fraction: string;
        precipitation_amount: string;
        relative_humidity: string;
        wind_from_direction: string;
        wind_speed: string;
      };
    };
    timeseries: TimeseriesEntry[];
  };
}

export interface TimeseriesEntry {
  time: string;
  data: {
    instant: {
      details: {
        air_pressure_at_sea_level: number;
        air_temperature: number;
        cloud_area_fraction: number;
        relative_humidity: number;
        wind_from_direction: number;
        wind_speed: number;
        dew_point_temperature?: number;
        fog_area_fraction?: number;
        ultraviolet_index_clear_sky?: number;
      };
    };
    next_1_hours?: ForecastPeriod;
    next_6_hours?: ForecastPeriod;
    next_12_hours?: ForecastPeriod;
  };
}

export interface ForecastPeriod {
  summary: {
    symbol_code: string;
  };
  details: {
    precipitation_amount?: number;
    air_temperature_max?: number;
    air_temperature_min?: number;
  };
}

export interface DailyForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  symbolCode: string;
  precipitation: number;
}

export interface HourlyForecast {
  time: string;
  hour: string;
  temp: number;
  symbolCode: string;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  humidity: number;
}

export interface DetailedHourly {
  time: string;
  hour: string;
  date: string;
  dayLabel: string;
  temp: number;
  feelsLike: number;
  dewPoint: number;
  symbolCode: string;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  humidity: number;
  pressure: number;
  cloudCover: number;
  uvIndex: number;
}

export interface DayDetail {
  date: string;
  dayLabel: string;
  hours: DetailedHourly[];
  periodSymbols: {
    night: string;
    morning: string;
    afternoon: string;
    evening: string;
  };
  tempMax: number;
  tempMin: number;
  totalPrecip: number;
  maxWind: number;
}

export interface GraphDataPoint {
  time: string;
  label: string;
  temp: number;
  dewPoint: number;
  precipitation: number;
  wind: number;
  pressure: number;
  humidity: number;
  dayBoundary?: boolean;
  dayLabel?: string;
}
