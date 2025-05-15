const ipRequestCounts = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 4;

export function isRateLimited(ip: string): boolean {
  const currentTime = Date.now();
  const entry = ipRequestCounts.get(ip);

  if (!entry || currentTime - entry.timestamp > RATE_LIMIT_WINDOW_MS) {
    ipRequestCounts.set(ip, { count: 1, timestamp: currentTime });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  ipRequestCounts.set(ip, entry);
  return false;
}

