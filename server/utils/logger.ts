export function logError(scope: string, err: any) {
  const ts = new Date().toISOString();
  const msg = (err && (err.stack || err.message)) || String(err);
  // eslint-disable-next-line no-console
  console.error(`[${ts}] [${scope}]`, msg);
}
