const CONFIG = {
  siteName: 'London Planned',
  siteTagline: 'Your Perfect London & UK Trip, Curated by Experts',

  pricing: {
    tier1: { label: 'Short Stay', days: [1, 5], price: 50, currency: 'USD' },
    tier2: { label: 'Week Explorer', days: [6, 10], price: 75, currency: 'USD' },
    tier3: { label: 'Extended Adventure', days: [11, 21], price: 150, currency: 'USD' },
    // Personal guide pricing now handled by affiliate partners (ToursByLocals, WithLocals)
    _personalGuideDeprecated: {
      perDay: 250,
      currency: 'USD',
      label: 'Personal London Guide',
      days: { 1: 250, 2: 450, 3: 600, 4: 750, 5: 900 }
    }
  },

  // ============================================================
  // STRIPE — Payment Processing
  // Replace these with your actual Stripe Payment Links
  // Create them at https://dashboard.stripe.com/payment-links
  // ============================================================
  stripe: {
    links: {
      tier1: 'https://buy.stripe.com/YOUR_TIER1_LINK',
      tier2: 'https://buy.stripe.com/YOUR_TIER2_LINK',
      tier3: 'https://buy.stripe.com/YOUR_TIER3_LINK',
    }
  },

  // ============================================================
  // GOHIGHLEVEL CRM — Email, SMS, Voice, and CRM Functions
  // Replace with your actual GoHighLevel configuration
  // ============================================================
  goHighLevel: {
    apiBaseUrl: 'https://rest.gohighlevel.com/v1',
    locationId: 'YOUR_GHL_LOCATION_ID',
    apiKey: 'YOUR_GHL_API_KEY',
    // Webhook URLs for form submissions
    webhooks: {
      itineraryPurchase: 'https://services.leadconnectorhq.com/hooks/YOUR_ITINERARY_WEBHOOK',
      contactForm: 'https://services.leadconnectorhq.com/hooks/YOUR_CONTACT_WEBHOOK',
      emailCapture: 'https://services.leadconnectorhq.com/hooks/YOUR_EMAIL_CAPTURE_WEBHOOK',
      promotionsNewsletter: 'https://services.leadconnectorhq.com/hooks/YOUR_NEWSLETTER_WEBHOOK',
      waitlist: 'https://services.leadconnectorhq.com/hooks/YOUR_WAITLIST_WEBHOOK',
      giftPurchase: 'https://services.leadconnectorhq.com/hooks/YOUR_GIFT_WEBHOOK',
      partnerLead: 'https://services.leadconnectorhq.com/hooks/YOUR_PARTNER_WEBHOOK',
      ugcSubmission: 'https://services.leadconnectorhq.com/hooks/YOUR_UGC_WEBHOOK',
      wizardSubmission: 'https://services.leadconnectorhq.com/hooks/YOUR_WIZARD_WEBHOOK'
    },
    calendarId: 'YOUR_GHL_CALENDAR_ID',
    // Pipeline for tracking customer journey
    pipelineId: 'YOUR_GHL_PIPELINE_ID',
    pipelineStages: {
      lead: 'YOUR_LEAD_STAGE_ID',
      itineraryCreated: 'YOUR_ITINERARY_CREATED_STAGE_ID',
      paid: 'YOUR_PAID_STAGE_ID',
    }
  },

  // ============================================================
  // AFFILIATE IDS — Fill these in after joining each program
  // See AFFILIATE-SETUP-GUIDE.md for sign-up links
  // ============================================================
  affiliateIds: {
    getYourGuide: 'YOUR_GYG_PARTNER_ID',
    booking:      'YOUR_BOOKING_AID',
    viator:       'YOUR_VIATOR_PID',
    todayTix:     'YOUR_TODAYTIX_ID',
    openTable:    'YOUR_OPENTABLE_REF',
    klook:        'YOUR_KLOOK_AID',
    tiqets:       'YOUR_TIQETS_ID',
    goCity:       'YOUR_GOCITY_ID',
    trainline:    'YOUR_TRAINLINE_ID',
    expedia:      'YOUR_EXPEDIA_ID',
    hostelworld:  'YOUR_HOSTELWORLD_ID',
    skyscanner:   'YOUR_SKYSCANNER_ID',
    amazonUK:     'YOUR_AMAZON_UK_TAG',
    tripadvisor:  'YOUR_TRIPADVISOR_ID',
    musement:     'YOUR_MUSEMENT_ID',
    headout:      'YOUR_HEADOUT_ID',
    eurostar:     'YOUR_EUROSTAR_ID',
    omio:         'YOUR_OMIO_ID',
    rentalcars:   'YOUR_RENTALCARS_ID',
    theFork:      'YOUR_THEFORK_ID',
    londonTheatreDirect: 'YOUR_LTD_ID',
    worldNomads:  'YOUR_WORLDNOMADS_ID',
    safetyWing:   'YOUR_SAFETYWING_ID',
    wise:         'YOUR_WISE_ID',
    revolut:      'YOUR_REVOLUT_ID',
    airalo:       'YOUR_AIRALO_ID',
    withLocals:   'YOUR_WITHLOCALS_ID',
    toursByLocals: 'YOUR_TOURSBYLOCALS_ID',
    contextTravel: 'YOUR_CONTEXTTRAVEL_ID',
  },

  // Pages
  successUrl: 'success.html',
  cancelUrl: 'cancel.html',

  // Trip constraints
  trip: {
    minDays: 1,
    maxDays: 21,
    defaultDays: 5
  },

  // UK Extension pricing (added to base London itinerary price)
  ukExtension: {
    enabled: true,
    pricing: {
      short:    { days: [1, 5],   price: 50, label: 'UK Short Break' },
      standard: { days: [6, 10],  price: 75, label: 'UK Explorer' },
      extended: { days: [11, 21], price: 150, label: 'Grand UK Tour' }
    },
    stripe: {
      short:    'https://buy.stripe.com/YOUR_UK_SHORT_LINK',
      standard: 'https://buy.stripe.com/YOUR_UK_STANDARD_LINK',
      extended: 'https://buy.stripe.com/YOUR_UK_EXTENDED_LINK'
    }
  },

  // UK destination types for filtering
  ukDestinationTypes: [
    { id: 'city', label: 'Historic Cities', icon: '🏰' },
    { id: 'coastal', label: 'Coastal & Seaside', icon: '🏖️' },
    { id: 'countryside', label: 'Countryside & Nature', icon: '🌿' }
  ],

  // Interest options
  interests: [
    { id: 'history', label: 'History & Heritage', icon: '🏛️' },
    { id: 'food', label: 'Food & Cuisine', icon: '🍽️' },
    { id: 'nightlife', label: 'Nightlife & Bars', icon: '🍸' },
    { id: 'art', label: 'Art & Culture', icon: '🎨' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'theatre', label: 'Theatre & Shows', icon: '🎭' },
    { id: 'sports', label: 'Sports & Football', icon: '⚽' },
    { id: 'family', label: 'Family Fun', icon: '👨‍👩‍👧‍👦' },
    { id: 'romance', label: 'Romance', icon: '💕' },
    { id: 'adventure', label: 'Adventure', icon: '🧗' },
    { id: 'photography', label: 'Photography Spots', icon: '📸' },
    { id: 'architecture', label: 'Architecture', icon: '🏗️' },
    { id: 'literary', label: 'Literary London', icon: '📚' },
    { id: 'music', label: 'Music & Live Gigs', icon: '🎵' },
    { id: 'wellness', label: 'Wellness & Spa', icon: '🧘' },
    { id: 'markets', label: 'Markets & Vintage', icon: '🏪' },
    { id: 'coffee', label: 'Coffee & Cafes', icon: '☕' },
    { id: 'craft-beer', label: 'Craft Beer & Breweries', icon: '🍺' },
    { id: 'street-food', label: 'Street Food', icon: '🌮' },
    { id: 'hidden-gems', label: 'Hidden Gems & Secrets', icon: '🔮' },
    { id: 'instagram', label: 'Instagrammable London', icon: '📱' },
    { id: 'royals', label: 'Royal London', icon: '👑' },
    { id: 'dark-history', label: 'Dark History & Ghosts', icon: '👻' },
    { id: 'film-tv', label: 'Film & TV Locations', icon: '🎬' },
    { id: 'gardens', label: 'Parks & Gardens', icon: '🌳' },
    { id: 'science', label: 'Science & Innovation', icon: '🔬' },
    { id: 'sustainable', label: 'Eco & Sustainable', icon: '♻️' },
    { id: 'lgbtq', label: 'LGBTQ+ London', icon: '🏳️‍🌈' },
    { id: 'cocktails', label: 'Cocktails & Speakeasies', icon: '🍹' },
    { id: 'brunch', label: 'Brunch Culture', icon: '🥞' }
  ],

  // Special occasion options
  occasions: [
    { id: 'none', label: 'Just Exploring', icon: '✈️' },
    { id: 'birthday', label: 'Birthday', icon: '🎂' },
    { id: 'milestone-birthday', label: 'Milestone Birthday (30/40/50)', icon: '🎊' },
    { id: 'anniversary', label: 'Anniversary', icon: '💍' },
    { id: 'hen-party', label: 'Hen Party / Girls Trip', icon: '👯‍♀️' },
    { id: 'stag-do', label: 'Stag Do / Lads Trip', icon: '🍻' },
    { id: 'engagement', label: 'Engagement / Proposal', icon: '💎' },
    { id: 'graduation', label: 'Graduation', icon: '🎓' },
    { id: 'honeymoon', label: 'Honeymoon', icon: '🥂' },
    { id: 'retirement', label: 'Retirement', icon: '🎉' },
    { id: 'babymoon', label: 'Babymoon', icon: '🤰' },
    { id: 'reunion', label: 'Family Reunion', icon: '🤗' },
    { id: 'work-trip', label: 'Work Trip / Bleisure', icon: '💼' },
    { id: 'first-visit', label: 'First Time in London', icon: '🗺️' },
    { id: 'return-visit', label: 'Return Visit — Show Me New', icon: '🔄' },
    { id: 'valentines', label: 'Valentine\'s Day', icon: '❤️' },
    { id: 'new-years', label: 'New Year\'s Eve', icon: '🎆' },
    { id: 'christmas', label: 'Christmas in London', icon: '🎄' },
    { id: 'gap-year', label: 'Gap Year / Backpacking', icon: '🎒' },
    { id: 'treat-yourself', label: 'Treat Yourself / Solo Celebration', icon: '💅' },
    { id: 'recovery', label: 'Breakup Recovery Trip', icon: '🦋' },
    { id: 'bucket-list', label: 'Bucket List Trip', icon: '✨' }
  ],

  // Group type options
  groupTypes: [
    { id: 'solo', label: 'Solo Traveller', icon: '🧳', needsDetails: false },
    { id: 'couple', label: 'Couple', icon: '💑', needsDetails: false },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', needsDetails: true },
    { id: 'friends-mixed', label: 'Group of Friends', icon: '👥', needsDetails: true },
    { id: 'girls-group', label: 'Girls Group', icon: '👩‍👩‍👧‍👧', needsDetails: true },
    { id: 'lads-group', label: 'Lads Group', icon: '👨‍👦‍👦', needsDetails: true },
    { id: 'multi-family', label: 'Multiple Families', icon: '👨‍👩‍👧‍👦👨‍👩‍👦', needsDetails: true },
    { id: 'work-group', label: 'Work Colleagues', icon: '👔', needsDetails: true },
    { id: 'seniors', label: 'Seniors / Retirees', icon: '🧓', needsDetails: false },
    { id: 'parent-child', label: 'Parent & Child', icon: '👩‍👧', needsDetails: true }
  ],

  budgetTiers: {
    accommodation: {
      budget: { label: 'Budget', range: '£40-80/night', desc: 'Hostels & budget hotels' },
      'mid-range': { label: 'Mid-Range', range: '£100-200/night', desc: '3-4 star hotels' },
      premium: { label: 'Premium', range: '£250+/night', desc: 'Luxury 5-star hotels' }
    },
    food: {
      budget: { label: 'Budget', range: '£20-35/day', desc: 'Street food & casual dining' },
      'mid-range': { label: 'Mid-Range', range: '£40-70/day', desc: 'Gastropubs & restaurants' },
      premium: { label: 'Premium', range: '£80+/day', desc: 'Fine dining experiences' }
    },
    entertainment: {
      budget: { label: 'Budget', range: '£10-30/day', desc: 'Free museums & parks' },
      'mid-range': { label: 'Mid-Range', range: '£40-80/day', desc: 'Shows & guided tours' },
      premium: { label: 'Premium', range: '£100+/day', desc: 'VIP experiences & private tours' }
    }
  },

  // Supported currencies for multi-currency display
  currencies: {
    USD: { symbol: '$', rate: 1 },
    GBP: { symbol: '£', rate: 0.79 },
    EUR: { symbol: '€', rate: 0.92 },
    AUD: { symbol: 'A$', rate: 1.53 },
    CAD: { symbol: 'C$', rate: 1.36 }
  },

  // Affiliate tracking
  affiliate: {
    utmSource: 'londonplanned',
    utmMedium: 'itinerary',
    disclosureText: 'We may earn a small commission from bookings made through our links, at no extra cost to you.'
  },

  // Weather API (free tier from OpenWeatherMap)
  weather: {
    apiKey: 'YOUR_OPENWEATHERMAP_API_KEY',
    city: 'London,GB'
  },

  // TfL API (free, no key needed for basic access)
  tfl: {
    baseUrl: 'https://api.tfl.gov.uk'
  }
};

