'use client';

import { useEffect, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export function EpgAutoUpdater() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'updating'>('idle');

  useEffect(() => {
    const checkAndUpdate = async () => {
      setStatus('checking');
      try {
        const response = await fetch('/api/epg/check-update', { method: 'POST' });
        const data = await response.json();
        if (data.success && data.needsUpdate) {
          setStatus('updating');
          setTimeout(() => setStatus('idle'), 5000);
        } else {
          setStatus('idle');
        }
      } catch {
        setStatus('idle');
      }
    };

    checkAndUpdate();
    const interval = setInterval(checkAndUpdate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (status === 'idle') return null;

  return (
    <div
      className="fixed left-1/2 top-[4.25rem] z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/95 px-3 py-1.5 text-xs text-zinc-400 shadow-lg backdrop-blur-sm"
      role="status"
    >
      <ArrowPathIcon
        className={`h-3.5 w-3.5 ${status === 'updating' ? 'animate-spin text-emerald-500' : 'text-zinc-500'}`}
      />
      {status === 'checking' ? 'EPG wird geprüft…' : 'EPG wird aktualisiert…'}
    </div>
  );
}
