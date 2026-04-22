// Coming-soon gate, controlled by the LAUNCH_MODE env var.
//   LAUNCH_MODE=coming-soon (or unset) → gate active; /  serves coming-soon.html;
//                                        everything except the allowlist 302s to /.
//   LAUNCH_MODE=live                   → pass through; full site is public.
//
// Admin preview bypass:
//   Visit any page with ?preview=<PREVIEW_TOKEN> to set a session cookie that
//   bypasses the gate until the browser closes. Use ?preview=clear to revoke.
//   Token comes from the PREVIEW_TOKEN env var on Netlify.
//
// To launch the site: set LAUNCH_MODE=live in Netlify env vars and redeploy.

const ALLOWED_PREFIXES = [
  '/css/', '/js/', '/images/', '/icons/', '/fonts/', '/data/', '/downloads/',
  '/api/', '/.netlify/'
];

const ALLOWED_PATHS = new Set([
  '/admin.html', '/admin',
  '/features.html', '/features',
  '/marketing.html', '/marketing',
  '/gift.html', '/gift',
  '/partners.html', '/partners',
  '/share-trip.html', '/share-trip',
  '/free-guide.html', '/free-guide',
  '/contact.html', '/contact',
  '/hidden-london.html', '/hidden-london',
  '/musical-london.html', '/musical-london',
  '/coming-soon.html', '/coming-soon',
  '/manifest.json', '/sw.js', '/robots.txt', '/sitemap.xml',
  '/og-image.svg', '/favicon.ico', '/favicon.svg'
]);

const PREVIEW_COOKIE = 'lp_preview';

function readCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export default async (request, context) => {
  const mode = (Netlify.env.get('LAUNCH_MODE') || 'coming-soon').toLowerCase();

  if (mode === 'live') return;

  const url = new URL(request.url);
  const path = url.pathname;
  const previewToken = Netlify.env.get('PREVIEW_TOKEN') || '';
  const previewParam = url.searchParams.get('preview');

  // Handle preview query param: set cookie, strip param, redirect.
  if (previewParam !== null) {
    const clean = new URL(url.toString());
    clean.searchParams.delete('preview');
    const headers = new Headers({ Location: clean.toString() });

    if (previewParam === 'clear') {
      headers.append('Set-Cookie', `${PREVIEW_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax; Secure; HttpOnly`);
      return new Response(null, { status: 302, headers });
    }
    if (previewToken && previewParam === previewToken) {
      headers.append('Set-Cookie', `${PREVIEW_COOKIE}=${encodeURIComponent(previewToken)}; Path=/; SameSite=Lax; Secure; HttpOnly`);
      return new Response(null, { status: 302, headers });
    }
    // Bad token → fall through to normal gate behaviour (no cookie set).
  }

  // Cookie-based bypass.
  if (previewToken && readCookie(request, PREVIEW_COOKIE) === previewToken) {
    return;
  }

  if (ALLOWED_PREFIXES.some((p) => path.startsWith(p))) return;
  if (ALLOWED_PATHS.has(path)) return;

  if (path === '/' || path === '/index.html') {
    return fetch(new URL('/coming-soon.html', request.url));
  }

  const target = new URL('/', request.url);
  return Response.redirect(target, 302);
};

export const config = {
  path: '/*'
};
