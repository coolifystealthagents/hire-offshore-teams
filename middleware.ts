import { NextResponse, type NextRequest } from 'next/server';
import { canonicalRedirectFor } from '@/lib/canonical-request';

export function middleware(request: NextRequest) {
  const destination = canonicalRedirectFor({
    host: request.headers.get('host') || '',
    cloudflareVisitor: request.headers.get('cf-visitor'),
    forwardedProtocol: request.headers.get('x-forwarded-proto'),
    fallbackProtocol: request.nextUrl.protocol,
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
  });

  return destination ? NextResponse.redirect(destination, 308) : NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
