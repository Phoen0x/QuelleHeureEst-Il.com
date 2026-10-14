import { invoke } from '@tauri-apps/api/tauri';
import type { GeoLocation, WeatherData, AirQualityData } from '../types';

export const tauriApi = {
  async searchLocations(query: string): Promise<GeoLocation[]> {
    return invoke('search_location', { query });
  },

  async getWeather(lat: number, lon: number): Promise<WeatherData> {
    return invoke('get_weather', { lat, lon });
  },

  async getAirQuality(lat: number, lon: number): Promise<AirQualityData> {
    return invoke('get_air_quality', { lat, lon });
  },

  async getPollen(lat: number, lon: number) {
    return invoke('get_pollen', { lat, lon });
  },

  async getCachedLocation(): Promise<GeoLocation | null> {
    return invoke('get_cached_location') || null;
  },

  async cacheLocation(location: GeoLocation): Promise<void> {
    return invoke('cache_location', { location });
  },
};
