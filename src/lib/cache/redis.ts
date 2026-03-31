import { Redis } from '@upstash/redis';

/**
 * Upstash Redis client singleton
 * Falls back to in-memory cache if env vars are not set (for development)
 */
let redisClient: Redis | null = null;
const memoryCache = new Map<string, { value: string; expiry: number }>();

export function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn('Upstash Redis credentials not found. Using in-memory cache for development.');
    return null;
  }

  try {
    redisClient = new Redis({
      url,
      token,
    });
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize Redis client:', error);
    return null;
  }
}

/**
 * Get value from cache (Redis or memory fallback)
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const value = await redis.get(key);
      return value as T | null;
    } catch (error) {
      console.error('Redis get error:', error);
    }
  }

  // Memory fallback
  const entry = memoryCache.get(key);
  if (entry && entry.expiry > Date.now()) {
    return JSON.parse(entry.value) as T;
  }
  if (entry) {
    memoryCache.delete(key);
  }
  return null;
}

/**
 * Set value in cache (Redis or memory fallback)
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttl: number
): Promise<void> {
  const redis = getRedisClient();
  const serialized = JSON.stringify(value);

  if (redis) {
    try {
      await redis.set(key, serialized, { ex: ttl });
      return;
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  // Memory fallback
  memoryCache.set(key, {
    value: serialized,
    expiry: Date.now() + ttl * 1000,
  });
}

/**
 * Delete value from cache
 */
export async function cacheDelete(key: string): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  memoryCache.delete(key);
}

/**
 * Clear all cache
 */
export async function cacheClear(): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    try {
      const keys = await redis.keys('*');
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }

  memoryCache.clear();
}

/**
 * Check if key exists in cache
 */
export async function cacheExists(key: string): Promise<boolean> {
  const redis = getRedisClient();

  if (redis) {
    try {
      return (await redis.exists(key)) === 1;
    } catch (error) {
      console.error('Redis exists error:', error);
    }
  }

  const entry = memoryCache.get(key);
  return entry !== undefined && entry.expiry > Date.now();
}

/**
 * Generate cache key with namespace
 */
export function generateCacheKey(namespace: string, ...parts: string[]): string {
  return `${namespace}:${parts.join(':')}`;
}
