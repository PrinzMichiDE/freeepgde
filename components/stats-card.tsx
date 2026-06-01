'use client';

import { ArrowTrendingUpIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';

interface StatsData {
  visitors: number;
  downloads: number;
  dailyUsage: Array<{ date: string; downloads: number; uniqueIPs: number }>;
  topPlayers: Array<{ name: string; count: number }>;
}

export function StatsCard() {
  const { t } = useTranslations();
  const [stats, setStats] = useState<StatsData>({
    visitors: 0,
    downloads: 0,
    dailyUsage: [],
    topPlayers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats/visitor', { method: 'POST' }).catch(console.error);

    const loadStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        if (data.success) {
          setStats({
            visitors: data.stats.visitors,
            downloads: data.stats.downloads,
            dailyUsage: data.stats.dailyUsage || [],
            topPlayers: data.stats.topPlayers || [],
          });
        }
      } catch (error) {
        console.error('Fehler beim Laden der Statistiken:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const todayDownloads =
    stats.dailyUsage[stats.dailyUsage.length - 1]?.downloads || 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="section-label mb-2">{t('visitors')} & {t('downloads')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatBox
          label={t('visitors')}
          value={loading ? '…' : stats.visitors.toLocaleString('de-DE')}
          icon={<ArrowTrendingUpIcon className="h-5 w-5 text-zinc-500" />}
        />
        <StatBox
          label={t('downloads')}
          value={loading ? '…' : stats.downloads.toLocaleString('de-DE')}
          icon={<ArrowDownTrayIcon className="h-5 w-5 text-zinc-500" />}
        />
      </div>

      {stats.dailyUsage.length > 0 && (
        <div className="card p-5">
          <p className="text-sm font-medium text-zinc-300">{t('dailyUsage')}</p>
          <p className="mt-1 text-xs text-zinc-500">{t('dailyUsageDesc')}</p>
          <p className="mt-4 text-2xl font-semibold text-white">
            {loading ? '…' : todayDownloads.toLocaleString('de-DE')}
            <span className="ml-2 text-sm font-normal text-zinc-500">{t('today')}</span>
          </p>
          <div className="mt-6 grid grid-cols-7 gap-1">
            {stats.dailyUsage.map((day) => {
              const date = new Date(day.date);
              const dayName = date.toLocaleDateString('de-DE', { weekday: 'short' });
              const max = Math.max(...stats.dailyUsage.map((d) => d.downloads), 1);
              const height = Math.max(4, (day.downloads / max) * 48);

              return (
                <div key={day.date} className="flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-emerald-600/80"
                    style={{ height: `${height}px` }}
                    title={`${day.downloads} Downloads`}
                  />
                  <span className="text-[10px] text-zinc-600">{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stats.topPlayers.length > 0 && (
        <div className="card p-5">
          <p className="text-sm font-medium text-zinc-300">{t('playerStats')}</p>
          <p className="mt-1 text-xs text-zinc-500">{t('playerStatsDesc')}</p>
          <ul className="mt-4 space-y-3">
            {stats.topPlayers.slice(0, 5).map((player) => {
              const total = stats.topPlayers.reduce((s, p) => s + p.count, 0);
              const pct = total > 0 ? (player.count / total) * 100 : 0;
              return (
                <li key={player.name}>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-300">{player.name}</span>
                    <span className="text-zinc-500">{player.count.toLocaleString('de-DE')}</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-zinc-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-zinc-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}
