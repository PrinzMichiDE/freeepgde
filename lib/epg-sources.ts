/**
 * Zentrale Definition freier EPG-Quellen pro Land.
 * Quellen werden parallel geladen; fehlgeschlagene URLs werden übersprungen.
 */

export interface EpgSource {
  url: string;
  compressed: boolean;
}

export interface CountryEpgSources {
  code: string;
  name: string;
  sources: EpgSource[];
  fallbackSources: EpgSource[];
}

const GLOBETV_BASE =
  'https://raw.githubusercontent.com/globetvapp/epg/refs/heads/main';

const EPGSHARE_BASE = 'https://epgshare01.online/epgshare01';

/** GlobeTV-Pfade für Länder mit dediziertem Feed */
const GLOBETV_PATHS: Record<string, string> = {
  DE: 'Germany/germany1.xml',
  US: 'USA/usa1.xml',
  GB: 'UK/uk1.xml',
  FR: 'France/france1.xml',
  IT: 'Italy/italy1.xml',
  ES: 'Spain/spain1.xml',
  NL: 'Netherlands/netherlands1.xml',
  PL: 'Poland/poland1.xml',
  AT: 'Austria/austria1.xml',
  CH: 'Switzerland/switzerland1.xml',
  BE: 'Belgium/belgium1.xml',
  CA: 'Canada/canada1.xml',
  AU: 'Australia/australia1.xml',
};

/**
 * EPGShare nutzt teils andere Ländercodes (z. B. UK statt GB).
 */
const EPGSHARE_COUNTRY_CODE: Record<string, string> = {
  GB: 'UK',
};

/**
 * Zusätzliche EPGShare-Ripper-Varianten pro Land (z. B. 2 = zweiter Feed).
 */
const EPGSHARE_VARIANTS: Record<string, number[]> = {
  DE: [1, 2],
  US: [1, 2],
  GB: [1],
  FR: [1, 2],
  IT: [1, 2],
  ES: [1, 2],
  NL: [1, 2],
  PL: [1, 2],
  AT: [1, 2],
  BE: [1, 2],
  CA: [1, 2],
  AU: [1, 2],
  TR: [1, 3],
  IN: [1, 4],
  JP: [1, 2],
  RO: [1, 2],
  PH: [1, 2],
  SA: [1, 2],
  BR: [1],
  MX: [1],
  AR: [1],
  CL: [1],
  CO: [1],
  CZ: [1],
  SE: [1],
  NO: [1],
  DK: [1],
  FI: [1],
  IE: [1],
  PT: [1],
  GR: [1],
  HU: [1],
  HR: [1],
  RS: [1],
  SK: [1],
  BG: [1],
  LT: [1],
  LV: [1],
  EE: [1],
  IL: [1],
  EG: [1],
  TH: [1],
  VN: [1],
  ID: [1],
  MY: [1],
  PK: [1],
  RU: [1],
  UA: [1],
  AE: [1],
  ZA: [1],
  NZ: [1],
  CN: [1],
  KR: [1],
  HK: [1],
  SG: [1],
};

/** Zusätzliche thematische oder regionale EPGShare-Feeds */
const EPGSHARE_NAMED_FEEDS: Record<string, string[]> = {
  DE: ['DELUXEMUSIC1'],
  US: ['DISTROTV1', 'US_LOCALS2', 'US_SPORTS1', 'PLEX1'],
  BE: ['BE2'],
};

/** Länderspezifische Zusatzquellen (nicht EPGShare/epghub) */
const COUNTRY_EXTRA_SOURCES: Record<string, EpgSource[]> = {
  GB: [freeviewUk()],
  CH: [tv7Switzerland()],
  CN: [zmtChina(), epgPwChina(), erwChina()],
  HK: [epgPwHongKong()],
  TW: [epgPwTaiwan()],
};

export const COUNTRY_NAMES: Record<string, string> = {
  DE: 'Deutschland',
  US: 'United States',
  GB: 'United Kingdom',
  FR: 'France',
  IT: 'Italy',
  ES: 'Spain',
  NL: 'Netherlands',
  PL: 'Poland',
  AT: 'Austria',
  CH: 'Switzerland',
  BE: 'Belgium',
  CA: 'Canada',
  AU: 'Australia',
  PT: 'Portugal',
  GR: 'Greece',
  TR: 'Turkey',
  RO: 'Romania',
  CZ: 'Czech Republic',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  IE: 'Ireland',
  BR: 'Brazil',
  MX: 'Mexico',
  AR: 'Argentina',
  CL: 'Chile',
  CO: 'Colombia',
  IN: 'India',
  JP: 'Japan',
  KR: 'South Korea',
  CN: 'China',
  RU: 'Russia',
  UA: 'Ukraine',
  SA: 'Saudi Arabia',
  AE: 'United Arab Emirates',
  ZA: 'South Africa',
  NZ: 'New Zealand',
  HU: 'Hungary',
  SK: 'Slovakia',
  BG: 'Bulgaria',
  HR: 'Croatia',
  RS: 'Serbia',
  SI: 'Slovenia',
  LT: 'Lithuania',
  LV: 'Latvia',
  EE: 'Estonia',
  IL: 'Israel',
  EG: 'Egypt',
  TH: 'Thailand',
  VN: 'Vietnam',
  ID: 'Indonesia',
  MY: 'Malaysia',
  PH: 'Philippines',
  PK: 'Pakistan',
  HK: 'Hong Kong',
  TW: 'Taiwan',
  SG: 'Singapore',
  LU: 'Luxembourg',
  BA: 'Bosnia and Herzegovina',
  CY: 'Cyprus',
  MT: 'Malta',
  IS: 'Iceland',
  AL: 'Albania',
};

