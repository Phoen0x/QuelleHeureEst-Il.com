import { Flower2 } from 'lucide-react';
import type { AirQualityData } from '../types';
import { getPollenLevel, getPollenLabel, getPollenColor } from '../utils/formatters';

interface PollenCardProps {
  airQuality: AirQualityData;
}

interface PollenItem {
  name: string;
  key: keyof typeof POLLEN_KEYS;
  emoji: string;
}

const POLLEN_ITEMS: PollenItem[] = [
  { name: 'Grass', key: 'grass_pollen', emoji: '🌿' },
  { name: 'Birch', key: 'birch_pollen', emoji: '🌲' },
  { name: 'Alder', key: 'alder_pollen', emoji: '🌳' },
  { name: 'Olive', key: 'olive_pollen', emoji: '🫒' },
  { name: 'Mugwort', key: 'mugwort_pollen', emoji: '🌾' },
  { name: 'Ragweed', key: 'ragweed_pollen', emoji: '🌻' },
];

const POLLEN_KEYS = {
  grass_pollen: true,
  birch_pollen: true,
  alder_pollen: true,
  olive_pollen: true,
  mugwort_pollen: true,
  ragweed_pollen: true,
};

export function PollenCard({ airQuality }: PollenCardProps) {
  const hourly = airQuality.hourly;

  function getCurrentPollen(key: string): number | null {
    const arr = (hourly as Record<string, number[]>)[key];
    if (!arr || arr.length === 0) return null;
    const now = new Date();
    const nowHour = now.getHours();
    return arr[nowHour] ?? arr[0] ?? null;
  }

  const items = POLLEN_ITEMS.map(item => {
    const value = getCurrentPollen(item.key);
    const level = getPollenLevel(value);
    return { ...item, value, level };
  });

  const anyActive = items.some(i => i.level !== 'none' && i.value !== null);

  return (
    <div className="card-glass rounded-3xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400">
          <Flower2 className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest">Pollen</span>
        </div>
        {!anyActive && (
          <span className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
            All Clear
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {items.map(item => (
          <div
            key={item.key}
            className="flex items-center gap-3 bg-slate-800/40 rounded-2xl px-3.5 py-3"
          >
            <span className="text-xl leading-none">{item.emoji}</span>
            <div className="min-w-0">
              <div className="text-xs text-slate-500 font-medium">{item.name}</div>
              <div className={`text-sm font-semibold ${getPollenColor(item.level)}`}>
                {item.value !== null ? getPollenLabel(item.level) : '—'}
              </div>
              {item.value !== null && item.value > 0 && (
                <div className="text-xs text-slate-600">{item.value.toFixed(0)} grains/m³</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-slate-600 pt-1 border-t border-slate-700/40">
        Values represent current hour pollen concentration.
      </div>
    </div>
  );
}
