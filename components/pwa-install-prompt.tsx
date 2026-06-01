'use client';

import { useState, useEffect } from 'react';
import { ArrowDownTrayIcon, XMarkIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      if (Date.now() - dismissedAt < 24 * 60 * 60 * 1000) return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-dismissed', Date.now().toString());
  };

  if (!isMounted || isInstalled || !showPrompt || !deferredPrompt) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      role="dialog"
      aria-label="App installieren"
    >
      <div className="card relative p-4 shadow-xl">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-md p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
          aria-label="Schließen"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>

        <div className="flex gap-3 pr-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950">
            <DevicePhoneMobileIcon className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white">Als App installieren</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Schneller Zugriff und Offline-Funktionen auf dem Startbildschirm.
            </p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={handleInstallClick} className="btn-primary flex-1 py-2">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Installieren
              </button>
              <button type="button" onClick={handleDismiss} className="btn-ghost px-3 py-2">
                Später
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
