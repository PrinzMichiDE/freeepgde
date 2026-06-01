'use client';

import { GlobeAltIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';

interface Country {
  code: string;
  name: string;
}

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
}

export function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const loadCountries = async () => {
      try {
        const response = await fetch('/api/epg/status?country=DE', { cache: 'no-store' });
        if (!mounted || !response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (mounted && data.availableCountries?.length) {
          setCountries(data.availableCountries);
        }
      } catch {
        if (mounted) {
          setCountries([{ code: 'DE', name: 'Deutschland' }]);
        }
      }
    };

    loadCountries();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const selectedName =
    countries.find((c) => c.code === selectedCountry)?.name || selectedCountry;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-left text-sm text-zinc-200 hover:border-zinc-600"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="inline-flex items-center gap-2">
          <GlobeAltIcon className="h-4 w-4 text-zinc-500" />
          {selectedName}
        </span>
        <svg
          className={`h-4 w-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && countries.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 py-1 shadow-xl"
        >
          {countries.map((country) => (
            <li key={country.code}>
              <button
                type="button"
                role="option"
                aria-selected={selectedCountry === country.code}
                onClick={() => {
                  onCountryChange(country.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm ${
                  selectedCountry === country.code
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800/50'
                }`}
              >
                {country.name}
                {selectedCountry === country.code && (
                  <CheckIcon className="h-4 w-4 text-emerald-500" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
