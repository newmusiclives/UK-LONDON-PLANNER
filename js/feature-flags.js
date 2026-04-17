// ============================================================
// FEATURE FLAGS — Central toggle system for all optional features
// Persists to localStorage. Admin UI at features.html.
// Usage: if (FeatureFlags.isEnabled('chat-assistant')) ChatAssistant.init();
// ============================================================
const FeatureFlags = {
  STORAGE_KEY: 'londonplannedFeatureFlags',

  // Master registry of all toggleable features
  // enabled = default state for new installs
  registry: {
    // ── Core Experience ──────────────────────────────────
    'demo-itinerary':      { label: 'Demo Itinerary',          category: 'Core',              description: 'Sample 5-day itinerary on the Demo page',                           enabled: true },
    'wizard':              { label: 'Trip Wizard',              category: 'Core',              description: '7-step itinerary builder and checkout flow',                         enabled: true },
    'day-maps':            { label: 'Day Maps',                 category: 'Core',              description: 'Leaflet mini-maps on itinerary and demo pages',                      enabled: true },
    'currency-selector':   { label: 'Currency Selector',        category: 'Core',              description: 'Multi-currency switcher in the header (USD, GBP, EUR, AUD, CAD)',    enabled: true },
    'my-trips':            { label: 'My Trips / Accounts',      category: 'Core',              description: 'Saved itineraries and user account system',                          enabled: true },

    // ── Engagement & Conversion ──────────────────────────
    'chat-assistant':      { label: 'Chat Assistant',           category: 'Engagement',        description: 'AI chat widget with venue recommendations',                          enabled: true },
    'social-proof':        { label: 'Social Proof Toasts',      category: 'Engagement',        description: 'Simulated real-time activity notifications',                         enabled: true },
    'exit-intent':         { label: 'Exit-Intent Popup',        category: 'Engagement',        description: 'Email capture popup when user moves to close tab',                   enabled: true },
    'quiz':                { label: 'Traveller Quiz',           category: 'Engagement',        description: 'What Type of London Traveller Are You? personality quiz',             enabled: true },
    'free-guide':          { label: 'Free Guide Lead Magnet',   category: 'Engagement',        description: 'Downloadable London Insider Guide PDF capture',                      enabled: true },
    'reviews':             { label: 'Review System',            category: 'Engagement',        description: 'Venue reviews and star ratings',                                     enabled: true },
    'testimonials':        { label: 'Testimonials Page',        category: 'Engagement',        description: 'Customer testimonial showcase page',                                 enabled: true },

    // ── Monetisation ─────────────────────────────────────
    'affiliate-links':     { label: 'Affiliate Links',          category: 'Monetisation',      description: 'GetYourGuide, Booking.com, Viator and 25+ partner links',            enabled: true },
    'booking-widgets':     { label: 'Booking Widgets',          category: 'Monetisation',      description: 'Embedded hotel and activity search widgets',                         enabled: true },
    'payment':             { label: 'Payment / Checkout',       category: 'Monetisation',      description: 'Stripe payment processing',                              enabled: true },

    // ── Analytics & Testing ──────────────────────────────
    'analytics':           { label: 'Google Analytics',         category: 'Analytics',         description: 'GA4 page views, events, and conversion tracking',                    enabled: false },
    'ab-testing':          { label: 'A/B Testing',              category: 'Analytics',         description: 'Pricing, CTA, and hero headline experiments',                        enabled: false },

    // ── Content & Guides ─────────────────────────────────
    'blog':                { label: 'Blog / Guides',            category: 'Content',           description: '24 blog posts, neighbourhood guides, monthly guides',                enabled: true },
    'events-feed':         { label: 'Events Feed',              category: 'Content',           description: '150+ curated London events by month on What\'s On page',              enabled: true },
    'weather':             { label: 'Weather Integration',      category: 'Content',           description: 'OpenWeatherMap forecasts on itinerary pages',                        enabled: false },
    'email-templates':     { label: 'Email Templates',          category: 'Content',           description: 'Journey email templates (onboarding, pre-trip, daily, post-trip)',    enabled: true },

    // ── Internationalisation ─────────────────────────────
    'i18n':                { label: 'Multi-Language',           category: 'Internationalisation', description: 'English, Spanish, French, German translations',                   enabled: true },
    'language-pages':      { label: 'Language Landing Pages',   category: 'Internationalisation', description: 'Dedicated /es/, /fr/, /de/ landing pages',                       enabled: true },

    // ── AI Staff ─────────────────────────────────────────
    'ai-staff':            { label: 'AI Staff Agents',          category: 'AI Staff',          description: '15 Claude agents for content, marketing, analytics, outreach',       enabled: false },
    'ai-staff-admin':      { label: 'AI Staff Admin Panel',     category: 'AI Staff',          description: 'Admin tab for managing agent schedules and approvals',                enabled: true },

    // ── New Features ─────────────────────────────────────
    'trip-countdown':      { label: 'Trip Countdown & Packing',category: 'Engagement',        description: 'Post-purchase countdown timer, weather-aware packing list, travel doc checklist', enabled: true },
    'itinerary-share':     { label: 'Itinerary Sharing',       category: 'Engagement',        description: 'Share itinerary via WhatsApp, email, social media with unique link',   enabled: true },
    'referral-program':    { label: 'Referral Programme',       category: 'Monetisation',      description: 'Give $10, get $10 referral system with unique links and tracking',    enabled: true },
    'media-hub':           { label: 'Podcast & Video Hub',      category: 'Content',           description: 'Embedded podcast episodes and video guides for London travel',        enabled: true },
    'offline-pwa':         { label: 'Offline / PWA Mode',       category: 'Core',              description: 'Install as app, offline access to saved itineraries',                 enabled: true },
    'price-alerts':        { label: 'Price Drop Alerts',        category: 'Monetisation',      description: 'Monitor prices and notify when hotels, flights, attractions drop',    enabled: true },
    'claude-chat':         { label: 'Claude AI Chat',           category: 'AI Staff',          description: 'Claude API-powered conversational chat with venue knowledge',         enabled: false },
    'real-time-availability': { label: 'Real-Time Availability',category: 'Monetisation',      description: 'Live availability indicators and urgency cues on venue cards',        enabled: true },

    // ── Dream Features ─────────────────────────────────────
    'ai-concierge':        { label: 'AI Concierge',             category: 'AI Staff',          description: 'Live GPS-aware trip companion with contextual recommendations',     enabled: false },
    'dynamic-regen':       { label: 'Dynamic Regeneration',     category: 'Core',              description: 'Smart itinerary adjustments for rain, delays, closures, energy',    enabled: false },
    'ar-guide':            { label: 'AR Walking Guide',         category: 'Engagement',        description: 'Camera-based landmark recognition with history overlays',           enabled: false },
    'group-trip':          { label: 'Group Trip Planner',       category: 'Engagement',        description: 'Collaborative planning with voting, budget splitting, shared notes', enabled: false },
    'local-experts':       { label: 'Local Expert Marketplace', category: 'Monetisation',      description: 'Book verified local guides for walks, food tours, supper clubs',    enabled: false },
    'memory-book':         { label: 'Travel Memory Book',       category: 'Content',           description: 'Post-trip photo diary with notes, ratings, and print/share',        enabled: false },
    'multi-city':          { label: 'Multi-City Expansion',     category: 'Core',              description: 'Paris, Rome, Barcelona, NYC, Tokyo — cross-city itineraries',       enabled: false },
    'loyalty':             { label: 'Loyalty & Gamification',   category: 'Engagement',        description: 'Points, badges, tiers, and rewards for engagement',                 enabled: false },

    // ── Marketing & Outreach ────────────────────────────────
    'marketing-engine':    { label: 'Marketing Engine',         category: 'Admin',             description: 'AI-powered lead scoring, campaign calendar, and marketing automation',enabled: true },
    'social-scheduler':    { label: 'Social Media Scheduler',   category: 'Admin',             description: 'Create, schedule, and track posts across 6 platforms with AI generation', enabled: true },
    'sms-outreach':        { label: 'SMS Outreach',             category: 'Admin',             description: '10 automated SMS templates for lifecycle, recovery, and promotions', enabled: true },

    // ── Admin & CRM ──────────────────────────────────────
    'admin-panel':         { label: 'Admin Panel',              category: 'Admin',             description: 'Full admin dashboard with venue management, sales, integrations',    enabled: true },
    'ghl-integration':     { label: 'GoHighLevel CRM',          category: 'Admin',             description: 'Webhook integration for email capture, contacts, purchases',         enabled: false },
    'promotions':          { label: 'Promotions Module',        category: 'Admin',             description: 'Newsletter builder, social media, sponsor management',               enabled: true },

    // ── Growth Engines ────────────────────────────────────
    'growth-tiered-waitlist': { label: 'Tiered Waitlist',      category: 'Growth',            description: 'Pre-launch viral waitlist — share to unlock 40% off, Insider Bundle, Founding Member, upgrade, free trip',  enabled: true },
    'growth-trip-buddy':      { label: 'Trip Buddy Referrals',  category: 'Growth',            description: 'Post-purchase share codes — £20 voucher per friend who buys, recipient gets 20% off',                     enabled: false },
    'growth-gift-itinerary':  { label: 'Gift an Itinerary',     category: 'Growth',            description: 'Buy a London itinerary as a gift with recipient redemption code and scheduled delivery',                enabled: false },
    'growth-ugc-loop':        { label: 'Post-Trip UGC Loop',    category: 'Growth',            description: 'Post-trip "share your highlights" flow — ambassadors earn £25 per conversion using their promo code',    enabled: false },
    'growth-b2b-partners':    { label: 'B2B Partner Programme', category: 'Growth',            description: 'Partner landing page for hotels, tour operators, airlines, travel agents — 20% commission, white-label', enabled: false },
  },

  /**
   * Load saved flags from localStorage, merging with registry defaults
   */
  _load() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      return saved;
    } catch (e) {
      return {};
    }
  },

  /**
   * Check if a feature is enabled
   * @param {string} id — feature key, e.g. 'chat-assistant'
   * @returns {boolean}
   */
  isEnabled(id) {
    const saved = this._load();
    if (saved.hasOwnProperty(id)) return saved[id];
    const reg = this.registry[id];
    return reg ? reg.enabled : false;
  },

  /**
   * Set a feature's enabled state
   * @param {string} id
   * @param {boolean} enabled
   */
  set(id, enabled) {
    const saved = this._load();
    saved[id] = !!enabled;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saved));
  },

  /**
   * Reset a single feature to its default state
   */
  reset(id) {
    const saved = this._load();
    delete saved[id];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saved));
  },

  /**
   * Reset all features to defaults
   */
  resetAll() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  /**
   * Get all flags with their current states, grouped by category
   * @returns {Object} { category: [{ id, label, description, enabled, isDefault }] }
   */
  getAll() {
    const saved = this._load();
    const grouped = {};
    for (const [id, meta] of Object.entries(this.registry)) {
      const cat = meta.category;
      if (!grouped[cat]) grouped[cat] = [];
      const currentlyEnabled = saved.hasOwnProperty(id) ? saved[id] : meta.enabled;
      grouped[cat].push({
        id,
        label: meta.label,
        description: meta.description,
        enabled: currentlyEnabled,
        isDefault: !saved.hasOwnProperty(id),
        defaultValue: meta.enabled
      });
    }
    return grouped;
  },

  /**
   * Convenience: run a callback only if the feature is enabled
   */
  guard(id, fn) {
    if (this.isEnabled(id)) fn();
  }
};
