'use client';

import { motion } from 'framer-motion';
import { Home, Briefcase, Cloud, Bookmark, Download, Shield } from 'lucide-react';

const FEATURES = [
  {
    icon: Home,
    title: 'Housing Market',
    description:
      'Track residential property prices and rental indices county by county, from CSO RPPI data going back a decade.',
    colour: 'var(--color-chart-1)',
  },
  {
    icon: Briefcase,
    title: 'Employment Trends',
    description:
      'Visualise unemployment rates, sectoral breakdowns, and Ireland vs EU comparisons from Labour Force Survey data.',
    colour: 'var(--color-chart-2)',
  },
  {
    icon: Cloud,
    title: 'Climate & Weather',
    description:
      "Explore monthly temperature, rainfall, and sunshine hours from Met Éireann's historical climate records.",
    colour: 'var(--color-chart-3)',
  },
  {
    icon: Bookmark,
    title: 'Saved Dashboards',
    description:
      'Save your filter configurations as named dashboards and pick up exactly where you left off.',
    colour: 'var(--color-chart-4)',
  },
  {
    icon: Download,
    title: 'CSV Export',
    description:
      'Download any dataset as a clean CSV file, ready to open in Excel, R, or a Jupyter notebook.',
    colour: 'var(--color-chart-5)',
  },
  {
    icon: Shield,
    title: 'Secure Auth',
    description:
      'Sign in with Google or email. Your saved dashboards are private to your account, stored in Firestore.',
    colour: 'var(--color-chart-6)',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-xs font-semibold tracking-widest text-[var(--color-accent)] uppercase"
          >
            What you get
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="font-display font-700 mb-4 text-4xl tracking-tight"
          >
            Everything in one place
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto max-w-xl text-[var(--color-foreground-muted)]"
          >
            Three data modules, interactive filtering, and a clean interface designed for analysts
            and curious citizens alike.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="surface group p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--color-border-subtle)]"
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: feature.colour + '18' }}
              >
                <feature.icon
                  className="h-5 w-5"
                  style={{ color: feature.colour }}
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="font-display font-600 mb-2 text-[var(--color-foreground)]">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-foreground-muted)]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
