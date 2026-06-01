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

/** Länder mit zweitem EPGShare-Ripper-Feed */
const EPGSHARE_SECOND_FEED = new Set([
  'DE',
  'US',
  'GB',
  'FR',
  'IT',
  'ES',
  'NL',
  'PL',
  'AT',
  'BE',
  'AU',
  'CA',
]);

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
};

function epgHub(code: string, compressed = true): EpgSource {
  return {
    url: `https://epghub.xyz/epg/EPG-${code.toUpperCase()}.xml${compressed ? '.gz' : ''}`,
    compressed,
  };
}

function epgShare(code: string, variant = 1, compressed = true): EpgSource {
  return {
    url: `https://epgshare01.online/epgshare01/epg_ripper_${code.toUpperCase()}${variant}.xml${compressed ? '.gz' : ''}`,
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

  sources.push(
    epgHub(upper),
    epgShare(upper, 1),
    iptvEpgOrg(upper),
    iptvEpgOrg(upper, false)
  );

  if (EPGSHARE_SECOND_FEED.has(upper)) {
    sources.push(epgShare(upper, 2));
  }

  const fallbackSources: EpgSource[] = [
    epgShare(upper, 1, false),
    epgHub(upper),
    iptvEpgOrg(upper),
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
  | 'Unknown';

export function detectEpgProvider(url: string): EpgProviderId {
  if (url.includes('globetvapp')) return 'GlobeTV';
  if (url.includes('epghub.xyz')) return 'EPGHub';
  if (url.includes('epgshare01')) return 'EPGShare';
  if (url.includes('iptv-epg.org')) return 'IPTV-EPG.org';
  return 'Unknown';
}
