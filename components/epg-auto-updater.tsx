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
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-400 shadow-lg"
      role="status"
    >
      <ArrowPathIcon
        className={`h-4 w-4 ${status === 'updating' ? 'animate-spin text-emerald-500' : ''}`}
      />
      {status === 'checking' ? 'EPG wird geprüft…' : 'EPG wird aktualisiert…'}
    </div>
  );
}
