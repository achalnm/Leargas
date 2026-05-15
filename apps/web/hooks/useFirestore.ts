'use client';

import { useState, useCallback } from 'react';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { SavedDashboard, FilterState, DataModule } from '@/types';

export function useSavedDashboards(userId: string | undefined) {
  const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'savedDashboards'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => {
        const raw = d.data() as DocumentData;
        return {
          id: d.id,
          userId: raw.userId as string,
          name: raw.name as string,
          module: raw.module as DataModule,
          filters: raw.filters as FilterState,
          createdAt: raw.createdAt?.toDate?.().toISOString() ?? new Date().toISOString(),
          updatedAt: raw.updatedAt?.toDate?.().toISOString() ?? new Date().toISOString(),
        } satisfies SavedDashboard;
      });
      setDashboards(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch dashboards');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const save = useCallback(
    async (name: string, module: DataModule, filters: FilterState) => {
      if (!userId) return;
      await addDoc(collection(db, 'savedDashboards'), {
        userId,
        name,
        module,
        filters,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await fetch();
    },
    [userId, fetch]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteDoc(doc(db, 'savedDashboards', id));
      setDashboards((prev) => prev.filter((d) => d.id !== id));
    },
    []
  );

  return { dashboards, loading, error, fetch, save, remove };
}
