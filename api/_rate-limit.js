const buckets =
  globalThis.__asivantaRateLimitBuckets ||
  (globalThis.__asivantaRateLimitBuckets = new Map());

function clientAddress(req) {
  const value =
    req.headers["x-vercel-forwarded-for"] ||
    req.headers["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    "unknown";
  return String(Array.isArray(value) ? value[0] : value)
    .split(",")[0]
    .trim()
    .slice(0, 80);
}

export function enforceRateLimit(
  req,
  res,
  { name, limit, windowMs },
) {
  const now = Date.now();
  const key = `${name}:${clientAddress(req)}`;
  const current = buckets.get(key);
  const bucket =
    !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

  bucket.count += 1;
  buckets.set(key, bucket);

  const remaining = Math.max(0, limit - bucket.count);
  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader("X-RateLimit-Remaining", String(remaining));
  res.setHeader("X-RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

  if (bucket.count <= limit) return true;

  res.setHeader(
    "Retry-After",
    String(Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))),
  );
  res.status(429).json({
    error: "Too many requests. Please wait a few minutes and try again.",
  });
  return false;
}
