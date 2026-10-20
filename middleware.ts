import { NextResponse, type NextRequest } from 'next/server';

const canonicalHost = 'hireoffshoreteams.com';
const legacyHost = 'www.hireoffshoreteams.com';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase();
  const protocol = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol.replace(':', '');
  if (host === legacyHost || (host === canonicalHost && protocol === 'http')) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = canonicalHost;
    url.port = '';
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
