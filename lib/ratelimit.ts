import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 3 free scans per IP per 24 hours
export const freeScanLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "24 h"),
  analytics: true,
  prefix: "ratelimit:free-scan",
});
