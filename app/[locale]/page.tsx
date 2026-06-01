'use client';

import { StatsCard } from '@/components/stats-card';
import { EpgAutoUpdater } from '@/components/epg-auto-updater';
import { IptvLinkCard } from '@/components/iptv-link-card';
import { FeaturesGrid } from '@/components/features-grid';
import { PwaInstallPrompt } from '@/components/pwa-install-prompt';
import { PwaTvPlayerEnhanced } from '@/components/pwa-tv-player-enhanced';
import { usePWAMode } from '@/components/pwa-detector';
import { FaqSection } from '@/components/faq-section';
import { KoFiSupport } from '@/components/kofi-support';
import { KoFiFloatingButton } from '@/components/kofi-floating-button';
import { SiteHeader } from '@/components/site-header';
import { useTranslations } from '@/hooks/use-translations';
import Script from 'next/script';
import { AdSenseBanner } from '@/components/adsense-banner';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon, CommandLineIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const isPWA = usePWAMode();
  const { t } = useTranslations();

  if (isPWA) {
    return <PwaTvPlayerEnhanced />;
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: t('title'),
    description: t('description'),
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <SiteHeader title={t('title')} subtitle={t('subtitle')} />

        <EpgAutoUpdater />
        <PwaInstallPrompt />
        <KoFiFloatingButton />

        <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <section className="mb-12">
            <p className="section-label mb-3">EPG für IPTV</p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t('description').replace('13', '64')}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Kostenlos, täglich aktualisiert, ohne Registrierung.
            </p>
          </section>

          <section className="mb-12" aria-labelledby="epg-url-heading">
            <IptvLinkCard />
          </section>

          <section className="mb-12">
            <FeaturesGrid />
          </section>

          <section className="mb-12 grid gap-4 sm:grid-cols-2">
            <LinkCard
              href="https://www.michelfritzsch.de/tv"
              external
              title={t('liveTvTitle')}
              description={t('liveTvDescription')}
              label={t('liveTvButton')}
            />
            <LinkCard
              href="/mcp"
              title={t('mcpTitle')}
              description={t('mcpDescription')}
              label={t('mcpButton')}
              icon={<CommandLineIcon className="h-4 w-4" />}
            />
          </section>

          <section id="stats" className="mb-12">
            <StatsCard />
          </section>

          <section className="mb-12">
            <KoFiSupport variant="card" />
          </section>

          <section className="mb-12">
            <FaqSection />
          </section>

          <AdSenseBanner adSlot="1234567893" adFormat="auto" className="mb-10" />

          <footer className="flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 text-sm text-zinc-500 sm:flex-row">
            <p>{t('footerText')}</p>
            <a
              href="https://ko-fi.com/michelfritzsch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 transition-colors hover:text-zinc-200"
            >
              {t('supportProject')}
            </a>
          </footer>
        </main>
      </div>
    </>
  );
}

function LinkCard({
  href,
  title,
  description,
  label,
  external,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  label: string;
  external?: boolean;
  icon?: React.ReactNode;
}) {
  const className = 'card flex h-full flex-col p-5 transition-colors hover:border-zinc-700';

  const inner = (
    <>
      <h2 className="text-base font-medium text-white">{title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{description}</p>
      <span className="btn-ghost mt-5 w-full">
        {icon}
        {label}
        {external && <ArrowTopRightOnSquareIcon className="h-4 w-4 text-zinc-500" />}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
