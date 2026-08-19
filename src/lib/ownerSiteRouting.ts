export function getRequestHostname(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const requestHost = forwardedHost || request.headers.get('host') || new URL(request.url).hostname;
  return requestHost.split(':')[0].toLowerCase();
}

export async function proxyInternalOwnerRoute(request: Request, internalPath: string): Promise<Response> {
  const target = new URL(request.url);
  target.pathname = internalPath;

  const headers = new Headers();
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) headers.set('accept-language', acceptLanguage);
  // The proxy consumes the internal response before Vercel sends it to the
  // visitor. Request an identity body and do not forward stale compression
  // framing: browsers otherwise try to decode plain HTML as Brotli and render
  // a blank page (ERR_CONTENT_DECODING_FAILED).
  headers.set('accept-encoding', 'identity');

  const upstream = await fetch(target, { headers, redirect: 'manual' });
  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  responseHeaders.delete('transfer-encoding');

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
