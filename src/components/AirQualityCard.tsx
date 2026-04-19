import { Wind } from 'lucide-react';
import type { AirQualityData } from '../types';
import { getAQILevel, getAQILabel, getAQIColor, getAQIBg } from '../utils/formatters';

interface AirQualityCardProps {
  airQuality: AirQualityData;
}

interface PollutantRowProps {
  label: string;
  value: number | null | undefined;
  unit: string;
  max: number;
}

function PollutantRow({ label, value, unit, max }: PollutantRowProps) {
  const v = value ?? 0;
  const pct = Math.min((v / max) * 100, 100);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <span className="text-xs text-slate-300 tabular-nums font-semibold">
          {v.toFixed(1)} {unit}
        </span>
      </div>
      <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            backgroundColor: pct < 30 ? '#22c55e' : pct < 60 ? '#eab308' : '#ef4444',
          }}
        />
      </div>
    </div>
  );
}

export function AirQualityCard({ airQuality }: AirQualityCardProps) {
  const c = airQuality.current;
  const aqi = c.european_aqi ?? 0;
  const level = getAQILevel(aqi);
  const label = getAQILabel(level);
  const color = getAQIColor(level);
  const bgClass = getAQIBg(level);

  const pct = Math.min((aqi / 120) * 100, 100);

  return (
    <div className="card-glass rounded-3xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-2 text-slate-400">
        <Wind className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">Air Quality</span>
      </div>

      <div className={`flex items-center justify-between rounded-2xl px-5 py-4 border ${bgClass}`}>
        <div>
          <div className="text-4xl font-thin text-slate-100 tabular-nums">{aqi}</div>
          <div className="text-xs text-slate-400 mt-0.5">European AQI</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold" style={{ color }}>{label}</div>
          <div className="text-xs text-slate-400 mt-0.5">Air Quality Index</div>
        </div>
      </div>

      <div className="h-2 bg-slate-700/60 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>Good</span>
        <span>Moderate</span>
        <span>Extremely Poor</span>
      </div>

      <div className="flex flex-col gap-3 pt-1 border-t border-slate-700/40">
        <PollutantRow label="PM2.5" value={c.pm2_5} unit="µg/m³" max={75} />
        <PollutantRow label="PM10" value={c.pm10} unit="µg/m³" max={150} />
        <PollutantRow label="NO₂" value={c.nitrogen_dioxide} unit="µg/m³" max={200} />
        <PollutantRow label="O₃ (Ozone)" value={c.ozone} unit="µg/m³" max={240} />
        <PollutantRow label="SO₂" value={c.sulphur_dioxide} unit="µg/m³" max={500} />
        <PollutantRow label="CO" value={c.carbon_monoxide} unit="µg/m³" max={10000} />
      </div>
    </div>
  );
}
