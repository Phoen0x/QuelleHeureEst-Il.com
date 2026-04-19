import { useState, useEffect, useCallback, useRef } from 'react';
import type { LocationState, GeoLocation, AppSettings } from '../types';
import { fetchWeather, fetchAirQuality } from '../services/weather';
import { locationKey } from '../services/geocoding';
import { saveLastLocation } from '../services/cache';

const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: 'celsius',
  theme: 'dark',
  language: 'en',
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem('qheil_settings');
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(s: AppSettings): void {
  try {
    localStorage.setItem('qheil_settings', JSON.stringify(s));
  } catch {
    // ignore
  }
}

export function useAppState() {
  const [state, setState] = useState<LocationState>({
    location: null,
    weather: null,
    airQuality: null,
    localTime: null,
    loading: false,
    error: null,
    isOffline: !navigator.onLine,
    lastUpdated: null,
    fromCache: false,
  });

  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Écoute les changements de connectivité réseau
    const onOnline = () => setState(s => ({ ...s, isOffline: false }));
    const onOffline = () => setState(s => ({ ...s, isOffline: true }));
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    // Mise à jour de l'heure locale chaque seconde
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setState(s => ({ ...s, localTime: new Date() }));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadLocation = useCallback(async (location: GeoLocation) => {
    setState(s => ({ ...s, loading: true, error: null, location }));
    saveLastLocation(locationKey(location));

    try {
      const [weatherResult, aqResult] = await Promise.all([
        fetchWeather(location),
        fetchAirQuality(location),
      ]);

      setState(s => ({
        ...s,
        weather: weatherResult.data,
        airQuality: aqResult.data,
        localTime: new Date(),
        loading: false,
        lastUpdated: Date.now(),
        fromCache: weatherResult.fromCache && aqResult.fromCache,
      }));

      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = setInterval(() => {
        loadLocation(location);
      }, 10 * 60 * 1000);
    } catch (err) {
      setState(s => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Échec du chargement des données',
      }));
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      saveSettings(next);
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, []);

  return { state, settings, loadLocation, updateSettings };
}
