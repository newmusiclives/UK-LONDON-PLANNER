// js/env-bridge.js
// Loads runtime config from Netlify function and patches CONFIG, Analytics, GHL.
// Falls back gracefully if the function isn't available (local dev, offline).
// Must be loaded AFTER config.js and BEFORE analytics.js.

(function () {
  'use strict';

  const ENDPOINT = '/.netlify/functions/runtime-config';
  const CACHE_KEY = 'runtimeConfig';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  function applyConfig(rc) {
    if (!rc) return;

    // Google Analytics
    if (rc.ga && typeof Analytics !== 'undefined') {
      Analytics.GA_ID = rc.ga;
    }

    // Manifest payment links
    if (rc.manifest && typeof CONFIG !== 'undefined') {
      const m = rc.manifest;
      if (m.tier1) CONFIG.manifest.links.tier1 = m.tier1;
      if (m.tier2) CONFIG.manifest.links.tier2 = m.tier2;
      if (m.tier3) CONFIG.manifest.links.tier3 = m.tier3;
      if (m.ukShort) CONFIG.ukExtension.manifest.short = m.ukShort;
      if (m.ukStandard) CONFIG.ukExtension.manifest.standard = m.ukStandard;
      if (m.ukExtended) CONFIG.ukExtension.manifest.extended = m.ukExtended;
    }

    // GHL webhooks
    if (rc.ghl && rc.ghl.configured && typeof CONFIG !== 'undefined') {
      const w = rc.ghl.webhooks;
      if (w.itineraryPurchase) CONFIG.goHighLevel.webhooks.itineraryPurchase = w.itineraryPurchase;
      if (w.contactForm) CONFIG.goHighLevel.webhooks.contactForm = w.contactForm;
      if (w.emailCapture) CONFIG.goHighLevel.webhooks.emailCapture = w.emailCapture;
      if (w.promotionsNewsletter) CONFIG.goHighLevel.webhooks.promotionsNewsletter = w.promotionsNewsletter;
    }

    // Affiliate IDs
    if (rc.affiliates && typeof CONFIG !== 'undefined') {
      for (const [key, val] of Object.entries(rc.affiliates)) {
        if (val && CONFIG.affiliateIds[key]) {
          CONFIG.affiliateIds[key] = val;
        }
      }
    }

    // Review URLs (store for use by review components)
    if (rc.trustpilot) window.__trustpilotUrl = rc.trustpilot;
    if (rc.googleReview) window.__googleReviewUrl = rc.googleReview;
  }

  async function load() {
    // Try cache first
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        applyConfig(cached.data);
        return;
      }
    } catch {}

    // Fetch from Netlify function
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) return;
      const data = await res.json();
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
      applyConfig(data);
    } catch {
      // Offline or local dev — use hardcoded config.js values
    }
  }

  // Run immediately (before DOMContentLoaded so Analytics.init() picks up the real GA ID)
  load().then(() => {
    // Re-init analytics if it already ran with placeholder
    if (typeof Analytics !== 'undefined' && Analytics.GA_ID !== 'G-XXXXXXXXXX' && !window.gtag) {
      Analytics.init();
    }
  });
})();
