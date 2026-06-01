import pako from 'pako';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { buildAllCountryConfigs, type CountryEpgSources } from './epg-sources';

/**
 * EPG Service zum Laden, Mergen und Verarbeiten von mehreren EPG Quellen
 */

interface EpgCache {
  data: string;
  timestamp: number;
}

interface XmlTvChannel {
  '@_id': string;
  'display-name': string | string[];
  icon?: {
    '@_src': string;
  };
  [key: string]: any;
}

interface XmlTvProgramme {
  '@_start': string;
  '@_stop': string;
  '@_channel': string;
  title: string | { '#text': string; '@_lang'?: string };
  desc?: string | { '#text': string; '@_lang'?: string };
  category?: string | string[];
  [key: string]: any;
}

interface XmlTvRoot {
  tv: {
    '@_generator-info-name'?: string;
    '@_generator-info-url'?: string;
    channel?: XmlTvChannel | XmlTvChannel[];
    programme?: XmlTvProgramme | XmlTvProgramme[];
  };
}

type CountryConfig = CountryEpgSources;

const COUNTRY_CONFIGS: Record<string, CountryConfig> = buildAllCountryConfigs();

// Standard-Land (Deutschland)
const DEFAULT_COUNTRY = 'DE';

/**
 * Gibt alle verfügbaren Länder zurück
 */
export function getAvailableCountries(): Array<{ code: string; name: string }> {
  return Object.values(COUNTRY_CONFIGS).map((config) => ({
    code: config.code,
    name: config.name,
  }));
}

/**
 * Gibt die Konfiguration für ein Land zurück
 */
export function getCountryConfig(countryCode: string): CountryConfig {
  const code = countryCode.toUpperCase();
  return COUNTRY_CONFIGS[code] || COUNTRY_CONFIGS[DEFAULT_COUNTRY];
}

// In-Memory Cache für die EPG Daten (pro Land)
const epgCache: Map<string, EpgCache> = new Map();

// XML Parser Konfiguration
const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: false,
  trimValues: true,
};

const parser = new XMLParser(parserOptions);

const builderOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  format: true,
  suppressEmptyNode: true,
};

const builder = new XMLBuilder(builderOptions);

/**
 * Lädt eine einzelne EPG Quelle (mit oder ohne gz Komprimierung)
 * Gibt null zurück bei Fehler (für Fallback-Mechanismus)
 */
