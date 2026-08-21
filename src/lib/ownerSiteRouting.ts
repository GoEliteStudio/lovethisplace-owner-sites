export function getRequestHostname(request: Request): string {
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const requestHost = forwardedHost || request.headers.get('host') || new URL(request.url).hostname;
  return requestHost.split(':')[0].toLowerCase();
}
