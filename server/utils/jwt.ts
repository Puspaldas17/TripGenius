import crypto from "crypto";

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function signJwt(
  payload: Record<string, unknown>,
  secret: string,
  expiresInSec = 60 * 60 * 24 * 7,
) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { iat: now, exp: now + expiresInSec, ...payload } as Record<
    string,
    unknown
  >;
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(body))}`;
  const sig = crypto.createHmac("sha256", secret).update(unsigned).digest();
  return `${unsigned}.${base64url(sig)}`;
}

export function verifyJwt(token: string, secret: string) {
  const [h, p, s] = token.split(".");
  if (!h || !p || !s) return null;
  const unsigned = `${h}.${p}`;
  const expected = base64url(
    crypto.createHmac("sha256", secret).update(unsigned).digest(),
  );
  if (expected !== s) return null;
  const payload = JSON.parse(Buffer.from(p, "base64").toString());
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === "number" && payload.exp < now) return null;
  return payload;
}
