'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function CtaSection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="survey-frame bg-[var(--color-ground)] p-12 text-center"
        >
          <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-[var(--color-ink-soft)]">
            FREE TO USE · NO CREDIT CARD REQUIRED
          </p>
          <h2
            className="font-display mb-4 text-4xl font-semibold tracking-tight text-[var(--color-ink)]"
            style={{ fontVariationSettings: '"opsz" 36' }}
          >
            Start surveying Irish data
          </h2>
          <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-[var(--color-ink-soft)]">
            Create a free account to save your dashboard configurations and access the full suite of
            analytics tools.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center border border-[var(--color-atlantic)] bg-[var(--color-atlantic)] px-7 py-3.5 font-mono text-sm tracking-wider text-[var(--color-ground)] transition-all hover:bg-[var(--color-accent-hover)] sm:w-auto"
              style={{ borderRadius: '2px' }}
            >
              Create free account
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex w-full items-center justify-center border border-[var(--color-graticule)] px-7 py-3.5 font-mono text-sm tracking-wider text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] sm:w-auto"
              style={{ borderRadius: '2px' }}
            >
              Browse as guest
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
