import type { WeatherData, AirQualityData, GeoLocation } from '../types';
import { cacheSet, cacheGet, cacheGetStale, TTL, CACHE_KEYS } from './cache';
import { locationKey } from './geocoding';

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function fetchWeather(
  location: GeoLocation
): Promise<{ data: WeatherData; fromCache: boolean }> {
  const key = locationKey(location);
  const cached = cacheGet<WeatherData>(CACHE_KEYS.WEATHER, key, TTL.WEATHER);
  if (cached) return { data: cached, fromCache: true };

  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'weather_code',
      'precipitation_sum',
      'precipitation_probability_max',
      'uv_index_max',
      'sunrise',
      'sunset',
    ].join(','),
    timezone: location.timezone,
    forecast_days: '7',
    wind_speed_unit: 'kmh',
  });

  const response = await fetch(`${WEATHER_URL}?${params}`);
  if (!response.ok) {
    const stale = cacheGetStale<WeatherData>(CACHE_KEYS.WEATHER, key);
    if (stale) return { data: stale.data, fromCache: true };
    throw new Error(`Erreur chargement météo: ${response.status}`);
  }

  const json = await response.json();
  const data: WeatherData = {
    current: json.current,
    daily: json.daily,
    timezone: json.timezone,
    timezone_abbreviation: json.timezone_abbreviation,
    utc_offset_seconds: json.utc_offset_seconds,
  };

  cacheSet(CACHE_KEYS.WEATHER, key, data);
  return { data, fromCache: false };
}

export async function fetchAirQuality(
  location: GeoLocation
): Promise<{ data: AirQualityData; fromCache: boolean }> {
  const key = locationKey(location);
  const cached = cacheGet<AirQualityData>(CACHE_KEYS.AIR_QUALITY, key, TTL.AIR_QUALITY);
  if (cached) return { data: cached, fromCache: true };

  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: [
      'european_aqi',
      'pm10',
      'pm2_5',
      'nitrogen_dioxide',
      'ozone',
      'sulphur_dioxide',
      'carbon_monoxide',
    ].join(','),
    hourly: [
      'european_aqi',
      'pm10',
      'pm2_5',
      'uv_index',
      'alder_pollen',
      'birch_pollen',
      'grass_pollen',
      'mugwort_pollen',
      'olive_pollen',
      'ragweed_pollen',
    ].join(','),
    timezone: location.timezone,
    forecast_days: '1',
  });

  const response = await fetch(`${AIR_URL}?${params}`);
  if (!response.ok) {
    const stale = cacheGetStale<AirQualityData>(CACHE_KEYS.AIR_QUALITY, key);
    if (stale) return { data: stale.data, fromCache: true };
    throw new Error(`Erreur chargement qualité de l'air: ${response.status}`);
  }

  const json = await response.json();
  const data: AirQualityData = {
    current: json.current,
    hourly: json.hourly,
    timezone: json.timezone,
    utc_offset_seconds: json.utc_offset_seconds,
  };

  cacheSet(CACHE_KEYS.AIR_QUALITY, key, data);
  return { data, fromCache: false };
}
