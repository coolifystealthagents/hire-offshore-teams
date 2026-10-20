import { NextResponse, type NextRequest } from 'next/server';

const canonicalHost = 'hireoffshoreteams.com';
const legacyHost = 'www.hireoffshoreteams.com';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase();
  const protocol = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '');
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
