# EPG Service

Ein Next.js basierter EPG (Electronic Program Guide) Service, der täglich EPG-Daten von einer .xml.gz Quelle lädt und als XML API bereitstellt.

## Features

- ✅ **Multi-Source EPG**: Automatisches Laden von mehreren EPG Quellen
- ✅ **Format Support**: Unterstützung für .xml und .xml.gz Dateien
- ✅ **Smart Merging**: Intelligentes Mergen mit Deduplizierung
- ✅ **Auto-Update**: Proaktive Updates beim Seitenaufruf (alle 24h)
- ✅ **Background Updates**: Automatische Aktualisierung im Hintergrund
- ✅ **Ultra TV Player**: Professioneller Player mit allen Features
- ✅ **Favoriten-System**: Speichere deine Lieblings-Sender
- ✅ **Watch History**: Zuletzt gesehene Sender (letzte 10)
- ✅ **Last Channel Memory**: Merkt sich den zuletzt gesehenen Sender
- ✅ **Kategorie-Filter**: Filtere Sender nach Kategorien
- ✅ **Extended Keyboard Shortcuts**: 
  - Space = Play/Pause
  - M = Mute
  - F = Fullscreen
  - P = Picture-in-Picture
  - ←/→ = Sender wechseln
  - ↑/↓ = Lautstärke
  - I = Stream Info
  - C = Quick Access
- ✅ **Volume Slider**: Visuelle Lautstärke-Regelung
- ✅ **Channel Navigation**: Vor/Zurück-Buttons
- ✅ **Loading States**: Animierte Lade-Anzeigen
- ✅ **Error Handling**: Intelligente Fehlererkennung mit Retry
- ✅ **Stream Info**: Bitrate, Auflösung, Codec-Anzeige
- ✅ **View Modes**: Normal, Theater, Mini
- ✅ **Channel Numbers**: Nummerierte Sender-Thumbnails
- ✅ **Auto Recovery**: Automatische HLS-Fehlerbehandlung
- ✅ **Picture-in-Picture**: PiP-Modus für Multitasking
- ✅ **HLS Streaming**: Optimierte HLS/M3U8 Unterstützung
- ✅ **Progressive Web App**: Installierbar auf allen Geräten
- ✅ **Mobile Optimiert**: Touch-optimierte Bedienung für Smartphones
- ✅ **Offline-Fähig**: Service Worker für Offline-Funktionalität
- ✅ **Quick Links**: Schnellzugriff zu wichtigen Bereichen
- ✅ **M3U Generator**: Erstellt vorkonfigurierte Playlist-Dateien
- ✅ **QR-Code Generator**: Schnelles Teilen der EPG-URL via QR-Code
- ✅ **Share-Funktionen**: WhatsApp, Telegram, E-Mail & mehr
- ✅ **XML Download**: Lokaler Download der EPG-Daten
- ✅ **XMLTV Config**: Konfigurationsdateien für Kodi
- ✅ **Setup-Anleitungen**: Schritt-für-Schritt für beliebte IPTV-Apps
- ✅ **High Performance**: In-Memory Caching & CDN Optimierung
- ✅ **Modern UI**: Headless UI mit Framer Motion Animationen
- ✅ **Performance Metrics**: Echtzeit-Monitoring von Response Time, Cache Status & Uptime
- ✅ **FAQ-Sektion**: Umfassende Antworten auf häufige Fragen
- ✅ **EPG Preview**: Live-Übersicht über aktuelle EPG-Daten und Update-Zeiten
- ✅ **Share Tracking**: Zähler für geteilte Links mit verschiedenen Plattformen
- ✅ **Visitor & Download Stats**: Live-Statistiken mit animierten Zählern
- ✅ **Statistics**: Besucher- und Download-Counter
- ✅ **Live Notifications**: Visuelle Update-Benachrichtigungen
- ✅ **TypeScript**: Vollständige Typsicherheit
- ✅ **Production Ready**: Optimiert für Vercel Edge Network

## Technologie-Stack

