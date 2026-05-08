import { Globe, Cloud, Wind, Flower2, Wifi, WifiOff } from 'lucide-react';

interface LandingHeroProps {
  isOffline: boolean;
}

const features = [
  { icon: Globe, label: 'Heure, Date, et Fuseau Horaire local', color: 'text-blue-400' },
  { icon: Cloud, label: 'Météo', color: 'text-sky-400' },
  { icon: Wind, label: 'Qualité de l\'air et pollution', color: 'text-emerald-400' },
  { icon: Flower2, label: 'Niveaux de Pollen', color: 'text-amber-400' },
];

export function LandingHero({ isOffline }: LandingHeroProps) {
  return (
    <div className="flex flex-col items-center gap-8 py-12 text-center max-w-2xl mx-auto">
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600
                        flex items-center justify-center shadow-2xl shadow-blue-500/30">
          <Globe className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full
                        bg-slate-900 border-2 border-slate-800 flex items-center justify-center">
          {isOffline
            ? <WifiOff className="w-3 h-3 text-amber-400" />
            : <Wifi className="w-3 h-3 text-green-400" />
          }
        </div>
      </div>

      <div>
        <h1 className="text-4xl font-bold text-slate-100 tracking-tight">
          Quelle Heure Est-Il ?.com
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          .com
        </p>
        <p className="text-slate-400 mt-4 text-base leading-relaxed">
          Heure, Date, Temps, Qualité de l'Air, et données de concentration de Pollens en temps réel
          <br />Pour n'importe quel endroit au monde — fonctionne hors-ligne également.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {features.map(({ icon: Icon, label, color }) => (
          <div
            key={label}
            className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/40
                       rounded-2xl px-4 py-3.5"
          >
            <Icon className={`w-4 h-4 ${color} shrink-0`} />
            <span className="text-sm text-slate-300 font-medium">{label}</span>
          </div>
        ))}
      </div>

      <p className="text-slate-600 text-sm">
        Cherchez une ville, lieu, ou pays pour commencer.
      </p>
    </div>
  );
}
