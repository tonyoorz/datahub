'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tool, FilterOptions, SortOptions, ApiResponse } from '@/types';

interface UseToolDataResult {
  tools: Tool[];
  loading: boolean;
  error: string | null;
  total: number;
  refresh: () => void;
}

export function useToolData(
  filters?: FilterOptions,
  sort?: SortOptions
): UseToolDataResult {
  const [data, setData] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.category) params.set('category', filters.category);
      if (filters?.minRating) params.set('minRating', filters.minRating.toString());
      if (filters?.pricing) params.set('pricing', filters.pricing);
      if (filters?.tags) params.set('tags', filters.tags.join(','));
      if (filters?.search) params.set('search', filters.search);
      if (sort?.field) params.set('sortBy', sort.field);
      if (sort?.order) params.set('order', sort.order);

      const res = await fetch(`/api/tools?${params.toString()}`);

      if (!res.ok) {
        throw new Error('Failed to fetch tools');
      }

      const response: ApiResponse<{ tools: Tool[]; total: number }> = await res.json();

      if (response.success && response.data) {
        setData(response.data.tools);
        setTotal(response.data.total);
      } else {
        throw new Error(response.error || 'Unknown error');
      }
    } catch (err: any) {
      setError(err.message);
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    tools: data,
    loading,
    error,
    total,
    refresh: fetchData,
  };
}

/**
 * Hook for fetching a single tool by ID
 */
export function useToolDetail(toolId: string) {
  const [tool, setTool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTool() {
      if (!toolId) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/tools/${toolId}`);

        if (!res.ok) {
          throw new Error('Failed to fetch tool');
        }

        const response: ApiResponse<any> = await res.json();

        if (response.success && response.data) {
          setTool(response.data);
        } else {
          throw new Error(response.error || 'Unknown error');
        }
      } catch (err: any) {
        setError(err.message);
        setTool(null);
      } finally {
        setLoading(false);
      }
    }

    fetchTool();
  }, [toolId]);

  return { tool, loading, error };
}
