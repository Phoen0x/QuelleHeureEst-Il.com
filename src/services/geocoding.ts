import type { GeoLocation } from '../types';
import { cacheSet, cacheGet, TTL, CACHE_KEYS } from './cache';

const BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query.trim()) return [];

  const cacheKey = query.toLowerCase().trim();
  const cached = cacheGet<GeoLocation[]>(CACHE_KEYS.GEOCODING, cacheKey, TTL.GEOCODING);
  if (cached) return cached;

  const params = new URLSearchParams({
    name: query,
    count: '10',
    language: 'fr',
    format: 'json',
  });

  const response = await fetch(`${BASE_URL}/search?${params}`);
  if (!response.ok) throw new Error(`Erreur géocodage: ${response.status}`);

  const json = await response.json();
  const results: GeoLocation[] = json.results ?? [];
  cacheSet(CACHE_KEYS.GEOCODING, cacheKey, results);
  return results;
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeoLocation | null> {
  const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
  const cached = cacheGet<GeoLocation>(CACHE_KEYS.GEOCODING, cacheKey, TTL.GEOCODING);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lng),
    count: '1',
    language: 'fr',
    format: 'json',
  });

  const response = await fetch(`${BASE_URL}/search?${params}`);
  if (!response.ok) return null;

  const json = await response.json();
  const result: GeoLocation = json.results?.[0] ?? null;
  if (result) cacheSet(CACHE_KEYS.GEOCODING, cacheKey, result);
  return result;
}

export function locationKey(loc: GeoLocation): string {
  return `${loc.latitude.toFixed(4)}_${loc.longitude.toFixed(4)}`;
}
