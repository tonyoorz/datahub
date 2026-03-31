'use client';

import { useState, useEffect } from 'react';
import { TrendData } from '@/types';

interface UseTrendsResult {
  trends: TrendData[];
  loading: boolean;
  error: string | null;
}

export function useTrends(toolIds?: string[], period: '30d' | '90d' = '30d'): UseTrendsResult {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrends() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set('period', period);

        const res = await fetch(`/api/trends?${params.toString()}`);

        if (!res.ok) {
          throw new Error('Failed to fetch trends');
        }

        const data = await res.json();

        if (data.success && data.data) {
          let trendsData = Array.isArray(data.data) ? data.data : [data.data];

          // Filter by tool IDs if provided
          if (toolIds && toolIds.length > 0) {
            trendsData = trendsData.filter((t: TrendData) => toolIds.includes(t.toolId));
          }

          setTrends(trendsData);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err: any) {
        setError(err.message);
        setTrends([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTrends();
  }, [period, toolIds]);

  return { trends, loading, error };
}
