/** @type {import('next').NextConfig} */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://acrtracking.stealthagents.us https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://acrtracking.stealthagents.us https://cloudflareinsights.com",
  "frame-src https://go.oncehub.com https://*.oncehub.com",
  "upgrade-insecure-requests"
].join('; ');
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' }
];
const nextConfig = {
  output: 'standalone',
  images: { unoptimized: true, formats: ['image/avif', 'image/webp'] },
  async headers() { return [{ source: '/(.*)', headers: securityHeaders }]; }
};
export default nextConfig;
