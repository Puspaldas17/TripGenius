import { createClient, RedisClientType } from "redis";
import { logger } from "./logger";
import { env } from "./env";

// ─── Redis Setup ─────────────────────────────────────────────────────────────

let redisClient: RedisClientType | null = null;
let isRedisConnected = false;

// Graceful fallback to in-memory map if Redis is not configured or fails
const localCache = new Map<
  string,
  { ts: number; expireAt: number; data: any }
>();

export async function initRedis() {
  const url = env().REDIS_URL;
  if (!url) {
    logger.info("cache", "No REDIS_URL provided. Using local memory cache.");
    return;
  }

  try {
    redisClient = createClient({ url });

    redisClient.on("error", (err) => {
      logger.error("cache", "Redis connection error", err);
      isRedisConnected = false;
    });

    redisClient.on("ready", () => {
      logger.info("cache", "Redis connected successfully");
      isRedisConnected = true;
    });

    await redisClient.connect();
  } catch (error) {
    logger.error("cache", "Failed to initialize Redis", error);
    redisClient = null;
    isRedisConnected = false;
  }
}

// ─── Caching Utility ─────────────────────────────────────────────────────────

/**
 * Attempts to retrieve a key from cache. If not found, it runs the `fetcher`
 * function, stores the result, and returns it.
 *
 * @param key Unique string identifier for this data
 * @param fetcher Async function that generates the data if cache miss
 * @param ttlSeconds How long the data should live in cache
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600,
): Promise<T> {
  try {
    // 1. Check Redis
    if (isRedisConnected && redisClient) {
      const cachedStr = await redisClient.get(key);
      if (typeof cachedStr === "string") {
        return JSON.parse(cachedStr) as T;
      }
    } else {
      // 1b. Check local memory cache
      const localStr = localCache.get(key);
      const now = Date.now();
      if (localStr && now < localStr.expireAt) {
        return localStr.data as T;
      } else if (localStr) {
        localCache.delete(key); // Evict expired
      }
    }
  } catch (error) {
    logger.warn("cache", `Error reading cache for ${key}`, error);
    // Proceed to fetcher on cache error
  }

  // 2. Cache miss, run fetcher
  const data = await fetcher();

  // 3. Store result
  try {
    if (isRedisConnected && redisClient) {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
    } else {
      localCache.set(key, {
        ts: Date.now(),
        expireAt: Date.now() + ttlSeconds * 1000,
        data,
      });
    }
  } catch (error) {
    logger.warn("cache", `Error writing cache for ${key}`, error);
  }

  return data;
}
