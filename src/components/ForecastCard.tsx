import { CalendarDays } from 'lucide-react';
import type { WeatherData, TemperatureUnit } from '../types';
import { formatTemperature, formatShortDate, getWeatherDescription } from '../utils/formatters';

interface ForecastCardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

export function ForecastCard({ weather, unit }: ForecastCardProps) {
  const { daily } = weather;
  const days = daily.time.slice(0, 7);

  return (
    <div className="card-glass rounded-3xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-slate-400">
        <CalendarDays className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">7-Day Forecast</span>
      </div>

      <div className="flex flex-col gap-1">
        {days.map((day, i) => {
          const { emoji } = getWeatherDescription(daily.weather_code[i], true);
          const max = formatTemperature(daily.temperature_2m_max[i], unit);
          const min = formatTemperature(daily.temperature_2m_min[i], unit);
          const precip = daily.precipitation_probability_max[i];
          const isToday = i === 0;

          return (
            <div
              key={day}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors
                         ${isToday ? 'bg-blue-500/10 border border-blue-500/20' : 'hover:bg-slate-700/30'}`}
            >
              <span className="text-xl w-8 text-center leading-none">{emoji}</span>

              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-slate-200">
                  {isToday ? 'Today' : formatShortDate(day)}
                </span>
                {precip > 0 && (
                  <span className="ml-2 text-xs text-blue-400">{precip}% rain</span>
                )}
              </div>

              <div className="flex items-center gap-2 tabular-nums">
                <span className="text-sm font-semibold text-slate-200">{max}</span>
                <span className="text-sm text-slate-500">{min}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
