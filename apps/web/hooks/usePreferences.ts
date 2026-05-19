'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { UserPreferences } from '@/types';

const DEFAULTS: UserPreferences = { numberFormat: 'western' };

export function usePreferences(userId: string | undefined) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getDoc(doc(db, 'userPreferences', userId))
      .then((snap) => {
        if (snap.exists()) setPreferences({ ...DEFAULTS, ...(snap.data() as UserPreferences) });
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const update = useCallback(
    async (patch: Partial<UserPreferences>) => {
      if (!userId) return;
      const next = { ...preferences, ...patch };
      setPreferences(next);
      await setDoc(doc(db, 'userPreferences', userId), next, { merge: true });
    },
    [userId, preferences]
  );

  return { preferences, loading, update };
}
