import { useEffect, useState } from 'react';
import { Clock, Globe } from 'lucide-react';
import type { GeoLocation, WeatherData } from '../types';
import { formatTime, formatDate } from '../utils/formatters';

interface TimeCardProps {
  location: GeoLocation;
  weather: WeatherData;
}

export function TimeCard({ location, weather }: TimeCardProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timezone = location.timezone;
  const time = formatTime(now, timezone);
  const date = formatDate(now, timezone);
  const offsetHours = weather.utc_offset_seconds / 3600;
  const offsetStr = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;

  return (
    <div className="card-glass rounded-3xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Clock className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">Local Time</span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-6xl font-thin tabular-nums tracking-tight text-slate-100 leading-none">
          {time}
        </div>
        <div className="text-slate-400 text-sm font-medium mt-2">{date}</div>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-slate-700/40">
        <Globe className="w-4 h-4 text-blue-400 shrink-0" />
        <div>
          <div className="text-slate-200 text-sm font-semibold">{timezone.replace(/_/g, ' ')}</div>
          <div className="text-slate-500 text-xs">
            {weather.timezone_abbreviation} · {offsetStr}
          </div>
        </div>
      </div>
    </div>
  );
}