// ============================================================
// AFFILIATE LINK BUILDER
// Automatically appends your affiliate IDs to all outbound links
// ============================================================
const AffiliateLinks = {
  build(baseUrl, provider) {
    if (!baseUrl) return '';
    const ids = CONFIG.affiliateIds;
    const utm = `utm_source=${CONFIG.affiliate.utmSource}&utm_medium=${CONFIG.affiliate.utmMedium}`;

    const sep = (u) => u.includes('?') ? '&' : '?';
    const tag = (u, param, val) => val && !val.includes('YOUR_') ? `${u}${sep(u)}${param}=${val}&${utm}` : `${u}${sep(u)}${utm}`;

    switch (provider) {
      case 'getyourguide': return tag(baseUrl, 'partner_id', ids.getYourGuide);
      case 'booking': return tag(baseUrl, 'aid', ids.booking);
      case 'viator': return tag(baseUrl, 'pid', ids.viator);
      case 'todaytix': return tag(baseUrl, 'ref', ids.todayTix);
      case 'opentable': return tag(baseUrl, 'ref', ids.openTable);
      case 'klook': return tag(baseUrl, 'aid', ids.klook);
      case 'tiqets': return tag(baseUrl, 'partner', ids.tiqets);
      case 'trainline': return tag(baseUrl, 'partner', ids.trainline);
      case 'expedia': return tag(baseUrl, 'affcid', ids.expedia);
      case 'hostelworld': return tag(baseUrl, 'affiliate', ids.hostelworld);
      case 'skyscanner': return tag(baseUrl, 'associateId', ids.skyscanner);
      case 'amazon': return tag(baseUrl, 'tag', ids.amazonUK);
      case 'tripadvisor': return tag(baseUrl, 'partner', ids.tripadvisor);
      case 'musement': return tag(baseUrl, 'aid', ids.musement);
      case 'headout': return tag(baseUrl, 'partner', ids.headout);
      case 'eurostar': return tag(baseUrl, 'affiliate', ids.eurostar);
      case 'omio': return tag(baseUrl, 'partner', ids.omio);
      case 'rentalcars': return tag(baseUrl, 'affiliateCode', ids.rentalcars);
      case 'thefork': return tag(baseUrl, 'ref', ids.theFork);
      case 'londontheatredirect': return tag(baseUrl, 'partner', ids.londonTheatreDirect);
      case 'worldnomads': return tag(baseUrl, 'affiliate', ids.worldNomads);
      case 'safetywing': return tag(baseUrl, 'referenceID', ids.safetyWing);
      case 'wise': return tag(baseUrl, 'partnerID', ids.wise);
      case 'airalo': return tag(baseUrl, 'ref', ids.airalo);
      case 'withlocals': return tag(baseUrl, 'affiliate_id', ids.withLocals);
      case 'toursbylocals': return tag(baseUrl, 'ref', ids.toursByLocals);
      case 'contexttravel': return tag(baseUrl, 'affiliate', ids.contextTravel);
      default: return `${baseUrl}${sep(baseUrl)}${utm}`;
    }
  },

  detect(url) {
    if (!url) return 'unknown';
    if (url.includes('getyourguide')) return 'getyourguide';
    if (url.includes('booking.com')) return 'booking';
    if (url.includes('viator')) return 'viator';
    if (url.includes('todaytix')) return 'todaytix';
    if (url.includes('opentable')) return 'opentable';
    if (url.includes('klook')) return 'klook';
    if (url.includes('tiqets')) return 'tiqets';
    if (url.includes('withlocals')) return 'withlocals';
    if (url.includes('toursbylocals')) return 'toursbylocals';
    if (url.includes('contexttravel')) return 'contexttravel';
    return 'unknown';
  },

  auto(url) {
    return this.build(url, this.detect(url));
  },

  // True iff the affiliate ID for this provider is populated (non-empty,
  // non-placeholder). Use to gate visibility of affiliate CTAs so we don't
  // show "Book now" links for programs we haven't been approved on yet.
  // Unknown / generic providers return false — callers decide whether to
  // still show a non-affiliate link.
  isApproved(provider) {
    if (!provider || provider === 'unknown') return false;
    const keyMap = {
      getyourguide: 'getYourGuide', booking: 'booking', viator: 'viator',
      todaytix: 'todayTix', opentable: 'openTable', klook: 'klook',
      tiqets: 'tiqets', trainline: 'trainline', expedia: 'expedia',
      hostelworld: 'hostelworld', skyscanner: 'skyscanner', amazon: 'amazonUK',
      tripadvisor: 'tripadvisor', musement: 'musement', headout: 'headout',
      eurostar: 'eurostar', omio: 'omio', rentalcars: 'rentalcars',
      thefork: 'theFork', londontheatredirect: 'londonTheatreDirect',
      worldnomads: 'worldNomads', safetywing: 'safetyWing', wise: 'wise',
      airalo: 'airalo', withlocals: 'withLocals',
      toursbylocals: 'toursByLocals', contexttravel: 'contextTravel',
      gocity: 'goCity',
    };
    const key = keyMap[provider.toLowerCase()];
    if (!key) return false;
    const val = (CONFIG.affiliateIds || {})[key];
    return !!(val && !val.includes('YOUR_'));
  }
};

