import type { AQILevel, PollenLevel, TemperatureUnit } from '../types';

export function formatTemperature(value: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    return `${Math.round((value * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(value)}°C`;
}

export function formatTime(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone,
  }).format(date);
}

export function formatDate(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  }).format(date);
}

export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate + 'T12:00:00Z');
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', month: 'short', day: 'numeric' }).format(date);
}

export function formatWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  return dirs[Math.round(degrees / 22.5) % 16];
}

export function getAQILevel(aqi: number): AQILevel {
  if (aqi <= 20) return 'bon';
  if (aqi <= 40) return 'acceptable';
  if (aqi <= 60) return 'modéré';
  if (aqi <= 80) return 'mauvais';
  if (aqi <= 100) return 'très-mauvais';
  return 'extrêmement-mauvais';
}

export function getAQILabel(level: AQILevel): string {
  const labels: Record<AQILevel, string> = {
    'bon': 'Bon',
    'acceptable': 'Acceptable',
    'modéré': 'Modéré',
    'mauvais': 'Mauvais',
    'très-mauvais': 'Très mauvais',
    'extrêmement-mauvais': 'Extrêmement mauvais',
  };
  return labels[level];
}

export function getAQIColor(level: AQILevel): string {
  const colors: Record<AQILevel, string> = {
    'bon': '#22c55e',
    'acceptable': '#84cc16',
    'modéré': '#eab308',
    'mauvais': '#f97316',
    'très-mauvais': '#ef4444',
    'extrêmement-mauvais': '#7f1d1d',
  };
  return colors[level];
}

export function getAQIBg(level: AQILevel): string {
  const colors: Record<AQILevel, string> = {
    'bon': 'bg-green-500/20 border-green-500/30',
    'acceptable': 'bg-lime-500/20 border-lime-500/30',
    'modéré': 'bg-yellow-500/20 border-yellow-500/30',
    'mauvais': 'bg-orange-500/20 border-orange-500/30',
    'très-mauvais': 'bg-red-500/20 border-red-500/30',
    'extrêmement-mauvais': 'bg-red-900/40 border-red-900/40',
  };
  return colors[level];
}

export function getPollenLevel(value: number | null): PollenLevel {
  if (value === null || value === 0) return 'aucun';
  if (value <= 10) return 'faible';
  if (value <= 30) return 'modéré';
  if (value <= 80) return 'élevé';
  return 'très-élevé';
}

export function getPollenLabel(level: PollenLevel): string {
  const labels: Record<PollenLevel, string> = {
    aucun: 'Aucun',
    faible: 'Faible',
    modéré: 'Modéré',
    élevé: 'Élevé',
    'très-élevé': 'Très élevé',
  };
  return labels[level];
}

export function getPollenColor(level: PollenLevel): string {
  const colors: Record<PollenLevel, string> = {
    aucun: 'text-slate-400',
    faible: 'text-green-400',
    modéré: 'text-yellow-400',
    élevé: 'text-orange-400',
    'très-élevé': 'text-red-400',
  };
  return colors[level];
}

export function getWeatherDescription(code: number, isDay: boolean): { description: string; emoji: string } {
  const map: Record<number, { description: string; dayEmoji: string; nightEmoji: string }> = {
    0:  { description: 'Ciel dégagé', dayEmoji: '☀️', nightEmoji: '🌙' },
    1:  { description: 'Généralement dégagé', dayEmoji: '🌤️', nightEmoji: '🌙' },
    2:  { description: 'Partiellement nuageux', dayEmoji: '⛅', nightEmoji: '🌙' },
    3:  { description: 'Couvert', dayEmoji: '☁️', nightEmoji: '☁️' },
    45: { description: 'Brumeux', dayEmoji: '🌫️', nightEmoji: '🌫️' },
    48: { description: 'Brume givrante', dayEmoji: '🌫️', nightEmoji: '🌫️' },
    51: { description: 'Légère bruine', dayEmoji: '🌦️', nightEmoji: '🌧️' },
    53: { description: 'Bruine', dayEmoji: '🌦️', nightEmoji: '🌧️' },
    55: { description: 'Bruine forte', dayEmoji: '🌧️', nightEmoji: '🌧️' },
    61: { description: 'Légères averses', dayEmoji: '🌦️', nightEmoji: '🌧️' },
    63: { description: 'Pluie', dayEmoji: '🌧️', nightEmoji: '🌧️' },
    65: { description: 'Pluie forte', dayEmoji: '🌧️', nightEmoji: '🌧️' },
    71: { description: 'Légère neige', dayEmoji: '🌨️', nightEmoji: '🌨️' },
    73: { description: 'Neige', dayEmoji: '❄️', nightEmoji: '❄️' },
    75: { description: 'Neige forte', dayEmoji: '❄️', nightEmoji: '❄️' },
    77: { description: 'Grains de neige', dayEmoji: '🌨️', nightEmoji: '🌨️' },
    80: { description: 'Légères averses', dayEmoji: '🌦️', nightEmoji: '🌧️' },
    81: { description: 'Averses', dayEmoji: '🌧️', nightEmoji: '🌧️' },
    82: { description: 'Averses fortes', dayEmoji: '⛈️', nightEmoji: '⛈️' },
    85: { description: 'Averses de neige', dayEmoji: '🌨️', nightEmoji: '🌨️' },
    86: { description: 'Averses de neige fortes', dayEmoji: '🌨️', nightEmoji: '🌨️' },
    95: { description: 'Orage', dayEmoji: '⛈️', nightEmoji: '⛈️' },
    96: { description: 'Orage avec grêle', dayEmoji: '⛈️', nightEmoji: '⛈️' },
    99: { description: 'Orage avec grosse grêle', dayEmoji: '⛈️', nightEmoji: '⛈️' },
  };

  const entry = map[code] ?? { description: 'Inconnu', dayEmoji: '🌡️', nightEmoji: '🌡️' };
  return {
    description: entry.description,
    emoji: isDay ? entry.dayEmoji : entry.nightEmoji,
  };
}

export function formatAge(ms: number): string {
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'à l\'instant';
  if (mins < 60) return `il y a ${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `il y a ${hrs}h ${mins % 60}m`;
}
