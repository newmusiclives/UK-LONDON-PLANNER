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

    // Stripe payment links
    if (rc.stripe && typeof CONFIG !== 'undefined') {
      const m = rc.stripe;
      if (m.tier1) CONFIG.stripe.links.tier1 = m.tier1;
      if (m.tier2) CONFIG.stripe.links.tier2 = m.tier2;
      if (m.tier3) CONFIG.stripe.links.tier3 = m.tier3;
      if (m.ukShort) CONFIG.ukExtension.stripe.short = m.ukShort;
      if (m.ukStandard) CONFIG.ukExtension.stripe.standard = m.ukStandard;
      if (m.ukExtended) CONFIG.ukExtension.stripe.extended = m.ukExtended;
    }

    // GHL webhooks
    if (rc.ghl && rc.ghl.configured && typeof CONFIG !== 'undefined') {
      const w = rc.ghl.webhooks;
      if (w.itineraryPurchase) CONFIG.goHighLevel.webhooks.itineraryPurchase = w.itineraryPurchase;
      if (w.contactForm) CONFIG.goHighLevel.webhooks.contactForm = w.contactForm;
      if (w.emailCapture) CONFIG.goHighLevel.webhooks.emailCapture = w.emailCapture;
      if (w.promotionsNewsletter) CONFIG.goHighLevel.webhooks.promotionsNewsletter = w.promotionsNewsletter;
      if (w.waitlist) CONFIG.goHighLevel.webhooks.waitlist = w.waitlist;
      if (w.giftPurchase) CONFIG.goHighLevel.webhooks.giftPurchase = w.giftPurchase;
      if (w.partnerLead) CONFIG.goHighLevel.webhooks.partnerLead = w.partnerLead;
      if (w.ugcSubmission) CONFIG.goHighLevel.webhooks.ugcSubmission = w.ugcSubmission;
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

  // Apply admin-saved config from localStorage (works without Netlify env vars)
  function applyAdminConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem('londonplannedAdmin') || '{}');
      if (typeof CONFIG === 'undefined') return;

      // Stripe payment links
      if (saved.stripe) {
        if (saved.stripe.tier1) CONFIG.stripe.links.tier1 = saved.stripe.tier1;
        if (saved.stripe.tier2) CONFIG.stripe.links.tier2 = saved.stripe.tier2;
        if (saved.stripe.tier3) CONFIG.stripe.links.tier3 = saved.stripe.tier3;
        if (saved.stripe.ukShort) CONFIG.ukExtension.stripe.short = saved.stripe.ukShort;
        if (saved.stripe.ukStandard) CONFIG.ukExtension.stripe.standard = saved.stripe.ukStandard;
        if (saved.stripe.ukExtended) CONFIG.ukExtension.stripe.extended = saved.stripe.ukExtended;
      }

      // GHL webhooks
      if (saved.ghl) {
        if (saved.ghl.itineraryPurchase) CONFIG.goHighLevel.webhooks.itineraryPurchase = saved.ghl.itineraryPurchase;
        if (saved.ghl.contactForm) CONFIG.goHighLevel.webhooks.contactForm = saved.ghl.contactForm;
        if (saved.ghl.emailCapture) CONFIG.goHighLevel.webhooks.emailCapture = saved.ghl.emailCapture;
        if (saved.ghl.newsletter) CONFIG.goHighLevel.webhooks.promotionsNewsletter = saved.ghl.newsletter;
      }

      // Affiliate IDs
      if (saved.affiliates) {
        for (const [key, val] of Object.entries(saved.affiliates)) {
          if (val && CONFIG.affiliateIds[key]) CONFIG.affiliateIds[key] = val;
        }
      }
    } catch {}
  }

  // Apply localStorage config first (instant, synchronous)
  applyAdminConfig();

  // Then fetch Netlify env config (async, overrides localStorage if present)
  load().then(() => {
    // Re-init analytics if it already ran with placeholder
    if (typeof Analytics !== 'undefined' && Analytics.GA_ID !== 'G-XXXXXXXXXX' && !window.gtag) {
      Analytics.init();
    }
  });
})();
