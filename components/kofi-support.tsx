'use client';

const CoffeeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 21h18v-2H2v2zM20 8h-2V5c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v3H2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zM6 5h10v3H6V5zm14 9H4v-2h16v2z" />
  </svg>
);

interface KoFiSupportProps {
  variant?: 'hero' | 'card' | 'compact';
  className?: string;
}

export function KoFiSupport({ variant = 'card', className = '' }: KoFiSupportProps) {
  const koFiUrl = 'https://ko-fi.com/michelfritzsch';

  if (variant === 'compact') {
    return (
      <a
        href={koFiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 ${className}`}
      >
        <CoffeeIcon className="h-4 w-4" />
        Ko-Fi
      </a>
    );
  }

  return (
    <div className={`card p-6 ${className}`}>
      <p className="text-sm font-medium text-zinc-200">Projekt unterstützen</p>
      <p className="mt-1 text-sm text-zinc-500">
        Gefällt dir der kostenlose EPG Service? Unterstütze die Entwicklung auf Ko-Fi.
      </p>
      <a
        href={koFiUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost mt-4 w-full border-[#FF5E5B]/30 text-[#FF8A88] hover:border-[#FF5E5B]/50 hover:bg-[#FF5E5B]/10"
      >
        <CoffeeIcon className="h-4 w-4" />
        Auf Ko-Fi unterstützen
      </a>
    </div>
  );
}
