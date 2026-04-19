import type { CacheEntry } from '../types';

const WEATHER_TTL = 10 * 60 * 1000;
const AIR_QUALITY_TTL = 15 * 60 * 1000;
const GEOCODING_TTL = 7 * 24 * 60 * 60 * 1000;

function getKey(prefix: string, locationKey: string): string {
  return `qheil_${prefix}_${locationKey}`;
}

export function cacheSet<T>(prefix: string, locationKey: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      location_key: locationKey,
    };
    localStorage.setItem(getKey(prefix, locationKey), JSON.stringify(entry));
  } catch {
    // Le stockage peut être plein, ignore l'erreur silencieusement
  }
}

export function cacheGet<T>(prefix: string, locationKey: string, ttl: number): T | null {
  try {
    const raw = localStorage.getItem(getKey(prefix, locationKey));
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.timestamp > ttl) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export function cacheGetStale<T>(prefix: string, locationKey: string): { data: T; age: number } | null {
  try {
    const raw = localStorage.getItem(getKey(prefix, locationKey));
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    return { data: entry.data, age: Date.now() - entry.timestamp };
  } catch {
    return null;
  }
}

export const CACHE_KEYS = {
  WEATHER: 'weather',
  AIR_QUALITY: 'air_quality',
  GEOCODING: 'geocoding',
  LAST_LOCATION: 'last_location',
};

export const TTL = {
  WEATHER: WEATHER_TTL,
  AIR_QUALITY: AIR_QUALITY_TTL,
  GEOCODING: GEOCODING_TTL,
};

export function saveLastLocation(locationKey: string): void {
  try {
    localStorage.setItem('qheil_last_location', locationKey);
  } catch {
    // ignore
  }
}

export function getLastLocation(): string | null {
  return localStorage.getItem('qheil_last_location');
}
