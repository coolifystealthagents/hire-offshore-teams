import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = new URL('..', import.meta.url).pathname;
const helperUrl = pathToFileURL(join(root, 'lib/canonical-request.ts')).href;

function evaluateCases(cases) {
  const child = spawnSync(process.execPath, [
    '--experimental-strip-types',
    '--input-type=module',
    '--eval',
    `const { canonicalRedirectFor } = await import(${JSON.stringify(helperUrl)});\n` +
    `const cases = ${JSON.stringify(cases)};\n` +
    `console.log(JSON.stringify(cases.map(c => canonicalRedirectFor(c))));`,
  ], { cwd: root, encoding: 'utf8' });
  assert.equal(child.status, 0, `child failed\nstdout: ${child.stdout}\nstderr: ${child.stderr}`);
  return JSON.parse(child.stdout.trim());
}

const request = (overrides = {}) => ({
  host: 'hireoffshoreteams.com',
  cloudflareVisitor: null,
  forwardedProtocol: 'https',
  fallbackProtocol: 'http:',
  pathname: '/path',
  search: '?q=1',
  ...overrides,
});

test('canonical redirects honor validated proxy precedence and preserve path/query', () => {
  const cases = [
    request({ cloudflareVisitor: '{"scheme":"http"}', forwardedProtocol: 'https' }),
    request({ cloudflareVisitor: '{"scheme":"https"}', forwardedProtocol: 'http' }),
    request({ cloudflareVisitor: '{bad', forwardedProtocol: 'http' }),
    request({ cloudflareVisitor: '{"scheme":"ftp"}', forwardedProtocol: 'http, https' }),
    request({ host: 'www.hireoffshoreteams.com', cloudflareVisitor: '{"scheme":"https"}' }),
    request({ host: 'evil.example', cloudflareVisitor: '{"scheme":"https"}' }),
    request({ host: 'localhost:3000', forwardedProtocol: 'http' }),
    request({ host: '127.0.0.1:3000', forwardedProtocol: 'http' }),
    request({ host: '[::1]:3000', forwardedProtocol: 'http' }),
  ];

  assert.deepEqual(evaluateCases(cases), [
    'https://hireoffshoreteams.com/path?q=1',
    null,
    'https://hireoffshoreteams.com/path?q=1',
    'https://hireoffshoreteams.com/path?q=1',
    'https://hireoffshoreteams.com/path?q=1',
    'https://hireoffshoreteams.com/path?q=1',
    null,
    null,
    null,
  ]);
});
