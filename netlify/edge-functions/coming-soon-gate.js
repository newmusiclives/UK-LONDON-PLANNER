// Coming-soon gate, controlled by the LAUNCH_MODE env var.
//   LAUNCH_MODE=coming-soon (or unset) → gate active; /  serves coming-soon.html;
//                                        everything except the allowlist 302s to /.
//   LAUNCH_MODE=live                   → pass through; full site is public.
//
// To launch the site: set LAUNCH_MODE=live in Netlify env vars and redeploy.

const ALLOWED_PREFIXES = [
  '/css/', '/js/', '/images/', '/icons/', '/fonts/', '/data/', '/downloads/',
  '/api/', '/.netlify/'
];

const ALLOWED_PATHS = new Set([
  '/admin.html', '/admin',
  '/gift.html', '/gift',
  '/partners.html', '/partners',
  '/share-trip.html', '/share-trip',
  '/coming-soon.html', '/coming-soon',
  '/manifest.json', '/sw.js', '/robots.txt', '/sitemap.xml',
  '/og-image.svg', '/favicon.ico', '/favicon.svg'
]);

export default async (request, context) => {
  const mode = (Netlify.env.get('LAUNCH_MODE') || 'coming-soon').toLowerCase();

  if (mode === 'live') return;

  const url = new URL(request.url);
  const path = url.pathname;

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
