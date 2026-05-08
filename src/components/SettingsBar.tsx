import { Sun, Moon, Thermometer } from 'lucide-react';
import type { AppSettings } from '../types';

interface SettingsBarProps {
  settings: AppSettings;
  onUpdate: (s: Partial<AppSettings>) => void;
}

export function SettingsBar({ settings, onUpdate }: SettingsBarProps) {
  const buttonClass = settings.theme === 'light'
    ? 'bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-300'
    : 'bg-slate-800/60 border-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60';

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onUpdate({ temperatureUnit: settings.temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius' })}
        title="Changer l'unité de température"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                   border transition-all duration-200 ${buttonClass}`}
      >
        <Thermometer className="w-3.5 h-3.5" />
        {settings.temperatureUnit === 'celsius' ? '°C' : '°F'}
      </button>

      <button
        onClick={() => onUpdate({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
        title="Changer le thème"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                   border transition-all duration-200 ${buttonClass}`}
      >
        {settings.theme === 'dark'
          ? <Sun className="w-3.5 h-3.5" />
          : <Moon className="w-3.5 h-3.5" />
        }
      </button>
    </div>
  );
}
