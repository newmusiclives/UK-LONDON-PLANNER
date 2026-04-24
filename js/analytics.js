// ============================================================
// GOOGLE ANALYTICS 4 + CONVERSION TRACKING
// Replace GA_MEASUREMENT_ID with your actual GA4 ID (G-XXXXXXXXXX)
// ============================================================
const Analytics = {
  GA_ID: 'G-XXXXXXXXXX', // Replace with your GA4 Measurement ID

  init() {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('analytics')) return;
    if (this.GA_ID === 'G-XXXXXXXXXX') return; // Skip if not configured
    // Respect cookie consent — only load analytics if user accepted
    if (localStorage.getItem('cookieConsent') === 'essential') return;

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', this.GA_ID, {
      page_title: document.title,
      custom_map: { dimension1: 'trip_days', dimension2: 'group_type', dimension3: 'occasion' }
    });
  },

  // Page view (auto-tracked but can be called for SPA navigation)
  pageView(path, title) {
    if (!window.gtag) return;
    gtag('event', 'page_view', { page_path: path, page_title: title });
  },

  // Wizard tracking
  wizardStart() {
    if (!window.gtag) return;
    gtag('event', 'wizard_start', { event_category: 'wizard' });
    this._increment('stat_wizard_starts');
  },

  wizardStep(step, stepName) {
    if (!window.gtag) return;
    gtag('event', 'wizard_step', { event_category: 'wizard', step_number: step, step_name: stepName });
  },

  wizardComplete(preferences) {
    if (!window.gtag) return;
    gtag('event', 'wizard_complete', {
      event_category: 'wizard',
      trip_days: preferences.tripDays,
      group_type: preferences.groupType,
      occasion: preferences.occasion,
      interests_count: preferences.interests?.length || 0,
      uk_extension: preferences.ukExtension?.enabled || false
    });
  },

  // Itinerary tracking
  itineraryGenerated(itinerary) {
    if (!window.gtag) return;
    gtag('event', 'itinerary_generated', {
      event_category: 'itinerary',
      trip_days: itinerary.tripDays,
      total_cost_estimate: itinerary.totalEstimatedCost || 0
    });
    this._increment('stat_itineraries_generated');
  },

  // Purchase tracking
  purchase(product, amount, currency = 'USD') {
    if (!window.gtag) return;
    gtag('event', 'purchase', {
      event_category: 'revenue',
      transaction_id: 'txn_' + Date.now(),
      value: amount,
      currency: currency,
      items: [{ item_name: product, price: amount }]
    });
  },

  // Affiliate link clicks
  affiliateClick(provider, venueName) {
    if (!window.gtag) return;
    gtag('event', 'affiliate_click', {
      event_category: 'affiliate',
      affiliate_provider: provider,
      venue_name: venueName
    });
  },

  // Email capture
  emailCapture(source) {
    if (!window.gtag) return;
    gtag('event', 'email_capture', { event_category: 'lead', source: source });
  },

  // Gift purchase
  giftPurchase(tierId, amount, currency = 'USD') {
    if (!window.gtag) return;
    gtag('event', 'gift_purchase', {
      event_category: 'revenue',
      transaction_id: 'gift_' + Date.now(),
      value: amount || 0,
      currency: currency,
      items: [{ item_name: tierId || 'gift', price: amount || 0 }]
    });
  },

  // Partner / B2B lead
  partnerLead(partnerType) {
    if (!window.gtag) return;
    gtag('event', 'partner_lead', {
      event_category: 'lead',
      partner_type: partnerType || 'unknown'
    });
  },

  // Post-trip UGC submission
  ugcSubmission(hasPhoto) {
    if (!window.gtag) return;
    gtag('event', 'ugc_submission', {
      event_category: 'engagement',
      has_photo: !!hasPhoto
    });
  },

  // Share
  share(method) {
    if (!window.gtag) return;
    gtag('event', 'share', { method: method, content_type: 'itinerary' });
  },

  // PDF download
  pdfDownload() {
    if (!window.gtag) return;
    gtag('event', 'pdf_download', { event_category: 'engagement' });
  },

  // Internal counter for admin dashboard
  _increment(key) {
    const val = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, (val + 1).toString());
  }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => Analytics.init());

// ============================================================
// A/B TESTING FRAMEWORK
// Simple client-side split testing
// ============================================================
const ABTest = {
  _tests: {},

  // Define a test: ABTest.define('pricing', ['control', 'higher'])
  define(testName, variants) {
    let stored = localStorage.getItem(`ab_${testName}`);
    if (!stored || !variants.includes(stored)) {
      stored = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem(`ab_${testName}`, stored);
    }
    this._tests[testName] = stored;
    // Track assignment
    if (window.gtag) {
      gtag('event', 'ab_test_assignment', { test_name: testName, variant: stored });
    }
    return stored;
  },

  // Get current variant
  get(testName) {
    return this._tests[testName] || localStorage.getItem(`ab_${testName}`) || 'control';
  },

  // Track conversion for a test
  convert(testName) {
    if (window.gtag) {
      gtag('event', 'ab_test_conversion', {
        test_name: testName,
        variant: this.get(testName)
      });
    }
  }
};

// ============================================================
// REFERRAL PROGRAM
// ============================================================
const Referral = {
  init() {
    // Check for referral code in URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref && ref !== 'share') {
      localStorage.setItem('referral_code', ref);
      localStorage.setItem('referral_source', document.referrer || 'direct');
    }
  },

  getCode() {
    return localStorage.getItem('referral_code') || null;
  },

  generateCode() {
    let code = localStorage.getItem('my_referral_code');
    if (!code) {
      code = 'LUK' + Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem('my_referral_code', code);
    }
    return code;
  },

  getShareUrl() {
    return `${window.location.origin}?ref=${this.generateCode()}`;
  }
};

// Auto-init referral
document.addEventListener('DOMContentLoaded', () => Referral.init());
