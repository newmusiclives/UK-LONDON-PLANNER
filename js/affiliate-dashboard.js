// js/affiliate-dashboard.js — admin Affiliates tab enhancement
// Shows setup checklist with signup links, status, and env var names.

(function () {
  'use strict';

  const AFFILIATES = [
    { key: 'getYourGuide', name: 'GetYourGuide', category: 'Tours & Attractions', commission: '8%', signUp: 'https://partner.getyourguide.com/', envVar: 'AFFILIATE_GETYOURGUIDE', priority: 1 },
    { key: 'booking', name: 'Booking.com', category: 'Hotels', commission: '4-6%', signUp: 'https://www.booking.com/affiliate-program/v2/index.html', envVar: 'AFFILIATE_BOOKING', priority: 1 },
    { key: 'viator', name: 'Viator', category: 'Tours & Activities', commission: '8%', signUp: 'https://www.viator.com/affiliates', envVar: 'AFFILIATE_VIATOR', priority: 1 },
    { key: 'todayTix', name: 'TodayTix', category: 'Theatre', commission: '5-8%', signUp: 'mailto:partnerships@todaytix.com', envVar: 'AFFILIATE_TODAYTIX', priority: 2 },
    { key: 'openTable', name: 'OpenTable', category: 'Restaurants', commission: '$1-2/diner', signUp: 'https://www.opentable.com/affiliates', envVar: 'AFFILIATE_OPENTABLE', priority: 1 },
    { key: 'klook', name: 'Klook', category: 'Attractions & Transport', commission: '5%', signUp: 'https://affiliate.klook.com/', envVar: 'AFFILIATE_KLOOK', priority: 2 },
    { key: 'tiqets', name: 'Tiqets', category: 'Museum Tickets', commission: '6%', signUp: 'https://www.tiqets.com/affiliates', envVar: 'AFFILIATE_TIQETS', priority: 2 },
    { key: 'goCity', name: 'Go City', category: 'Multi-Attraction Pass', commission: '6-10%', signUp: 'https://gocity.com/affiliates', envVar: 'AFFILIATE_GOCITY', priority: 2 },
    { key: 'trainline', name: 'Trainline', category: 'Rail Tickets', commission: '2%', signUp: 'https://www.trainline.com/affiliates', envVar: 'AFFILIATE_TRAINLINE', priority: 2 },
    { key: 'expedia', name: 'Expedia', category: 'Hotels & Flights', commission: '4-6%', signUp: 'https://www.expedia.co.uk/affiliate', envVar: 'AFFILIATE_EXPEDIA', priority: 3 },
    { key: 'hostelworld', name: 'Hostelworld', category: 'Hostels', commission: '3-5%', signUp: 'https://www.hostelworld.com/affiliate', envVar: 'AFFILIATE_HOSTELWORLD', priority: 3 },
    { key: 'skyscanner', name: 'Skyscanner', category: 'Flights', commission: 'CPA', signUp: 'https://partners.skyscanner.net/', envVar: 'AFFILIATE_SKYSCANNER', priority: 2 },
    { key: 'amazonUK', name: 'Amazon UK', category: 'Travel Gear & Books', commission: '1-10%', signUp: 'https://affiliate-program.amazon.co.uk/', envVar: 'AFFILIATE_AMAZON_UK', priority: 2 },
    { key: 'tripadvisor', name: 'TripAdvisor', category: 'Hotels & Reviews', commission: '50% CPC', signUp: 'https://www.tripadvisor.com/affiliates', envVar: 'AFFILIATE_TRIPADVISOR', priority: 3 },
    { key: 'musement', name: 'Musement', category: 'Activities', commission: '6-8%', signUp: 'https://www.musement.com/affiliates/', envVar: 'AFFILIATE_MUSEMENT', priority: 3 },
    { key: 'headout', name: 'Headout', category: 'Experiences', commission: '6%', signUp: 'https://www.headout.com/affiliates/', envVar: 'AFFILIATE_HEADOUT', priority: 3 },
    { key: 'eurostar', name: 'Eurostar', category: 'Train to Europe', commission: '2-3%', signUp: 'https://www.eurostar.com/affiliates', envVar: 'AFFILIATE_EUROSTAR', priority: 3 },
    { key: 'omio', name: 'Omio', category: 'Transport', commission: '4%', signUp: 'https://www.omio.com/affiliates', envVar: 'AFFILIATE_OMIO', priority: 3 },
    { key: 'rentalcars', name: 'Rentalcars', category: 'Car Hire', commission: '5-7%', signUp: 'https://www.rentalcars.com/affiliates', envVar: 'AFFILIATE_RENTALCARS', priority: 3 },
    { key: 'theFork', name: 'TheFork', category: 'Restaurants', commission: 'CPA', signUp: 'https://www.thefork.com/affiliates', envVar: 'AFFILIATE_THEFORK', priority: 3 },
    { key: 'londonTheatreDirect', name: 'London Theatre Direct', category: 'Theatre', commission: '5-7%', signUp: 'https://www.londontheatredirect.com/affiliates', envVar: 'AFFILIATE_LTD', priority: 2 },
    { key: 'worldNomads', name: 'World Nomads', category: 'Travel Insurance', commission: '10%', signUp: 'https://www.worldnomads.com/affiliates', envVar: 'AFFILIATE_WORLDNOMADS', priority: 2 },
    { key: 'safetyWing', name: 'SafetyWing', category: 'Travel Insurance', commission: '10%', signUp: 'https://www.safetywing.com/affiliates', envVar: 'AFFILIATE_SAFETYWING', priority: 2 },
    { key: 'wise', name: 'Wise', category: 'Currency Exchange', commission: 'CPA', signUp: 'https://wise.com/invite/', envVar: 'AFFILIATE_WISE', priority: 2 },
    { key: 'revolut', name: 'Revolut', category: 'Travel Card', commission: 'CPA', signUp: 'https://www.revolut.com/affiliates/', envVar: 'AFFILIATE_REVOLUT', priority: 3 },
    { key: 'airalo', name: 'Airalo', category: 'eSIM', commission: '15-30%', signUp: 'https://www.airalo.com/affiliates', envVar: 'AFFILIATE_AIRALO', priority: 1 },
    { key: 'withLocals', name: 'WithLocals', category: 'Trip Planning', commission: '5-8%', signUp: 'https://www.withlocals.com/partners/', envVar: 'AFFILIATE_WITHLOCALS', priority: 1 },
    { key: 'toursByLocals', name: 'ToursByLocals', category: 'Private Guides', commission: '8%', signUp: 'https://www.toursbylocals.com/affiliates', envVar: 'AFFILIATE_TOURSBYLOCALS', priority: 1 },
    { key: 'contextTravel', name: 'Context Travel', category: 'Expert Tours', commission: '10%', signUp: 'https://www.cj.com/', envVar: 'AFFILIATE_CONTEXTTRAVEL', priority: 2 },
  ];

  function isConfigured(key) {
    if (typeof CONFIG === 'undefined') return false;
    const val = CONFIG.affiliateIds[key];
    return val && !val.includes('YOUR_');
  }

  function render() {
    const panel = document.querySelector('[data-panel="affiliates"]');
    if (!panel) return;

    const configured = AFFILIATES.filter(a => isConfigured(a.key)).length;
    const total = AFFILIATES.length;
    const pct = Math.round((configured / total) * 100);

    const grouped = { 1: [], 2: [], 3: [] };
    AFFILIATES.forEach(a => grouped[a.priority].push(a));

    panel.innerHTML = `
      <div class="admin-section">
        <div class="admin-section__header">
          <h3>Affiliate Setup Dashboard</h3>
          <p style="margin:0.25rem 0 0;color:var(--color-text-secondary);font-size:0.9rem;">
            ${configured}/${total} configured (${pct}%)
          </p>
        </div>
        <div class="admin-section__body">
          <div style="background:#f8f9fa;border-radius:8px;padding:1rem;margin-bottom:1.5rem;">
            <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.5rem;">
              <span><strong>${configured}</strong> active</span>
              <span><strong>${total - configured}</strong> remaining</span>
            </div>
            <div style="background:#e5e7eb;border-radius:999px;height:10px;overflow:hidden;">
              <div style="background:linear-gradient(90deg,#16a34a,#22c55e);height:100%;width:${pct}%;border-radius:999px;transition:width 0.5s;"></div>
            </div>
          </div>

          <div style="background:#fff8e1;border-left:4px solid #f59e0b;padding:1rem;border-radius:4px;margin-bottom:1.5rem;font-size:0.85rem;">
            <strong>How it works:</strong> Sign up for each program, get your ID, then add it as an environment variable in your Netlify dashboard
            (Site settings → Environment variables). The env-bridge auto-patches <code>CONFIG.affiliateIds</code> at runtime — no code changes needed.
          </div>

          ${[1, 2, 3].map(p => `
            <h4 style="margin:1.5rem 0 0.75rem;color:${p === 1 ? '#dc2626' : p === 2 ? '#d97706' : '#6b7280'};">
              ${p === 1 ? 'Priority 1 — Sign Up First' : p === 2 ? 'Priority 2 — High Value' : 'Priority 3 — Nice to Have'}
            </h4>
            <div style="display:grid;gap:0.5rem;">
              ${grouped[p].map(a => {
                const done = isConfigured(a.key);
                return `
                <div style="display:grid;grid-template-columns:24px 1fr 140px 90px 140px 100px;gap:0.75rem;align-items:center;padding:0.5rem 0.75rem;background:${done ? '#f0fdf4' : 'white'};border:1px solid ${done ? '#bbf7d0' : '#e5e7eb'};border-radius:6px;font-size:0.82rem;">
                  <span style="font-size:1.1rem;">${done ? '✅' : '⬜'}</span>
                  <div>
                    <strong>${a.name}</strong>
                    <div style="color:#6b7280;font-size:0.75rem;">${a.category}</div>
                  </div>
                  <span style="font-family:monospace;font-size:0.75rem;color:#6b7280;">${a.envVar}</span>
                  <span>${a.commission}</span>
                  <a href="${a.signUp}" target="_blank" rel="noopener" style="color:var(--color-primary);text-decoration:underline;font-size:0.8rem;">${a.signUp.startsWith('mailto') ? 'Email' : 'Sign Up'}</a>
                  <span style="color:${done ? '#16a34a' : '#9ca3af'};font-weight:600;font-size:0.8rem;">${done ? 'Active' : 'Pending'}</span>
                </div>`;
              }).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const tab = document.querySelector('[data-tab="affiliates"]');
    if (tab) tab.addEventListener('click', render);
  });

  window.AffiliateDashboard = { render };
})();
