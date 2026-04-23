'use client';

import { useState, useEffect, useCallback } from 'react';
import { GitHubStats } from '@/types';
import { hasGitHubIntegration } from '@/lib/githubRepos';

interface UseGitHubStatsResult {
  stats: GitHubStats | null;
  loading: boolean;
  error: string | null;
  cached: boolean;
  refresh: () => Promise<void>;
}

export function useGitHubStats(toolId: string): UseGitHubStatsResult {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);
  const hasIntegration = hasGitHubIntegration(toolId);

  const fetchStats = useCallback(async () => {
    if (!toolId || !hasIntegration) {
      setStats(null);
      setCached(false);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/github?toolId=${toolId}`);

      if (!res.ok) {
        throw new Error('Failed to fetch GitHub stats');
      }

      const data = await res.json();

      if (data.success && data.data) {
        setStats(data.data);
        setCached(data.cached || false);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err: any) {
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [toolId, hasIntegration]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    cached,
    refresh: fetchStats,
  };
}

/**
 * Hook for fetching multiple GitHub stats
 */
export function useBatchGitHubStats(toolIds: string[]) {
  const [statsMap, setStatsMap] = useState<Map<string, GitHubStats>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const validToolIds = toolIds.filter((toolId) => hasGitHubIntegration(toolId));

      if (validToolIds.length === 0) {
        setStatsMap(new Map());
        setLoading(false);
        return;
      }

      setLoading(true);
      const map = new Map<string, GitHubStats>();

      await Promise.all(
        validToolIds.map(async (toolId) => {
          try {
            const res = await fetch(`/api/github?toolId=${toolId}`);
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.data) {
                map.set(toolId, data.data);
              }
            }
          } catch (err) {
            console.error(`Failed to fetch stats for ${toolId}:`, err);
          }
        })
      );

      setStatsMap(map);
      setLoading(false);
    }

    fetchAll();
  }, [toolIds]);

  return { statsMap, loading };
}
