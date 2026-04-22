#!/usr/bin/env node
// Generator for neighbourhood-*.html pages.
// Pattern matches existing neighbourhood-soho.html.
// Content lives in the GUIDES array below — each entry produces one page.
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..', '..', '..');

const list = (title, items, bulletStyle = 'none') => {
  if (!items.length) return '';
  if (bulletStyle === 'disc') {
    return `
        <div class="card" style="margin-bottom:2rem;">
          <div class="card__body">
            <h2 style="margin-bottom:1rem;">${title}</h2>
            <ul style="list-style:disc;padding-left:1.5rem;">
              ${items.map(t => `<li style="margin-bottom:0.75rem;">${t}</li>`).join('\n              ')}
            </ul>
          </div>
        </div>`;
  }
  const renderItem = (it, idx, last) => `
              <li style="margin-bottom:${last ? 0 : 1.25}rem;">
                <h4 style="margin-bottom:0.25rem;">${idx + 1}. ${it.name}</h4>
                <p style="color:var(--color-text-muted);font-size:0.9rem;">${it.meta}</p>
                <p style="margin-top:0.5rem;">${it.blurb}</p>
              </li>`;
  return `
        <div class="card" style="margin-bottom:2rem;">
          <div class="card__body">
            <h2 style="margin-bottom:1rem;">${title}</h2>
            <ul style="list-style:none;padding:0;">
              ${items.map((it, i) => renderItem(it, i, i === items.length - 1)).join('')}
            </ul>
          </div>
        </div>`;
};

const tubeList = (items) => `
        <div class="card" style="margin-bottom:2rem;">
          <div class="card__body">
            <h2 style="margin-bottom:1rem;">Getting There</h2>
            <p style="margin-bottom:1rem;">Main stations serving this neighbourhood:</p>
            <ul style="list-style:disc;padding-left:1.5rem;">
              ${items.map((t, i, a) => `<li style="margin-bottom:${i === a.length - 1 ? 0 : 0.75}rem;"><strong>${t.name}</strong> (${t.lines}) — ${t.note}</li>`).join('\n              ')}
            </ul>
          </div>
        </div>`;

const overview = ({ vibe, bestFor, body }) => `
        <div class="card" style="margin-bottom:2rem;">
          <div class="card__body">
            <h2 style="margin-bottom:1rem;">Overview</h2>
            ${body.map(p => `<p style="margin-bottom:1rem;">${p}</p>`).join('\n            ')}
            <p style="margin-bottom:1rem;"><strong>The vibe:</strong> ${vibe}</p>
            <p><strong>Best for:</strong> ${bestFor}</p>
          </div>
        </div>`;

const renderPage = (g) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${g.name} Neighbourhood Guide — London Planned</title>
  <meta name="description" content="${g.meta}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/responsive.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": "${g.name}, London",
    "description": "${g.schemaDesc}",
    "touristType": ${JSON.stringify(g.touristType)},
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${g.geo.lat},
      "longitude": ${g.geo.lng}
    },
    "containedInPlace": { "@type": "City", "name": "London" }
  }
  </script>
</head>
<body>
  <header class="header" id="site-header"></header>
  <main class="main">
    <section class="section section--dark" style="text-align:center;padding:4rem 0;">
      <div class="container">
        <p style="color:var(--color-accent);font-weight:600;margin-bottom:0.5rem;"><a href="neighbourhoods.html" style="color:var(--color-accent);text-decoration:none;">Neighbourhood Guides</a> &rsaquo; ${g.name}</p>
        <h1 style="color:white;">${g.name} Neighbourhood Guide</h1>
        <div class="divider"></div>
        <p style="color:rgba(255,255,255,0.8);max-width:620px;margin:0 auto;">${g.hero}</p>
      </div>
    </section>

    <section class="section">
      <div class="container container--narrow">
        ${overview(g.overview)}
        ${list('Top Attractions', g.attractions)}
        ${list('Best Restaurants', g.restaurants)}
        ${list('Best Bars & Pubs', g.bars)}
        ${list('Best Cafes', g.cafes)}
        ${list('Shopping Highlights', g.shopping, 'disc')}
        ${tubeList(g.tube)}
        ${list('Insider Tips', g.tips, 'disc')}

        <div style="background:var(--color-primary);border-radius:var(--radius-xl);padding:3rem;text-align:center;margin-top:1rem;">
          <h3 style="color:white;margin-bottom:0.5rem;">Plan Your ${g.name} Day Out</h3>
          <p style="color:rgba(255,255,255,0.7);margin-bottom:1.5rem;">Build a custom itinerary featuring the best of ${g.name}</p>
          <a href="wizard.html" class="btn btn--primary">Create a ${g.name} Itinerary</a>
        </div>
      </div>
    </section>
  </main>
  <footer class="footer" id="site-footer"></footer>
  <script src="js/config.js"></script>
  <script src="js/env-bridge.js"></script>
  <script src="js/state.js"></script>
  <script src="js/ui.js"></script>
  <script>document.addEventListener('DOMContentLoaded', () => { UI.init(); });</script>
</body>
</html>
`;

const GUIDES = require('./neighbourhood-content.js');

for (const g of GUIDES) {
  const slug = g.slug || g.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
  const out = path.join(PROJECT_ROOT, `neighbourhood-${slug}.html`);
  fs.writeFileSync(out, renderPage(g));
  console.log('wrote', `neighbourhood-${slug}.html`);
}
console.log(`\nDone — ${GUIDES.length} guides generated.`);
