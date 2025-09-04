export interface RetryOptions {
  retries?: number;
  timeoutMs?: number;
  backoffMs?: number;
  headers?: Record<string, string>;
}

export async function fetchWithRetry(url: string, init: RequestInit = {}, opts: RetryOptions = {}) {
  const { retries = 2, timeoutMs = 5000, backoffMs = 500, headers = {} } = opts;
  let attempt = 0;
  let lastErr: any = null;
  while (attempt <= retries) {
    const ac = new AbortController();
    const id = setTimeout(() => ac.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        ...init,
        signal: ac.signal,
        headers: { "User-Agent": "TripGenius/1.0 (builder.codes)", ...(init.headers || {}), ...headers },
      });
      clearTimeout(id);
      if (res.ok) return res;
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (e) {
      lastErr = e;
    }
    // backoff
    await new Promise((r) => setTimeout(r, backoffMs * (attempt + 1)));
    attempt++;
  }
  throw lastErr || new Error("fetchWithRetry failed");
}

export async function fetchJsonWithRetry<T = any>(url: string, init: RequestInit = {}, opts: RetryOptions = {}) {
  const res = await fetchWithRetry(url, init, opts);
  try {
    return (await res.json()) as T;
  } catch {
    throw new Error("Invalid JSON response");
  }
}
