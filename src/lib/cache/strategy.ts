import { cacheGet, cacheSet, cacheDelete, generateCacheKey } from './redis';
import { CACHE_CONFIG } from '@/types';

export interface CacheStrategyOptions<T> {
  key: string;
  ttl?: number;
  staleWhileRevalidate?: number;
  fetcher: () => Promise<T>;
  namespace?: string;
}

/**
 * Generic cache wrapper with stale-while-revalidate strategy
 */
export async function withCache<T>({
  key,
  ttl = 3600,
  staleWhileRevalidate,
  fetcher,
  namespace = 'datahub',
}: CacheStrategyOptions<T>): Promise<{ data: T; cached: boolean }> {
  const cacheKey = generateCacheKey(namespace, key);

  // Try to get from cache
  const cached = await cacheGet<{ data: T; timestamp: number }>(cacheKey);

  const now = Date.now();
  const staleThreshold = staleWhileRevalidate
    ? now - (ttl - staleWhileRevalidate) * 1000
    : now - ttl * 1000;

  // Return stale data if exists and within stale threshold
  if (cached && cached.timestamp > staleThreshold) {
    return { data: cached.data, cached: true };
  }

  // Fetch fresh data
  try {
    const freshData = await fetcher();

    // Cache the fresh data
    await cacheSet(
      cacheKey,
      { data: freshData, timestamp: now },
      ttl
    );

    return { data: freshData, cached: false };
  } catch (error) {
    // Return stale data if fetch fails
    if (cached) {
      console.warn(`Fetch failed for ${key}, returning stale data:`, error);
      return { data: cached.data, cached: true };
    }
    throw error;
  }
}

/**
 * Invalidate cache by key pattern
 */
export async function invalidateCache(
  pattern: string,
  namespace: string = 'datahub'
): Promise<void> {
  // For simplicity, we'll clear the entire cache
  // In production, you might want to use Redis SCAN for pattern matching
  await cacheDelete(generateCacheKey(namespace, pattern));
}

/**
 * Cache wrapper specifically for GitHub stats
 */
export async function withGitHubCache<T>(
  repo: string,
  fetcher: () => Promise<T>
): Promise<{ data: T; cached: boolean }> {
  return withCache({
    key: `github:${repo}`,
    ttl: CACHE_CONFIG.GITHUB_STATS.ttl,
    staleWhileRevalidate: CACHE_CONFIG.GITHUB_STATS.staleWhileRevalidate,
    fetcher,
    namespace: 'github',
  });
}

/**
 * Cache wrapper specifically for tool data
 */
export async function withToolCache<T>(
  toolId: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<{ data: T; cached: boolean }> {
  return withCache({
    key: `tool:${toolId}`,
    ttl: ttl || CACHE_CONFIG.TOOL_DETAIL.ttl,
    fetcher,
    namespace: 'tools',
  });
}

/**
 * Cache wrapper specifically for pricing data
 */
export async function withPricingCache<T>(
  toolId: string,
  fetcher: () => Promise<T>
): Promise<{ data: T; cached: boolean }> {
  return withCache({
    key: `pricing:${toolId}`,
    ttl: CACHE_CONFIG.PRICING.ttl,
    fetcher,
    namespace: 'pricing',
  });
}

/**
 * Cache wrapper specifically for review data
 */
export async function withReviewCache<T>(
  toolId: string,
  fetcher: () => Promise<T>
): Promise<{ data: T; cached: boolean }> {
  return withCache({
    key: `reviews:${toolId}`,
    ttl: CACHE_CONFIG.REVIEWS.ttl,
    fetcher,
    namespace: 'reviews',
  });
}

/**
 * Batch cache get for multiple keys
 */
export async function batchCacheGet<T>(
  keys: string[],
  namespace: string = 'datahub'
): Promise<Map<string, T>> {
  const result = new Map<string, T>();

  await Promise.all(
    keys.map(async (key) => {
      const cacheKey = generateCacheKey(namespace, key);
      const value = await cacheGet<T>(cacheKey);
      if (value) {
        result.set(key, value);
      }
    })
  );

  return result;
}

/**
 * Prefetch multiple cache keys
 */
export async function prefetchCache<T>(
  items: Array<{ key: string; fetcher: () => Promise<T> }>,
  namespace: string = 'datahub'
): Promise<void> {
  await Promise.allSettled(
    items.map(({ key, fetcher }) =>
      withCache({
        key,
        fetcher,
        namespace,
      })
    )
  );
}