// ============================================================
// GOHIGHLEVEL CRM INTEGRATION
// Sends contact data to GoHighLevel for email, SMS, voice
// ============================================================
const GHL = {
  async sendToWebhook(webhookKey, data) {
    const url = CONFIG.goHighLevel.webhooks[webhookKey];
    if (!url || url.includes('YOUR_')) {
      console.log(`GHL Demo Mode [${webhookKey}]:`, data);
      return { success: true, demo: true };
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'London Planned',
          timestamp: new Date().toISOString()
        })
      });
      return { success: response.ok };
    } catch (e) {
      console.warn('GHL webhook failed:', e);
      return { success: false, error: e.message };
    }
  },

  async captureContact(formData) {
    return this.sendToWebhook('emailCapture', {
      type: 'email_capture',
      email: formData.email,
      name: formData.name || '',
      tags: ['london-planned', 'lead'],
      ...formData
    });
  },

  async trackItineraryPurchase(purchaseData) {
    return this.sendToWebhook('itineraryPurchase', {
      type: 'itinerary_purchase',
      tags: ['london-planned', 'customer', 'itinerary-buyer'],
      ...purchaseData
    });
  },

  async submitContactForm(formData) {
    return this.sendToWebhook('contactForm', {
      type: 'contact_form',
      tags: ['london-planned', 'contact-form'],
      ...formData
    });
  },

  // ── Growth: Tiered Waitlist ─────────────────────────────
  async submitWaitlist(data) {
    // Falls back to emailCapture hook if a dedicated waitlist hook isn't set.
    const hasDedicated = !!(CONFIG.goHighLevel.webhooks.waitlist &&
      !CONFIG.goHighLevel.webhooks.waitlist.includes('YOUR_'));
    const key = hasDedicated ? 'waitlist' : 'emailCapture';
    const result = await this.sendToWebhook(key, {
      type: 'waitlist_signup',
      tags: ['london-planned', 'waitlist', `tier-${data.tier || 0}`,
             data.referredBy ? 'referred' : 'organic'].filter(Boolean),
      ...data
    });
    // Fire-and-forget referrer increment. GHL workflows can't bump another
    // contact's counter, so the increment lives in a Netlify function.
    // Failure here must not block the signup — swallow errors.
    if (data.referredBy) {
      try {
        fetch('/.netlify/functions/increment-referrer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ referredBy: data.referredBy })
        }).catch(() => {});
      } catch (_) {}
    }
    return result;
  },

  // ── Growth: Gift Itinerary ──────────────────────────────
  async purchaseGift(data) {
    return this.sendToWebhook('giftPurchase', {
      type: 'gift_purchase',
      tags: ['london-planned', 'gift-buyer', `gift-${data.tierId || 'unknown'}`],
      ...data
    });
  },

  // ── Growth: B2B Partner Lead ────────────────────────────
  async submitPartnerLead(data) {
    return this.sendToWebhook('partnerLead', {
      type: 'partner_lead',
      tags: ['london-planned', 'partner-lead', `partner-type-${data.partnerType || 'other'}`],
      ...data
    });
  },

  // ── Growth: Post-Trip UGC Submission ────────────────────
  async submitUgc(data) {
    return this.sendToWebhook('ugcSubmission', {
      type: 'ugc_submission',
      tags: ['london-planned', 'ugc', 'post-trip', 'ambassador'],
      ...data
    });
  },

  // ── Wizard Submission (pre-purchase) ────────────────────
  // Fires when a user reaches the Review step and generates an itinerary.
  // Populates all 21 GHL custom fields so Workflow 11.1 can tag, move the
  // contact into the Customer Journey pipeline at Prospect, and send the
  // personalised preview email. Email is taken from a logged-in account if
  // available — otherwise the webhook lands anonymously and merges on checkout.
  async submitWizard(payload) {
    const tripDays = Number(payload.tripDays) || 0;
    const itineraryTier =
      tripDays <= 5 ? 'tier-short' :
      tripDays <= 10 ? 'tier-week' : 'tier-extended';

    const data = {
      type: 'wizard_submission',
      tags: [
        'london-planned', 'post-launch',
        `group-${payload.groupType || 'unknown'}`,
        payload.occasion ? `occasion-${payload.occasion}` : null,
        `budget-${payload.budget?.accommodation || 'mid-range'}`,
        ...(Array.isArray(payload.interests) ? payload.interests.map(i => `interest-${i}`) : []),
        payload.ukExtension?.enabled ? 'uk-extension' : null
      ].filter(Boolean),
      // Custom field payload — keys match GHL contact.* field keys exactly
      trip_length_days: tripDays,
      trip_start: payload.travelDates?.start || '',
      trip_end: payload.travelDates?.end || '',
      beyond_london: !!payload.ukExtension?.enabled,
      uk_destinations: Array.isArray(payload.ukExtension?.destinationNames)
        ? payload.ukExtension.destinationNames : [],
      group_type: payload.groupTypeLabel || payload.groupType || '',
      occasion: payload.occasionLabel || payload.occasion || '',
      budget_accommodation: payload.budgetLabels?.accommodation || '',
      budget_food: payload.budgetLabels?.food || '',
      budget_entertainment: payload.budgetLabels?.entertainment || '',
      interests: Array.isArray(payload.interestsLabels) ? payload.interestsLabels : [],
      itinerary_tier: itineraryTier,
      // Identity — email is best-effort; falls through if not logged in
      email: payload.email || '',
      firstName: payload.firstName || '',
      share_code: payload.shareCode || '',
      referred_by: payload.referredBy || ''
    };
    return this.sendToWebhook('wizardSubmission', data);
  }
};

