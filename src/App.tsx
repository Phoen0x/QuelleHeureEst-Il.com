import { useEffect } from 'react';
import { Loader2, AlertCircle, Globe } from 'lucide-react';
import { useAppState } from './hooks/useAppState';
import { SearchBar } from './components/SearchBar';
import { Dashboard } from './components/Dashboard';
import { LandingHero } from './components/LandingHero';
import { SettingsBar } from './components/SettingsBar';
import type { GeoLocation } from './types';

export default function App() {
  const { state, settings, loadLocation, updateSettings } = useAppState();
  const { location, loading, error, weather, airQuality, isOffline } = state;

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', settings.theme === 'light');
  }, [settings.theme]);

  function handleSelect(loc: GeoLocation) {
    loadLocation(loc);
  }

  function handleRefresh() {
    if (location) loadLocation(location);
  }

  const showDashboard = location && weather && airQuality && !loading;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      settings.theme === 'light'
        ? 'bg-slate-100 text-slate-900'
        : 'bg-slate-950 text-slate-100'
    }`}>
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background:
            settings.theme === 'dark'
              ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56,189,248,0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(14,165,233,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className={`sticky top-0 z-30 border-b backdrop-blur-xl transition-colors duration-300 ${
          settings.theme === 'light'
            ? 'bg-white/80 border-slate-200'
            : 'bg-slate-950/80 border-slate-800/60'
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className={`font-bold text-sm hidden sm:block ${
                settings.theme === 'light' ? 'text-slate-900' : 'text-slate-100'
              }`}>
                QuelleHeureEst-Il.Com
              </span>
            </div>

            <div className="flex-1">
              <SearchBar onSelect={handleSelect} />
            </div>

            <SettingsBar settings={settings} onUpdate={updateSettings} />
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          {isOffline && !location && (
            <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-500/10
                            border border-amber-500/20 px-4 py-3 rounded-2xl mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              You are offline. Search results may be limited to previously cached locations.
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-24">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20
                              flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <p className="text-slate-400 text-sm">
                Fetching data for {location?.name}...
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center gap-4 py-16">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20
                              flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-slate-300 font-medium">Failed to load data</p>
                <p className="text-slate-500 text-sm mt-1">{error}</p>
              </div>
              {location && (
                <button
                  onClick={handleRefresh}
                  className="px-5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30
                             text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          {!loading && !error && !showDashboard && (
            <LandingHero isOffline={isOffline} />
          )}

          {showDashboard && (
            <Dashboard
              state={state}
              settings={settings}
              onRefresh={handleRefresh}
            />
          )}
        </main>
      </div>
    </div>
  );
}
