'use client';

import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import { locales, languages, Language } from '@/lib/i18n';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = (pathname.split('/')[1] as Language) || 'de';

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const switchLanguage = (locale: Language) => {
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    router.push(`/${locale}${pathWithoutLocale}`);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <GlobeAltIcon className="h-4 w-4" />
        {currentLocale.toUpperCase()}
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 min-w-[8rem] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 py-1 shadow-xl"
        >
          {locales.map((locale) => (
            <li key={locale}>
              <button
                type="button"
                role="option"
                aria-selected={currentLocale === locale}
                onClick={() => switchLanguage(locale)}
                className={`w-full px-3 py-2 text-left text-sm ${
                  currentLocale === locale
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                {languages[locale]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