- **Framework**: Next.js 15 (App Router)
- **Sprache**: TypeScript
- **Runtime**: Node.js
- **UI Components**: Headless UI + Heroicons
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Video Streaming**: HLS.js
- **QR-Code**: qrcode
- **Dekomprimierung**: pako
- **XML Processing**: fast-xml-parser

## EPG Quellen

Der Service kombiniert pro Land mehrere freie EPG-Quellen parallel:

| Anbieter | Beschreibung |
|----------|--------------|
| **GlobeTV** | XML-Feeds für ausgewählte Länder (GitHub) |
| **EPGHub** | Komprimierte XMLTV-Dateien (`epghub.xyz`) |
| **EPGShare** | Regionale Ripper-Feeds (`epgshare01.online`) |
| **IPTV-EPG.org** | Länder-XMLTV (`iptv-epg.org/files/`) |

Konfiguration in `lib/epg-sources.ts` – über **50 Länder**, mehrere Quellen pro Land. Fehlgeschlagene URLs werden übersprungen; erfolgreiche Quellen werden intelligent gemerged (Deduplizierung).

## Setup

### 1. Dependencies installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren (optional)

Erstellen Sie eine `.env` Datei für optionale Konfiguration:

```env
EPG_REVALIDATE_SECONDS=86400
```

- `EPG_REVALIDATE_SECONDS`: Cache-Dauer in Sekunden (Standard: 86400 = 24 Stunden)

Die EPG-Quellen sind direkt im Code konfiguriert (`lib/epg-service.ts`).

### 3. Development Server starten

```bash
npm run dev
```

Der Service ist dann unter `http://localhost:3000` verfügbar.

## PWA Installation

Die App kann als Progressive Web App auf allen Geräten installiert werden:

### Desktop (Chrome/Edge)
1. Öffne die Website
2. Klicke auf das Install-Icon in der Adressleiste
3. Oder: Menü → "App installieren"

### Mobile (Android)
1. Öffne die Website in Chrome
2. Tippe auf das Menü (⋮)
3. Wähle "Zum Startbildschirm hinzufügen"

### Mobile (iOS)
1. Öffne die Website in Safari
2. Tippe auf das Teilen-Symbol
3. Wähle "Zum Home-Bildschirm"

Nach der Installation:
- ✅ **Reines Live TV Erlebnis** - Nur der Enhanced TV Player ohne EPG-Service-Informationen
- ✅ **Chromecast & AirPlay Support**:
  - 📺 **Chromecast** - Streamen zu Google Cast Geräten
  - 🍎 **AirPlay** - Streamen zu Apple TV und AirPlay-Geräten
  - 📱 **Fernbedienungs-Modus** - Handy wird zur TV-Fernbedienung
  - ⏮️⏯️⏭️ **Volle Kontrolle** - Sender wechseln, Play/Pause, Lautstärke
  - 🔄 **Nahtloser Wechsel** - Sender wechseln während des Castings
  - 📡 **Status-Anzeige** - Zeigt verbundenes Gerät an
- ✅ **Touch-Optimiert für Mobilgeräte**:
  - 👆 **Doppel-Tap** = Play/Pause
  - 👈👉 **Horizontal Wischen** = Sender wechseln (vor/zurück)
  - 👆👇 **Vertikal Wischen** = Lautstärke anpassen
  - 📳 **Haptisches Feedback** bei allen Interaktionen
  - 💬 **Visuelle Gesten-Hinweise** als Feedback
- ✅ **Favoriten & History** - Deine Lieblingssender immer griffbereit
- ✅ **Last Channel Memory** - Setzt genau da fort wo du warst
- ✅ **Keyboard Shortcuts** - Space, M, F, P für schnelle Steuerung
- ✅ **Arrow Key Controls** - ←/→ Sender, ↑/↓ Lautstärke
- ✅ **Picture-in-Picture** - Multitasking beim TV schauen
- ✅ **Kategorie-Filter** - Schnelles Finden von Sendern nach Genre
- ✅ **Quick Navigation** - Große Touch-Buttons für Sender-Wechsel
- ✅ **Volume Slider** - Visueller Lautstärke-Regler
- ✅ **Vollbild-Modus** - Optimales Seherlebnis
- ✅ **Schneller Zugriff** vom Home-Screen
- ✅ **Offline-Zugriff** auf gecachte Inhalte