async function loadSingleSource(url: string, compressed: boolean): Promise<string | null> {
  console.log(`[EPG] Lade Quelle: ${url} (compressed: ${compressed})`);

  try {
    const response = await fetch(url, {
      // Kein Next.js Cache auf Vercel, um immer frische Daten zu bekommen
      cache: 'no-store',
      // Timeout nach 30 Sekunden
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP Fehler: ${response.status} ${response.statusText}`);
    }

    if (compressed) {
      // .gz Daten laden und dekomprimieren
      const compressedData = await response.arrayBuffer();
      const decompressed = pako.inflate(new Uint8Array(compressedData), { to: 'string' });
      return decompressed;
    } else {
      // Normale XML Daten
      return await response.text();
    }
  } catch (error) {
    console.error(`[EPG] Fehler beim Laden von ${url}:`, error);
    return null; // Return null statt throw für Fallback-Mechanismus
  }
}

/**
 * Normalisiert ein Array (stellt sicher, dass es ein Array ist)
 */
function normalizeArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Merged mehrere EPG XML Dateien zu einer einzigen
 * Verbesserte Logik: Bessere Deduplizierung, Programm-Merging pro Kanal
 */
function mergeEpgData(xmlDataArray: string[]): string {
  console.log(`[EPG] Merge ${xmlDataArray.length} Quellen...`);

  const parsedData: XmlTvRoot[] = [];

  // Alle XML Daten parsen
  for (const xmlData of xmlDataArray) {
    try {
      const parsed = parser.parse(xmlData) as XmlTvRoot;
      if (parsed && parsed.tv) {
        parsedData.push(parsed);
      }
    } catch (error) {
      console.error('[EPG] Fehler beim Parsen einer Quelle:', error);
    }
  }

  if (parsedData.length === 0) {
    throw new Error('Keine gültigen EPG Daten gefunden');
  }

  // Sammle alle Channels (mit verbesserter Deduplizierung)
  const channelsMap = new Map<string, XmlTvChannel>();
  
  // Programme pro Kanal sammeln (für besseres Merging)
  const programmesByChannel = new Map<string, Map<string, XmlTvProgramme>>();

  for (const data of parsedData) {
    // Channels sammeln (mit Priorisierung - spätere Quellen überschreiben frühere)
    const channels = normalizeArray(data.tv.channel);
    for (const channel of channels) {
      if (channel['@_id']) {
        // Wenn Channel bereits existiert, merge die Daten (behalte bessere Icon/Name)
        const existing = channelsMap.get(channel['@_id']);
        if (existing) {
          // Merge: Behalte bessere Daten
          if (!existing.icon && channel.icon) {
            existing.icon = channel.icon;
          }
          if (!existing['display-name'] || 
              (typeof existing['display-name'] === 'string' && existing['display-name'].length < 3) ||
              (Array.isArray(existing['display-name']) && existing['display-name'].length === 0)) {
            existing['display-name'] = channel['display-name'];
          }
        } else {
          channelsMap.set(channel['@_id'], channel);
        }
      }
    }

    // Programme sammeln (gruppiert nach Kanal)
    const programmes = normalizeArray(data.tv.programme);
    for (const programme of programmes) {
      const channelId = programme['@_channel'];
      if (!channelId) continue;
      
      // Erstelle eindeutigen Key für Programm (Channel + Start + Stop)
      const programKey = `${programme['@_start']}_${programme['@_stop']}`;
      
      if (!programmesByChannel.has(channelId)) {
        programmesByChannel.set(channelId, new Map());
      }
      
      const channelProgrammes = programmesByChannel.get(channelId)!;
      
      // Deduplizierung: Wenn Programm bereits existiert, behalte das mit mehr Daten
      if (channelProgrammes.has(programKey)) {
        const existing = channelProgrammes.get(programKey)!;
        // Merge: Behalte Programm mit mehr Informationen
        if (!existing.desc && programme.desc) {
          existing.desc = programme.desc;
        }
        if (!existing.category && programme.category) {
          existing.category = programme.category;
        }
        if (typeof existing.title === 'string' && existing.title.length < 3 && programme.title) {
          existing.title = programme.title;
        }
      } else {
        channelProgrammes.set(programKey, programme);
      }
    }
  }

  // Konvertiere Programme-Map zu Array und sortiere
  const programmesArray: XmlTvProgramme[] = [];
  for (const [channelId, channelProgrammes] of programmesByChannel) {
    // Sortiere Programme pro Kanal nach Start-Zeit
    const sortedProgrammes = Array.from(channelProgrammes.values()).sort((a, b) => {
      const startA = a['@_start'] || '';
      const startB = b['@_start'] || '';
      return startA.localeCompare(startB);
    });
    programmesArray.push(...sortedProgrammes);
  }

  // Sortiere alle Programme global nach Start-Zeit
  programmesArray.sort((a, b) => {
    const startA = a['@_start'] || '';
    const startB = b['@_start'] || '';
    return startA.localeCompare(startB);
  });

  // Erstelle gemergtes XML Objekt
  const mergedData: XmlTvRoot = {
    tv: {
      '@_generator-info-name': 'EPG Service - Multi-Source',
      '@_generator-info-url': 'https://www.free-epg.de',
      channel: Array.from(channelsMap.values()),
      programme: programmesArray,
    },
  };

  // Zurück zu XML konvertieren
  const xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>\n' + builder.build(mergedData);

  console.log(
    `[EPG] Merge abgeschlossen: ${channelsMap.size} Channels, ${programmesArray.length} Programme aus ${parsedData.length} Quellen`
  );

  return xmlOutput;
}

/**
 * Lädt alle EPG Quellen für ein bestimmtes Land und merged sie
 * Kombiniert ALLE verfügbaren Quellen (primär + Fallback) zu einer vereinten Ausgabe
 */
export async function loadEpgData(countryCode: string = DEFAULT_COUNTRY): Promise<string> {
  const config = getCountryConfig(countryCode);
  const startTime = Date.now();
  console.log(`[EPG] Lade EPG Daten für ${config.name} (${config.code})...`);
  console.log(`[EPG] ${config.sources.length} primäre Quellen, ${config.fallbackSources.length} Fallback-Quellen verfügbar`);

  // Kombiniere alle Quellen (primär + Fallback) für maximale Abdeckung
  const allSources = [...config.sources, ...config.fallbackSources];
  
  // Entferne Duplikate basierend auf URL (um gleiche Quellen nicht mehrfach zu laden)
  const uniqueSources = Array.from(
    new Map(allSources.map(source => [source.url, source])).values()
  );

  console.log(`[EPG] Lade ${uniqueSources.length} einzigartige Quellen (alle werden kombiniert)...`);

  // Lade alle Quellen parallel
  const loadPromises = uniqueSources.map((source) =>
    loadSingleSource(source.url, source.compressed)
  );

  const allResults = await Promise.all(loadPromises);
  
  // Filtere erfolgreiche Ergebnisse heraus
  const successfulData = allResults.filter((data): data is string => data !== null);
  
  if (successfulData.length === 0) {
    throw new Error(`Alle EPG Quellen für ${config.name} sind fehlgeschlagen`);
  }

  console.log(`[EPG] ${successfulData.length}/${uniqueSources.length} Quellen erfolgreich geladen - kombiniere zu vereinter Ausgabe...`);
  
  try {
    const mergedXml = mergeEpgData(successfulData);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(
      `[EPG] Alle Quellen erfolgreich kombiniert in ${duration}s (${Math.round(mergedXml.length / 1024)} KB)`
    );
    return mergedXml;
  } catch (error) {
    console.error('[EPG] Fehler beim Mergen der Daten:', error);
    throw new Error(`Fehler beim Kombinieren der EPG Quellen für ${config.name}: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}

/**
 * Gibt die gecachten EPG Daten zurück oder lädt sie neu,
 * wenn der Cache abgelaufen ist.
 */
export async function getEpgData(countryCode: string = DEFAULT_COUNTRY): Promise<string> {
  const revalidateSeconds = parseInt(
    process.env.EPG_REVALIDATE_SECONDS || '86400',
    10
  );

  const now = Date.now();
  const cacheKey = countryCode.toUpperCase();
  const cached = epgCache.get(cacheKey);

  // Prüfe ob Cache vorhanden und noch gültig ist
  if (cached && now - cached.timestamp < revalidateSeconds * 1000) {
    console.log(`[EPG] Cache-Hit für ${cacheKey}`);
    return cached.data;
  }

  // Cache ist abgelaufen oder nicht vorhanden - neu laden
  console.log(`[EPG] Cache-Miss für ${cacheKey} - lade Daten neu`);
  const data = await loadEpgData(countryCode);

  // Cache aktualisieren
  epgCache.set(cacheKey, {
    data,
    timestamp: now,
  });

  return data;
}

/**
 * Setzt den Cache zurück (nützlich für manuelle Updates)
 */
export function resetEpgCache(countryCode?: string): void {
  if (countryCode) {
    epgCache.delete(countryCode.toUpperCase());
    console.log(`[EPG] Cache für ${countryCode} zurückgesetzt`);
  } else {
    epgCache.clear();
    console.log('[EPG] Alle Caches zurückgesetzt');
  }
}

/**
 * Gibt Informationen über den Cache-Status zurück
 */
export function getCacheInfo(countryCode: string = DEFAULT_COUNTRY): {
  cached: boolean;
  age: number | null;
  ageFormatted: string | null;
} {
  const cacheKey = countryCode.toUpperCase();
  const cached = epgCache.get(cacheKey);

  if (!cached) {
    return {
      cached: false,
      age: null,
      ageFormatted: null,
    };
  }

  const age = Date.now() - cached.timestamp;
  const ageMinutes = Math.floor(age / 1000 / 60);
  const ageHours = Math.floor(ageMinutes / 60);

  let ageFormatted: string;
  if (ageHours > 0) {
    ageFormatted = `${ageHours} Stunde${ageHours !== 1 ? 'n' : ''}`;
  } else {
    ageFormatted = `${ageMinutes} Minute${ageMinutes !== 1 ? 'n' : ''}`;
  }

  return {
    cached: true,
    age,
    ageFormatted,
  };
}
