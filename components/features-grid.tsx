'use client';

import {
  BoltIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useTranslations } from '@/hooks/use-translations';

export function FeaturesGrid() {
  const { t } = useTranslations();

  const features = [
    { icon: GlobeAltIcon, title: t('feature1Title'), description: t('feature1Desc') },
    { icon: ArrowPathIcon, title: t('feature2Title'), description: t('feature2Desc') },
    { icon: BoltIcon, title: t('feature3Title'), description: t('feature3Desc') },
    { icon: ShieldCheckIcon, title: t('feature4Title'), description: t('feature4Desc') },
  ];

  return (
    <div>
      <p className="section-label mb-2">{t('featuresTitle')}</p>
      <p className="mb-8 text-sm text-zinc-400">{t('featuresSubtitle')}</p>

      <ul className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <li key={feature.title} className="card p-5">
            <feature.icon className="mb-3 h-5 w-5 text-emerald-500" strokeWidth={1.5} />
            <h3 className="text-sm font-medium text-white">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{feature.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
