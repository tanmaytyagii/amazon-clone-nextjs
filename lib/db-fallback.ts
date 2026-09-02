let warnedScopes: Set<string> | null = null;

/**
 * Single-line, no-stack-trace notice used when a DB-backed lookup falls back
 * to static data. Deliberately does not log the underlying error object —
 * driver-level connection errors can be noisy and are not useful in dev,
 * and this avoids ever printing connection details to the console.
 * Each scope only logs once per server process to avoid flooding the
 * terminal when a single page triggers several fallback lookups.
 */
export function logDbFallback(scope: string) {
  warnedScopes ??= new Set();
  if (warnedScopes.has(scope)) return;
  warnedScopes.add(scope);
  console.warn(`[db] ${scope}: database unavailable, using fallback data (further ${scope} warnings suppressed this run).`);
}
