import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import type { GeoLocation } from '../types';
import { searchLocations } from '../services/geocoding';

interface SearchBarProps {
  onSelect: (location: GeoLocation) => void;
  initialValue?: string;
}

export function SearchBar({ onSelect, initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setSearching(true);
    try {
      const res = await searchLocations(q);
      setResults(res);
      setOpen(res.length > 0);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, search]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(loc: GeoLocation) {
    setQuery(`${loc.name}, ${loc.admin1 ? loc.admin1 + ', ' : ''}${loc.country}`);
    setOpen(false);
    setResults([]);
    onSelect(loc);
  }

  function handleClear() {
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 light-mode:text-slate-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Chercher une ville, région ou pays..."
          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-800/80 border border-slate-700/60
                     text-slate-100 placeholder-slate-500 text-base font-medium
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                     backdrop-blur-sm transition-all duration-200
                     light-mode:bg-slate-100 light-mode:border-slate-300 light-mode:text-slate-900
                     light-mode:placeholder-slate-600 light-mode:focus:ring-blue-400/50"
          aria-label="Search location"
          autoComplete="off"
        />
        <div className="absolute right-4 flex items-center gap-2">
          {searching && <Loader2 className="w-4 h-4 text-blue-400 light-mode:text-blue-600 animate-spin" />}
          {query && !searching && (
            <button onClick={handleClear} className="text-slate-500 hover:text-slate-300 light-mode:text-slate-500 light-mode:hover:text-slate-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-2xl bg-slate-800/95 border border-slate-700/60
                        shadow-2xl backdrop-blur-sm z-50 overflow-hidden
                        light-mode:bg-white light-mode:border-slate-200">
          {results.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-slate-700/50 transition-colors
                         text-left group border-b border-slate-700/30 last:border-0
                         light-mode:hover:bg-slate-100 light-mode:border-slate-200"
            >
              <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0 group-hover:text-blue-300 transition-colors
                               light-mode:text-blue-600 light-mode:group-hover:text-blue-700" />
              <div>
                <span className="text-slate-100 font-medium text-sm light-mode:text-slate-900">{loc.name}</span>
                {(loc.admin1 || loc.country) && (
                  <span className="text-slate-400 text-sm ml-1.5 light-mode:text-slate-600">
                    {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                  </span>
                )}
                {loc.population && (
                  <span className="block text-slate-500 text-xs mt-0.5 light-mode:text-slate-600">
                    Pop. {loc.population.toLocaleString()}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