// ============================================================
// SHARE CODES — Generate and parse waitlist / trip-buddy codes
// Code format: LP-XXXXXX (6 base32 chars, no ambiguous 0/O/1/I)
// ============================================================
const ShareCodes = {
  STORAGE_KEY: 'londonplannedShareCode',
  REF_STORAGE_KEY: 'londonplannedReferredBy',
  ALPHABET: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',

  generate() {
    const buf = new Uint8Array(6);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    let code = '';
    for (let i = 0; i < 6; i++) code += this.ALPHABET[buf[i] % this.ALPHABET.length];
    return `LP-${code}`;
  },

  // Returns existing code from storage, or generates + persists one.
  mine() {
    let code = '';
    try { code = localStorage.getItem(this.STORAGE_KEY) || ''; } catch (_) {}
    if (!code) {
      code = this.generate();
      try { localStorage.setItem(this.STORAGE_KEY, code); } catch (_) {}
    }
    return code;
  },

  // Capture ?ref=XXX from URL on any page load and remember it for 60 days.
  captureReferrer() {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref && /^LP-[A-Z2-9]{6}$/i.test(ref)) {
        localStorage.setItem(this.REF_STORAGE_KEY, ref.toUpperCase());
        localStorage.setItem(this.REF_STORAGE_KEY + 'Ts', String(Date.now()));
      }
    } catch (_) {}
  },

  referredBy() {
    try {
      const ref = localStorage.getItem(this.REF_STORAGE_KEY);
      const ts = parseInt(localStorage.getItem(this.REF_STORAGE_KEY + 'Ts') || '0', 10);
      if (!ref) return '';
      if (Date.now() - ts > 60 * 24 * 60 * 60 * 1000) return '';
      return ref;
    } catch (_) { return ''; }
  },

  shareUrl(code, path = '/') {
    const origin = window.location.origin || '';
    return `${origin}${path}${path.includes('?') ? '&' : '?'}ref=${encodeURIComponent(code)}`;
  }
};

// Auto-capture referrer on every page load
if (typeof window !== 'undefined') {
  try { ShareCodes.captureReferrer(); } catch (_) {}
}

// ============================================================
// CURRENCY CONVERTER
// ============================================================
const CurrencyConverter = {
  _selected: localStorage.getItem('selectedCurrency') || 'USD',

  get() {
    return this._selected;
  },

  set(currency) {
    this._selected = currency;
    localStorage.setItem('selectedCurrency', currency);
    document.dispatchEvent(new CustomEvent('currencyChanged', { detail: currency }));
  },

  convert(amountUSD) {
    const rate = CONFIG.currencies[this._selected]?.rate || 1;
    return amountUSD * rate;
  },

  format(amountUSD) {
    const converted = this.convert(amountUSD);
    const symbol = CONFIG.currencies[this._selected]?.symbol || '$';
    return `${symbol}${converted.toFixed(converted % 1 === 0 ? 0 : 2)}`;
  }
};