## API Endpoints

### GET /api/epg

Gibt die gemergten EPG Daten als XML zurück.

**Response:**
- Content-Type: `application/xml; charset=utf-8`
- Status: 200 (bei Erfolg) oder 500 (bei Fehler)

**Beispiel:**

```bash
curl http://localhost:3000/api/epg
```

### GET /api/epg/status

Gibt Informationen über den Cache-Status und die konfigurierten Quellen zurück.

**Response:**
- Content-Type: `application/json`
- Status: 200 (bei Erfolg) oder 500 (bei Fehler)

**Beispiel:**

```bash
curl http://localhost:3000/api/epg/status
```

**Response Beispiel:**

```json
{
  "cache": {
    "active": true,
    "age": 3600000,
    "ageFormatted": "1 Stunde",
    "revalidateSeconds": 86400
  },
  "sources": [
    {
      "name": "GlobeTV Germany EPG",
      "url": "https://...",
      "type": "xml"
    },
    {
      "name": "EPGShare DE1",
      "url": "https://...",
      "type": "xml.gz"
    }
  ],
  "endpoints": {
    "epg": "/api/epg",
    "status": "/api/epg/status",
    "refresh": "/api/epg/refresh"
  }
}
```

### POST /api/epg/refresh

Setzt den Cache manuell zurück. Die Daten werden beim nächsten Request neu geladen.

**Response:**
- Content-Type: `application/json`
- Status: 200 (bei Erfolg) oder 500 (bei Fehler)

**Beispiel:**

```bash
curl -X POST http://localhost:3000/api/epg/refresh
```

### GET /api/stats

Gibt die aktuellen Statistiken (Besucher und Downloads) zurück.

**Response:**
- Content-Type: `application/json`
- Status: 200 (bei Erfolg) oder 500 (bei Fehler)

**Beispiel:**

```bash
curl http://localhost:3000/api/stats
```

**Response Beispiel:**

```json
{
  "success": true,
  "stats": {
    "visitors": 42,
    "downloads": 123,
    "lastReset": 1697280000000
  }
}
```

### GET /api/share

Gibt die Anzahl der geteilten Links zurück.

**Response:**
- Content-Type: `application/json`
- Status: 200

**Beispiel:**

```bash
curl http://localhost:3000/api/share
```

**Response Beispiel:**

```json
{
  "shareCount": 42
}
```

### POST /api/share

Erhöht den Share-Counter um 1.

**Response:**
- Content-Type: `application/json`
- Status: 200

**Beispiel:**

```bash
curl -X POST http://localhost:3000/api/share
```

**Response Beispiel:**

```json
{
  "shareCount": 43
}
```

### POST /api/epg/check-update

Prüft ob die EPG-Daten aktualisiert werden müssen und triggert ein Update im Hintergrund.

**Response:**
- Content-Type: `application/json`
- Status: 200 (bei Erfolg) oder 500 (bei Fehler)

**Beispiel:**

```bash
curl -X POST http://localhost:3000/api/epg/check-update
```

**Response Beispiel:**

```json
{
  "success": true,
  "needsUpdate": true,
  "message": "Cache ist abgelaufen. Update im Hintergrund gestartet.",
  "cache": {
    "active": true,
    "age": 90000000,
    "ageFormatted": "25 Stunden",
    "revalidateSeconds": 86400
  }
}
```

## Deployment auf Vercel

### Automatisches Deployment

1. Repository mit GitHub verbinden
2. Auf Vercel importieren
3. Optional: Umgebungsvariable setzen:
   - `EPG_REVALIDATE_SECONDS` (Standard: 86400 = 24 Stunden)

### Manuelles Deployment

```bash
npm install -g vercel
vercel
```

## Architektur

### Caching-Strategie

Der Service verwendet eine mehrstufige Caching-Strategie:

