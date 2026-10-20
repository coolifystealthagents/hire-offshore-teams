import { NextResponse, type NextRequest } from 'next/server';

const canonicalHost = 'hireoffshoreteams.com';
const legacyHost = 'www.hireoffshoreteams.com';

function originalProtocol(request: NextRequest) {
  const cloudflareVisitor = request.headers.get('cf-visitor');
  if (cloudflareVisitor) {
    try {
      const scheme = JSON.parse(cloudflareVisitor)?.scheme;
      if (scheme === 'http' || scheme === 'https') return scheme;
    } catch {
      // Fall through to the forwarding header when edge metadata is malformed.
    }
  }

  const forwarded = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim().toLowerCase();
  if (forwarded === 'http' || forwarded === 'https') return forwarded;
  return request.nextUrl.protocol.replace(':', '');
}

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase();
  const protocol = originalProtocol(request);
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  if (!isLocal && (host === legacyHost || host !== canonicalHost || protocol !== 'https')) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = canonicalHost;
    url.port = '';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
