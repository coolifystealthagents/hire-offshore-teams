export const canonicalHost = 'hireoffshoreteams.com';

function normalizedHost(value: string) {
  const host = value.trim().toLowerCase();
  if (host.startsWith('[')) {
    const closingBracket = host.indexOf(']');
    return closingBracket === -1 ? host : host.slice(1, closingBracket);
  }
  return host.split(':')[0];
}

export function originalProtocol(cloudflareVisitor: string | null, forwardedProtocol: string | null, fallbackProtocol: string) {
  if (cloudflareVisitor) {
    try {
      const scheme = JSON.parse(cloudflareVisitor)?.scheme;
      if (scheme === 'http' || scheme === 'https') return scheme;
    } catch {
      // Fall through to validated proxy metadata when edge JSON is malformed.
    }
  }

  const forwarded = forwardedProtocol?.split(',')[0]?.trim().toLowerCase();
  if (forwarded === 'http' || forwarded === 'https') return forwarded;
  return fallbackProtocol.replace(':', '').toLowerCase();
}

export function canonicalRedirectFor(input: {
  host: string;
  cloudflareVisitor: string | null;
  forwardedProtocol: string | null;
  fallbackProtocol: string;
  pathname: string;
  search: string;
}) {
  const host = normalizedHost(input.host);
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return null;

  const protocol = originalProtocol(input.cloudflareVisitor, input.forwardedProtocol, input.fallbackProtocol);
  if (host === canonicalHost && protocol === 'https') return null;

  return `https://${canonicalHost}${input.pathname}${input.search}`;
}
