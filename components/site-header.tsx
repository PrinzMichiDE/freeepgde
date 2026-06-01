'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { LanguageSwitcher } from './language-switcher';

interface SiteHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  wide?: boolean;
}

export function SiteHeader({
  title,
  subtitle,
  backHref,
  backLabel = 'Zurück',
  wide = false,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div
        className={`mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6 ${
          wide ? 'max-w-5xl' : 'max-w-3xl'
        }`}
      >
        <div className="min-w-0 flex-1">
          {backHref && (
            <Link
              href={backHref}
              className="mb-2 inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              {backLabel}
            </Link>
          )}
          <p className="truncate text-sm font-semibold tracking-tight text-white">{title}</p>
          {subtitle && <p className="truncate text-xs text-zinc-500">{subtitle}</p>}
        </div>
        {!backHref ? <LanguageSwitcher /> : null}
      </div>
    </header>
  );
}
