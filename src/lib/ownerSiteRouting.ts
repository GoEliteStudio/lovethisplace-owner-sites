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

  return fetch(target, { headers, redirect: 'manual' });
}