export async function safeFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    return await fetch(input, init);
  } catch {
    return new Response(null, { status: 0 });
  }
}

let serverOk = false;
let apiBase = "/api";

export async function ensureServer(): Promise<boolean> {
  if (serverOk) return true;
  const timeout = (ms: number) =>
    new Promise<never>((_, rej) =>
      setTimeout(() => rej(new Error("timeout")), ms),
    );
  const probe = async (base: string) => {
    try {
      const res = await Promise.race([
        safeFetch(`${base}/ping`),
        timeout(1500),
      ]);
      if (!res.ok) return false;
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) return false;
      const j = await res.json().catch(() => null as any);
      return !!j && typeof j === "object" && "message" in j;
    } catch {
      return false;
    }
  };
  if (await probe("/api")) {
    apiBase = "/api";
    serverOk = true;
    return true;
  }
  if (await probe("/.netlify/functions/api")) {
    apiBase = "/.netlify/functions/api";
    serverOk = true;
    return true;
  }
  serverOk = false;
  return false;
}

export function getApiBase() {
  return apiBase;
}
