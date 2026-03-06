import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasRedis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasRedis
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

const noopLimiter = {
  limit: async () =>
    ({ success: true as const, limit: 3, remaining: 3, reset: 0, pending: Promise.resolve() }) as Awaited<
      ReturnType<Ratelimit["limit"]>
    >,
};

export const freeScanLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "24 h"),
      analytics: true,
      prefix: "ratelimit:free-scan",
    })
  : (noopLimiter as unknown as Ratelimit);
