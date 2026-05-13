'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="surface relative overflow-hidden p-12"
        >
          {/* Decorative glow */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-accent-subtle)] via-transparent to-[var(--color-secondary-muted)] opacity-40" />

          <div className="relative">
            <p className="mb-4 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase">
              Free to use
            </p>
            <h2 className="font-display font-700 mb-4 text-4xl tracking-tight">
              Start exploring Irish data
            </h2>
            <p className="mx-auto mb-8 max-w-lg leading-relaxed text-[var(--color-foreground-muted)]">
              Create a free account to save your dashboard configurations and access the full suite
              of analytics tools. No credit card required.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="glow-accent flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-7 py-3.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:bg-[var(--color-accent-hover)] active:scale-[0.98] sm:w-auto"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-7 py-3.5 text-sm font-medium text-[var(--color-foreground-muted)] transition-all hover:border-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground)] sm:w-auto"
              >
                Browse as guest
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
