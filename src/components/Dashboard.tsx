import { MapPin, RefreshCw, WifiOff, Clock3 } from 'lucide-react';
import type { LocationState, AppSettings } from '../types';
import { TimeCard } from './TimeCard';
import { WeatherCard } from './WeatherCard';
import { ForecastCard } from './ForecastCard';
import { AirQualityCard } from './AirQualityCard';
import { PollenCard } from './PollenCard';
import { formatAge } from '../utils/formatters';

interface DashboardProps {
  state: LocationState;
  settings: AppSettings;
  onRefresh: () => void;
}

export function Dashboard({ state, settings, onRefresh }: DashboardProps) {
  const { location, weather, airQuality, loading, isOffline, lastUpdated, fromCache } = state;

  if (!location || !weather || !airQuality) return null;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <h2 className="text-xl font-semibold text-slate-100 leading-tight">
              {location.name}
              {location.admin1 && <span className="text-slate-400 font-normal">, {location.admin1}</span>}
            </h2>
            <span className="text-sm text-slate-500">{location.country}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOffline && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
              <WifiOff className="w-3 h-3" />
              <span>Offline</span>
            </div>
          )}
          {fromCache && lastUpdated && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-800/60 px-3 py-1.5 rounded-full">
              <Clock3 className="w-3 h-3" />
              <span>Updated {formatAge(Date.now() - lastUpdated)}</span>
            </div>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200
                       bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40
                       px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-50"
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <TimeCard location={location} weather={weather} />
        <WeatherCard weather={weather} unit={settings.temperatureUnit} />
        <AirQualityCard airQuality={airQuality} />
        <ForecastCard weather={weather} unit={settings.temperatureUnit} />
        <PollenCard airQuality={airQuality} />
      </div>

      <div className="text-center text-xs text-slate-700 pb-4">
        Data provided by Open-Meteo · Open-source & free to use
      </div>
    </div>
  );
}
