import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-ground)] px-6 text-center">
      <p className="font-mono text-xs tracking-widest text-[var(--color-ink-soft)]">SHEET 404</p>
      <h1
        className="font-display mt-4 text-6xl font-semibold text-[var(--color-ink)]"
        style={{ fontVariationSettings: '"opsz" 36' }}
      >
        Not found
      </h1>
      <p className="mt-4 max-w-sm text-sm text-[var(--color-foreground-muted)]">
        This sheet does not exist in the survey. It may have been moved or the URL is wrong.
      </p>
      <Link
        href="/"
        className="mt-8 border border-[var(--color-ink)] px-6 py-2.5 font-mono text-xs tracking-wider text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-ground)]"
      >
        BACK TO INDEX
      </Link>
    </div>
  );
}
