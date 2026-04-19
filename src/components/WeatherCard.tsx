import { Thermometer, Droplets, Wind, Eye, Sunrise, Sunset } from 'lucide-react';
import type { WeatherData, TemperatureUnit } from '../types';
import { formatTemperature, formatWindDirection, getWeatherDescription } from '../utils/formatters';

interface WeatherCardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

function MetricItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-slate-800/40 rounded-2xl px-4 py-3">
      <div className="text-blue-400">{icon}</div>
      <div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
        <div className="text-sm text-slate-200 font-semibold">{value}</div>
      </div>
    </div>
  );
}

export function WeatherCard({ weather, unit }: WeatherCardProps) {
  const c = weather.current;
  const { description, emoji } = getWeatherDescription(c.weather_code, !!c.is_day);
  const sunrise = weather.daily.sunrise?.[0];
  const sunset = weather.daily.sunset?.[0];

  function formatSunTime(iso: string | undefined): string {
    if (!iso) return '--';
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: weather.timezone });
  }

  return (
    <div className="card-glass rounded-3xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Thermometer className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest">Weather</span>
        </div>
        <span className="text-xs text-slate-500 bg-slate-800/60 px-2.5 py-1 rounded-full">
          {description}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-7xl leading-none">{emoji}</span>
        <div>
          <div className="text-5xl font-thin text-slate-100 leading-none">
            {formatTemperature(c.temperature_2m, unit)}
          </div>
          <div className="text-slate-400 text-sm mt-1.5">
            Feels like {formatTemperature(c.apparent_temperature, unit)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <MetricItem
          icon={<Droplets className="w-4 h-4" />}
          label="Humidity"
          value={`${c.relative_humidity_2m}%`}
        />
        <MetricItem
          icon={<Wind className="w-4 h-4" />}
          label="Wind"
          value={`${Math.round(c.wind_speed_10m)} km/h ${formatWindDirection(c.wind_direction_10m)}`}
        />
        <MetricItem
          icon={<Eye className="w-4 h-4" />}
          label="UV Index"
          value={`${c.uv_index ?? '--'}`}
        />
        <MetricItem
          icon={<Droplets className="w-4 h-4" />}
          label="Precipitation"
          value={`${c.precipitation} mm`}
        />
      </div>

      {(sunrise || sunset) && (
        <div className="flex gap-2 pt-1 border-t border-slate-700/40">
          <div className="flex items-center gap-2 flex-1 text-sm text-slate-400">
            <Sunrise className="w-4 h-4 text-amber-400" />
            <span>{formatSunTime(sunrise)}</span>
          </div>
          <div className="flex items-center gap-2 flex-1 text-sm text-slate-400">
            <Sunset className="w-4 h-4 text-orange-400" />
            <span>{formatSunTime(sunset)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
