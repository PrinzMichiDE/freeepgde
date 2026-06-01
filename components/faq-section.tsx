'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Ist der EPG Service wirklich kostenlos?',
    answer:
      'Ja, der Service ist komplett kostenlos und ohne Registrierung nutzbar. Es gibt keine versteckten Kosten oder Limits.',
  },
  {
    question: 'Wie oft werden die EPG-Daten aktualisiert?',
    answer:
      'Die EPG-Daten werden täglich automatisch aktualisiert. Du kannst die Aktualisierung auch manuell über den Refresh-Button triggern.',
  },
  {
    question: 'Welche IPTV-Apps werden unterstützt?',
    answer:
      'Alle gängigen IPTV-Apps die XMLTV unterstützen: TiviMate, IPTV Smarters Pro, Perfect Player, Kodi und viele mehr.',
  },
  {
    question: 'Warum zeigt meine App keine EPG-Daten an?',
    answer:
      'Stelle sicher, dass die EPG-URL korrekt eingefügt wurde und die tvg-id in deiner M3U-Playlist mit den Channel-IDs im EPG übereinstimmen.',
  },
  {
    question: 'Gibt es eine API für Entwickler?',
    answer:
      'Ja. Die EPG-Daten sind über /api/epg als XML verfügbar, dazu /api/epg/status für Metadaten.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <p className="section-label mb-2">FAQ</p>
      <p className="mb-6 text-sm text-zinc-400">
        Antworten auf die wichtigsten Fragen zum EPG Service
      </p>

      <div className="divide-y divide-zinc-800 rounded-xl border border-zinc-800">
        {faqs.map((faq, index) => (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-zinc-200 hover:bg-zinc-900/50"
            >
              {faq.question}
              <ChevronDownIcon
                className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="border-t border-zinc-800/50 px-5 pb-4 pt-0">
                <p className="text-sm leading-relaxed text-zinc-500">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
