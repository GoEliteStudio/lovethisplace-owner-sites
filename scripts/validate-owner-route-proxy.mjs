import assert from 'node:assert/strict';
import { proxyInternalOwnerRoute } from '../src/lib/ownerSiteRouting.ts';

const originalFetch = globalThis.fetch;
let forwardedHeaders;

try {
  globalThis.fetch = async (_target, options = {}) => {
    forwardedHeaders = new Headers(options.headers);
    return new Response('<!DOCTYPE html><title>Molonta</title>', {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'content-encoding': 'br',
        'content-length': '999',
        'transfer-encoding': 'chunked',
        'x-owner-route-test': 'preserved',
      },
    });
  };

  const response = await proxyInternalOwnerRoute(
    new Request('https://molonta.lovethisplace.co/', {
      headers: { 'accept-language': 'en-US,en;q=0.9' },
    }),
    '/villas/molonta-heritage-estate/en/',
  );

  assert.equal(forwardedHeaders?.get('accept-encoding'), 'identity');
  assert.equal(forwardedHeaders?.get('accept-language'), 'en-US,en;q=0.9');
  assert.equal(response.headers.get('content-encoding'), null);
  assert.equal(response.headers.get('content-length'), null);
  assert.equal(response.headers.get('transfer-encoding'), null);
  assert.equal(response.headers.get('x-owner-route-test'), 'preserved');
  assert.match(await response.text(), /^<!DOCTYPE html>/);

  console.log('[owner-route-proxy] PASS: decompressed proxy bodies cannot retain stale compression framing.');
} finally {
  globalThis.fetch = originalFetch;
}
