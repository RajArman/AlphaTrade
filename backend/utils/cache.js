import { createClient } from "redis";

// Redis is an optional performance optimization - MongoDB remains the
// source of truth everywhere. If REDIS_URL isn't set, `client` stays
// null and every function below becomes a safe no-op: reads always miss,
// writes/invalidations do nothing. No Redis server is required to run
// this app or its tests.
const CACHE_TTL_SECONDS = 60;

let client = null;

if (process.env.REDIS_URL) {
  client = createClient({ url: process.env.REDIS_URL });

  // node-redis emits 'error' on connection problems, and an unhandled
  // 'error' event crashes the Node process - this listener is what keeps
  // a Redis outage from ever taking the app down with it. Every call
  // below also has its own try/catch, so this is a backstop, not the
  // only guard.
  let lastLoggedError = null;
  client.on("error", (err) => {
    if (lastLoggedError !== err.message) {
      console.error("Redis client error - caching disabled until recovered:", err.message);
      lastLoggedError = err.message;
    }
  });

  client.connect().catch((err) => {
    console.error("Redis initial connection failed - caching disabled:", err.message);
  });
}

export const buildDashboardSummaryCacheKey = (userId) => `dashboard:summary:${userId}`;

const isUsable = (redisClient) => Boolean(redisClient && redisClient.isReady);

export const getCachedDashboardSummary = async (userId, redisClient = client) => {
  if (!isUsable(redisClient)) {
    return null;
  }

  try {
    const cached = await redisClient.get(buildDashboardSummaryCacheKey(userId));
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error("Redis GET failed, falling back to MongoDB:", err.message);
    return null;
  }
};

export const setCachedDashboardSummary = async (userId, data, redisClient = client) => {
  if (!isUsable(redisClient)) {
    return;
  }

  try {
    await redisClient.set(buildDashboardSummaryCacheKey(userId), JSON.stringify(data), {
      expiration: { type: "EX", value: CACHE_TTL_SECONDS },
    });
  } catch (err) {
    console.error("Redis SET failed, continuing without caching this response:", err.message);
  }
};

export const invalidateDashboardSummary = async (userId, redisClient = client) => {
  if (!isUsable(redisClient)) {
    return;
  }

  try {
    await redisClient.del(buildDashboardSummaryCacheKey(userId));
  } catch (err) {
    console.error("Redis DEL failed, cached summary may be stale until TTL expiry:", err.message);
  }
};
