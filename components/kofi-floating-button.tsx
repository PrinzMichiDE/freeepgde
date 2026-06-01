'use client';

import { useState, useEffect } from 'react';

const CoffeeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 21h18v-2H2v2zM20 8h-2V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v3H2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM6 5h10v3H6V5zm14 9H4v-2h16v2z" />
  </svg>
);

export function KoFiFloatingButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="https://ko-fi.com/michelfritzsch"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-[#FF8A88] shadow-lg transition-colors hover:border-zinc-600 hover:bg-zinc-800"
      aria-label="Auf Ko-Fi unterstützen"
    >
      <CoffeeIcon className="h-5 w-5" />
    </a>
  );
}
