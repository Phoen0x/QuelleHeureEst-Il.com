export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  population?: number;
}

export interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  uv_index: number;
  is_day: number;
}

export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
}

export interface CurrentAirQuality {
  european_aqi: number;
  pm10: number;
  pm2_5: number;
  nitrogen_dioxide: number;
  ozone: number;
  sulphur_dioxide: number;
  carbon_monoxide: number;
}

export interface HourlyPollen {
  time: string[];
  alder_pollen: number[];
  birch_pollen: number[];
  grass_pollen: number[];
  mugwort_pollen: number[];
  olive_pollen: number[];
  ragweed_pollen: number[];
}

export interface HourlyAQI {
  time: string[];
  european_aqi: number[];
  pm10: number[];
  pm2_5: number[];
  uv_index: number[];
}

export interface AirQualityData {
  current: CurrentAirQuality;
  hourly: HourlyAQI & HourlyPollen;
  timezone: string;
  utc_offset_seconds: number;
}

export interface LocationState {
  location: GeoLocation | null;
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  localTime: Date | null;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  lastUpdated: number | null;
  fromCache: boolean;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  location_key: string;
}

export type AQILevel = 'bon' | 'acceptable' | 'modéré' | 'mauvais' | 'très-mauvais' | 'extrêmement-mauvais';

export type PollenLevel = 'aucun' | 'faible' | 'modéré' | 'élevé' | 'très-élevé';

export interface WeatherCodeInfo {
  description: string;
  icon: string;
  dayIcon: string;
  nightIcon: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type Theme = 'dark' | 'light';

export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  theme: Theme;
  language: string;
}