function epgHub(code: string, compressed = true): EpgSource {
  return {
    url: `https://epghub.xyz/epg/EPG-${code.toUpperCase()}.xml${compressed ? '.gz' : ''}`,
    compressed,
  };
}

function epgShareRipper(
  countryCode: string,
  variant: number,
  compressed = true
): EpgSource {
  const shareCode = EPGSHARE_COUNTRY_CODE[countryCode.toUpperCase()] || countryCode.toUpperCase();
  return {
    url: `${EPGSHARE_BASE}/epg_ripper_${shareCode}${variant}.xml${compressed ? '.gz' : ''}`,
    compressed,
  };
}

function epgShareNamed(feedName: string, compressed = true): EpgSource {
  return {
    url: `${EPGSHARE_BASE}/epg_ripper_${feedName}.xml${compressed ? '.gz' : ''}`,
    compressed,
  };
}

function iptvEpgOrg(code: string, compressed = true): EpgSource {
  return {
    url: `https://iptv-epg.org/files/epg-${code.toLowerCase()}.xml${compressed ? '.gz' : ''}`,
    compressed,
  };
}

function globetv(path: string): EpgSource {
  return {
    url: `${GLOBETV_BASE}/${path}`,
    compressed: false,
  };
}

function freeviewUk(): EpgSource {
  return {
    url: 'https://raw.githubusercontent.com/dp247/Freeview-EPG/master/epg.xml',
    compressed: false,
  };
}

function tv7Switzerland(): EpgSource {
  return {
    url: 'https://raw.githubusercontent.com/mathewmeconry/TV7_EPG_Data/master/tv7_epg.xml.gz',
    compressed: true,
  };
}

function zmtChina(): EpgSource {
  return {
    url: 'https://gitee.com/taksssss/tv/raw/main/epg/51zmt.xml.gz',
    compressed: true,
  };
}

function epgPwChina(): EpgSource {
  return {
    url: 'https://gitee.com/taksssss/tv/raw/main/epg/epgpw_cn.xml.gz',
    compressed: true,
  };
}

function erwChina(): EpgSource {
  return {
    url: 'https://gitee.com/taksssss/tv/raw/main/epg/erw.xml.gz',
    compressed: true,
  };
}

function epgPwHongKong(): EpgSource {
  return {
    url: 'https://gitee.com/taksssss/tv/raw/main/epg/epgpw_hk.xml.gz',
    compressed: true,
  };
}

function epgPwTaiwan(): EpgSource {
  return {
    url: 'https://gitee.com/taksssss/tv/raw/main/epg/epgpw_tw.xml.gz',
    compressed: true,
  };
}

function collectEpgShareSources(countryCode: string): EpgSource[] {
  const upper = countryCode.toUpperCase();
  const sources: EpgSource[] = [];
  const variants = EPGSHARE_VARIANTS[upper] ?? [1];

  for (const variant of variants) {
    sources.push(epgShareRipper(upper, variant));
  }

  const namedFeeds = EPGSHARE_NAMED_FEEDS[upper] ?? [];
  for (const feed of namedFeeds) {
    sources.push(epgShareNamed(feed));
  }

  return sources;
}

/**
 * Baut die Quellenliste für ein Land aus mehreren freien Anbietern.
 */
export function buildCountryEpgConfig(code: string, name: string): CountryEpgSources {
  const upper = code.toUpperCase();
  const sources: EpgSource[] = [];

  const globetvPath = GLOBETV_PATHS[upper];
  if (globetvPath) {
    sources.push(globetv(globetvPath));
  }

  sources.push(epgHub(upper), iptvEpgOrg(upper), iptvEpgOrg(upper, false));
  sources.push(...collectEpgShareSources(upper));

  const extras = COUNTRY_EXTRA_SOURCES[upper] ?? [];
  sources.push(...extras);

  const fallbackSources: EpgSource[] = [
    epgShareRipper(upper, 1, false),
    epgHub(upper),
    iptvEpgOrg(upper),
    ...extras,
  ];

  return {
    code: upper,
    name,
    sources,
    fallbackSources,
  };
}

export function buildAllCountryConfigs(): Record<string, CountryEpgSources> {
  return Object.fromEntries(
    Object.entries(COUNTRY_NAMES).map(([code, name]) => {
      const config = buildCountryEpgConfig(code, name);
      return [config.code, config];
    })
  );
}

export type EpgProviderId =
  | 'GlobeTV'
  | 'EPGHub'
  | 'EPGShare'
  | 'IPTV-EPG.org'
  | 'Freeview'
  | 'TV7'
  | '51zmt'
  | 'epg.pw'
  | 'Unknown';

export function detectEpgProvider(url: string): EpgProviderId {
  if (url.includes('globetvapp')) return 'GlobeTV';
  if (url.includes('epghub.xyz')) return 'EPGHub';
  if (url.includes('epgshare01')) return 'EPGShare';
  if (url.includes('iptv-epg.org')) return 'IPTV-EPG.org';
  if (url.includes('Freeview-EPG') || url.includes('freeview')) return 'Freeview';
  if (url.includes('TV7_EPG_Data') || url.includes('tv7_epg')) return 'TV7';
  if (url.includes('51zmt')) return '51zmt';
  if (url.includes('epgpw_') || url.includes('epg.pw')) return 'epg.pw';
  if (url.includes('gitee.com/taksssss')) return '51zmt';
  return 'Unknown';
}
