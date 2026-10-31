import retirements from '../../../data/retirements.json';

const removed = new Set(
  retirements.filter((item) => item.action === 'removed').map((item) => `/blog/${item.slug}`),
);
const fallback =
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page unavailable | Korea Experience</title><main><h1>This page is unavailable.</h1><p>This guide is no longer published.</p><a href="/blog">Find a travel guide</a></main></html>';

/** An exact Worker route avoids an incorrectly cached 200 for retired URLs. */
export async function retiredResponse(
  request: Request,
  fetchPage: typeof fetch = fetch,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (!['GET', 'HEAD'].includes(request.method) || !removed.has(url.pathname)) return null;
  let html: string | null = null;
  try {
    const source = await fetchPage('https://korea-experience.pages.dev' + url.pathname, {
      method: request.method,
      redirect: 'manual',
      signal: AbortSignal.timeout(5000),
    });
    if (source.status === 404 && request.method === 'GET') html = await source.text();
  } catch {
    // A useful genuine 404 must remain available even if Pages is unreachable.
  }
  return new Response(request.method === 'HEAD' ? null : html || fallback, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
