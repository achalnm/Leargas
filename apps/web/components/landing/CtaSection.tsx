'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="surface p-12 relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-subtle)] via-transparent to-[var(--color-secondary-muted)] opacity-40 pointer-events-none" />

          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-4">
              Free to use
            </p>
            <h2 className="text-4xl font-display font-700 tracking-tight mb-4">
              Start exploring Irish data
            </h2>
            <p className="text-[var(--color-foreground-muted)] mb-8 max-w-lg mx-auto leading-relaxed">
              Create a free account to save your dashboard configurations and access the full suite
              of analytics tools. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98] glow-accent w-full sm:w-auto justify-center"
              >
                Create free account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-[var(--color-border)] text-[var(--color-foreground-muted)] font-medium text-sm hover:border-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground)] transition-all w-full sm:w-auto justify-center"
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
