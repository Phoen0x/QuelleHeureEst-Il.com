import { Sun, Moon, Thermometer } from 'lucide-react';
import type { AppSettings } from '../types';

interface SettingsBarProps {
  settings: AppSettings;
  onUpdate: (s: Partial<AppSettings>) => void;
}

export function SettingsBar({ settings, onUpdate }: SettingsBarProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onUpdate({ temperatureUnit: settings.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius' })}
        title="Toggle temperature unit"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                   bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200
                   hover:bg-slate-700/60 transition-all duration-200"
      >
        <Thermometer className="w-3.5 h-3.5" />
        {settings.temperatureUnit === 'celsius' ? '°C' : '°F'}
      </button>

      <button
        onClick={() => onUpdate({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
        title="Toggle theme"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                   bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:text-slate-200
                   hover:bg-slate-700/60 transition-all duration-200"
      >
        {settings.theme === 'dark'
          ? <Sun className="w-3.5 h-3.5" />
          : <Moon className="w-3.5 h-3.5" />
        }
      </button>
    </div>
  );
}