1. **In-Memory Cache**: Die gemergten EPG Daten werden im Speicher gecacht
2. **Zeitbasierte Revalidierung**: Cache wird nach konfigurierbarer Zeit automatisch aktualisiert
3. **CDN Cache**: Vercel CDN cached die Responses für 1 Stunde

### EPG Merge-Prozess

1. Alle Quellen werden parallel geladen (Performance-Optimierung)
2. Komprimierte Dateien (.xml.gz) werden automatisch dekomprimiert
3. XML-Daten werden geparst und normalisiert
4. Channels werden dedupliziert (basierend auf Channel-ID)
5. Programme werden gesammelt und nach Startzeit sortiert
6. Finales XML wird generiert und cached

### Auto-Update System

Das System prüft automatisch beim Seitenaufruf, ob die EPG-Daten aktualisiert werden müssen:

1. **Beim Seitenaufruf**: Die `EpgAutoUpdater` Komponente prüft den Cache-Status
2. **Cache-Check**: Wenn Daten älter als 24 Stunden → Update wird getriggert
3. **Hintergrund-Update**: EPG-Daten werden neu geladen ohne Wartezeit
4. **Notification**: Benutzer sieht eine Benachrichtigung während des Updates
5. **Periodische Prüfung**: Alle 5 Minuten automatische Prüfung

### Dateistruktur

```
├── app/
│   ├── api/
│   │   ├── epg/
│   │   │   ├── route.ts       # EPG XML API
│   │   │   ├── status/
│   │   │   │   └── route.ts   # Status API
│   │   │   └── refresh/
│   │   │       └── route.ts   # Cache Refresh API
│   │   └── stats/
│   │       ├── route.ts       # Statistik API
│   │       └── visitor/
│   │           └── route.ts   # Besucher-Counter
│   │   └── check-update/
│   │       └── route.ts       # Auto-Update Check
│   ├── layout.tsx             # Root Layout
│   ├── page.tsx               # Homepage
│   └── globals.css            # Globale Styles
├── components/
│   ├── stats-card.tsx         # Statistik-Karten
│   ├── epg-status.tsx         # EPG Status Display
│   ├── api-endpoints.tsx      # API Endpoints Liste
│   ├── support-banner.tsx     # Support Banner
│   ├── epg-auto-updater.tsx   # Auto-Update System
│   ├── iptv-link-card.tsx     # IPTV URL Anzeige
│   ├── features-grid.tsx      # Features Grid
│   ├── quick-links.tsx        # Schnellzugriff-Links
│   ├── useful-features.tsx    # Nützliche Tools (QR, Download, etc.)
│   ├── m3u-generator.tsx      # M3U Playlist Generator
│   ├── share-buttons.tsx      # Social Share Buttons
│   ├── pwa-install-prompt.tsx # PWA Install-Aufforderung
│   └── tv-player.tsx          # Live TV Player
├── lib/
│   ├── epg-service.ts         # EPG Service Logik
│   ├── stats-service.ts       # Statistik Service
│   └── m3u-parser.ts          # M3U Playlist Parser
├── public/
│   ├── manifest.json          # PWA Manifest
│   ├── sw.js                  # Service Worker
│   └── icon.svg               # App Icon
├── next.config.ts             # Next.js Konfiguration
├── tailwind.config.ts         # Tailwind Konfiguration
├── vercel.json                # Vercel Deployment Config
├── package.json
├── tsconfig.json
└── README.md
```

## Performance

- Automatisches Caching reduziert externe API Calls
- Vercel Edge Network für globale Verfügbarkeit
- Komprimierte Übertragung durch CDN
- Optimierte React Components mit Framer Motion
- Client-Side Caching für Statistiken

## Unterstützung

Gefällt dir dieses Projekt? Unterstütze die Entwicklung:

🎁 [Amazon Wunschzettel](https://www.amazon.de/hz/wishlist/ls/2K3UPHK4UWCXP?type=wishlist&filter=all&sort=price-asc&viewType=list)

## Lizenz

MIT

