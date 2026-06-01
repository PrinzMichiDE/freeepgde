'use client';

import { useState, useEffect } from 'react';
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';
import { CountrySelector } from './country-selector';
import { useTranslations } from '@/hooks/use-translations';

export function IptvLinkCard() {
  const { t } = useTranslations();
  const [copied, setCopied] = useState(false);
  const [epgUrl, setEpgUrl] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('DE');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEpgUrl(`${window.location.origin}/api/epg?country=${selectedCountry}`);
    }
  }, [selectedCountry]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(epgUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);

      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'epg_url_copied', {
          country: selectedCountry,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Fehler beim Kopieren:', err);
    }
  };

  const steps = [
    { n: '1', title: t('step1'), desc: t('step1Desc') },
    { n: '2', title: t('step2'), desc: t('step2Desc') },
    { n: '3', title: t('step3'), desc: t('step3Desc') },
  ];

  return (
    <div className="card p-6 sm:p-8">
      <div className="mb-8">
        <p className="section-label mb-2" id="epg-url-heading">
          {t('iptvCardTitle')}
        </p>
        <p className="text-sm text-zinc-400">{t('iptvCardSubtitle')}</p>
      </div>

      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {t('selectCountry')}
      </label>
      <CountrySelector
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
      />

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">{t('programUrl')}</span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
            Live
          </span>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <code className="break-all font-mono text-sm text-emerald-400/90">
            {epgUrl || '…'}
          </code>
        </div>
        <button
          type="button"
          onClick={copyToClipboard}
          className={`mt-4 w-full ${copied ? 'btn-primary' : 'btn-primary !bg-white !text-zinc-950 hover:!bg-zinc-200'}`}
        >
          {copied ? (
            <>
              <CheckIcon className="h-5 w-5" />
              {t('urlCopied')}
            </>
          ) : (
            <>
              <DocumentDuplicateIcon className="h-5 w-5" />
              {t('copyUrl')}
            </>
          )}
        </button>
      </div>

      <div className="mt-10 border-t border-zinc-800 pt-8">
        <p className="mb-4 text-sm font-medium text-zinc-300">{t('howToUse')}</p>
        <ol className="grid gap-3 sm:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.n}
              className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4"
            >
              <span className="text-xs font-medium text-zinc-500">{step.n}</span>
              <p className="mt-1 text-sm font-medium text-zinc-200">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">{step.desc}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-center text-xs text-zinc-500">{t('compatibleApps')}</p>
      </div>
    </div>
  );
}
