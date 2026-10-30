/** Public, same-origin destinations only. Never carry tokens or user text across sign-in. */
export function safeReturnTo(input: unknown, siteOrigin: string): string {
  const fallback = '/community/account';
  if (typeof input !== 'string' || input.length > 500 || /[\\\u0000-\u0020]/.test(input))
    return fallback;
  try {
    const origin = new URL(siteOrigin).origin;
    const u = new URL(input, origin);
    if (u.origin !== origin || u.username || u.password || input.startsWith('//')) return fallback;
    const pathname = u.pathname.replace(/\/$/, '');
    if (/^\/blog\/[a-z0-9][a-z0-9-]{0,220}$/.test(pathname))
      return pathname + (u.hash === '#discussion' ? '#discussion' : '');
    if (pathname === '/tools/itinerary') return pathname;
    if (/^\/community(?:\/account|\/posts\/[a-zA-Z0-9-]{1,100})?$/.test(pathname)) return pathname;
  } catch {}
  return fallback;
}
