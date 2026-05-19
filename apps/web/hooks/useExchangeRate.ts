'use client';

import { useState, useEffect } from 'react';

interface RateCache {
  rate: number;
  fetchedAt: number;
}

const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_KEY = 'leargas_eur_inr_rate';

function readCache(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(CACHE_KEY);
    if (!item) return null;
    const parsed: RateCache = JSON.parse(item);
    return Date.now() - parsed.fetchedAt < CACHE_TTL_MS ? parsed.rate : null;
  } catch {
    return null;
  }
}

export function useExchangeRate() {
  const [rate, setRate] = useState<number | null>(readCache);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rate !== null) return;
    setLoading(true);
    fetch('https://api.frankfurter.app/latest?from=EUR&to=INR')
      .then((r) => r.json())
      .then((data) => {
        const inrRate: number = data.rates?.INR;
        if (inrRate) {
          setRate(inrRate);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ rate: inrRate, fetchedAt: Date.now() }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [rate]);

  return { rate, loading };
}
