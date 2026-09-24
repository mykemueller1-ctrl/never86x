type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

/** In-memory limiter. Honesty: Missing distributed store unless UPSTASH_* set later. */
export function rateLimit(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || cur.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, reset: now + windowMs };
  }
  if (cur.count >= limit) {
    return { ok: false, remaining: 0, reset: cur.reset };
  }
  cur.count += 1;
  return { ok: true, remaining: limit - cur.count, reset: cur.reset };
}
