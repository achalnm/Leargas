import Link from 'next/link';

export default function AuthLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center bg-[var(--color-ground)] px-6 py-12"
      style={{
        backgroundImage:
          'linear-gradient(var(--color-graticule) 1px, transparent 1px), linear-gradient(90deg, var(--color-graticule) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    >
      {/* Wordmark */}
      <div className="mb-10 text-center">
        <Link href="/" className="inline-block">
          <span
            className="font-display text-2xl font-semibold text-[var(--color-ink)]"
            style={{ fontVariationSettings: '"opsz" 36' }}
          >
            Léargas
          </span>
        </Link>
        <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-[var(--color-ink-soft)]">
          IRISH DATA SURVEY
        </p>
      </div>

      <div className="w-full max-w-md">{children}</div>

      <p className="mt-10 font-mono text-[9px] tracking-widest text-[var(--color-graticule)]">
        CSO · MET ÉIREANN · PUBLIC DATA
      </p>
    </div>
  );
}
