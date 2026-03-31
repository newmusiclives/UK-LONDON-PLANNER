const CONFIG = {
  siteName: 'London Journey Planner',
  siteTagline: 'Your Perfect London Trip, Curated by Experts',

  pricing: {
    tier1: { label: 'Short Stay', days: [1, 5], price: 20, currency: 'USD' },
    tier2: { label: 'Week Explorer', days: [6, 10], price: 40, currency: 'USD' },
    tier3: { label: 'Extended Adventure', days: [11, 21], price: 75, currency: 'USD' },
    concierge: { price: 50, currency: 'USD', label: 'Booking Concierge' },
    consultation: { price: 75, currency: 'USD', duration: '1 hour' }
  },

  // Replace these with your actual Stripe Payment Links
  stripe: {
    links: {
      tier1: 'https://buy.stripe.com/YOUR_TIER1_LINK',
      tier2: 'https://buy.stripe.com/YOUR_TIER2_LINK',
      tier3: 'https://buy.stripe.com/YOUR_TIER3_LINK',
      concierge: 'https://buy.stripe.com/YOUR_CONCIERGE_LINK',
      consultation: 'https://buy.stripe.com/YOUR_CONSULTATION_LINK'
    }
  },

  // ============================================================
  // AFFILIATE IDS — Fill these in after joining each program
  // See AFFILIATE-SETUP-GUIDE.md for sign-up links
  // ============================================================
  affiliateIds: {
    getYourGuide: 'YOUR_GYG_PARTNER_ID',       // partner.getyourguide.com
    booking:      'YOUR_BOOKING_AID',            // booking.com/affiliate-program
    viator:       'YOUR_VIATOR_PID',             // viator.com/affiliates
    todayTix:     'YOUR_TODAYTIX_ID',            // todaytix.com partnerships
    openTable:    'YOUR_OPENTABLE_REF',          // opentable.com/affiliates
    klook:        'YOUR_KLOOK_AID',              // affiliate.klook.com
    tiqets:       'YOUR_TIQETS_ID',              // tiqets.com/affiliates
    goCity:       'YOUR_GOCITY_ID',              // gocity.com/affiliates
    trainline:    'YOUR_TRAINLINE_ID',           // trainline.com/affiliates
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

  // Interest options
  interests: [
    { id: 'history', label: 'History & Heritage', icon: '🏛️' },
    { id: 'food', label: 'Food & Cuisine', icon: '🍽️' },
    { id: 'nightlife', label: 'Nightlife', icon: '🍸' },
    { id: 'art', label: 'Art & Culture', icon: '🎨' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'theatre', label: 'Theatre & Shows', icon: '🎭' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'family', label: 'Family Fun', icon: '👨‍👩‍👧‍👦' },
    { id: 'romance', label: 'Romance', icon: '💕' },
    { id: 'adventure', label: 'Adventure', icon: '🧗' },
    { id: 'photography', label: 'Photography', icon: '📸' },
    { id: 'architecture', label: 'Architecture', icon: '🏗️' },
    { id: 'literary', label: 'Literary London', icon: '📚' },
    { id: 'music', label: 'Music & Live Gigs', icon: '🎵' },
    { id: 'wellness', label: 'Wellness & Spa', icon: '🧘' },
    { id: 'markets', label: 'Markets & Vintage', icon: '🏪' }
  ],

  // Special occasion options
  occasions: [
    { id: 'none', label: 'Just Exploring', icon: '✈️' },
    { id: 'birthday', label: 'Birthday', icon: '🎂' },
    { id: 'anniversary', label: 'Anniversary', icon: '💍' },
    { id: 'hen-party', label: 'Hen Party / Girls Trip', icon: '👯‍♀️' },
    { id: 'stag-do', label: 'Stag Do / Lads Trip', icon: '🍻' },
    { id: 'engagement', label: 'Engagement / Proposal', icon: '💎' },
    { id: 'graduation', label: 'Graduation', icon: '🎓' },
    { id: 'honeymoon', label: 'Honeymoon', icon: '🥂' },
    { id: 'retirement', label: 'Retirement', icon: '🎉' }
  ],

  // Group type options
  groupTypes: [
    { id: 'solo', label: 'Solo Traveller', icon: '🧳' },
    { id: 'couple', label: 'Couple', icon: '💑' },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'friends-mixed', label: 'Group of Friends', icon: '👥' },
    { id: 'girls-group', label: 'Girls Group', icon: '👩‍👩‍👧‍👧' },
    { id: 'lads-group', label: 'Lads Group', icon: '👨‍👦‍👦' }
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

  // Concierge service details
  concierge: {
    price: 50,
    title: 'Booking Concierge Service',
    description: 'We\'ll handle as many of your bookings and reservations as possible — restaurants, attractions, theatre tickets, tours, and more.',
    features: [
      'We book restaurants, attractions & experiences for you',
      'Theatre & show ticket purchasing',
      'Hotel reservation assistance',
      'Alternative suggestions if anything is unavailable',
      'Confirmation email with all booking references',
      'Priority rebooking if plans change'
    ]
  },

  // Consultation details
  consultation: {
    title: 'Personal London Planning Session',
    description: 'Get a one-on-one video call with a London expert who will customise your itinerary, share insider tips, book restaurants, and answer all your questions.',
    features: [
      '1-hour private video consultation',
      'Customised itinerary adjustments',
      'Restaurant & hotel booking assistance',
      'Insider tips & hidden gems',
      'Follow-up email with notes & links',
      'Priority email support for 7 days'
    ]
  },

  // Affiliate tracking
  affiliate: {
    utmSource: 'londonplanner',
    utmMedium: 'itinerary',
    disclosureText: 'We may earn a small commission from bookings made through our links, at no extra cost to you.'
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

    switch (provider) {
      case 'getyourguide':
        return ids.getYourGuide !== 'YOUR_GYG_PARTNER_ID'
          ? `${baseUrl}?partner_id=${ids.getYourGuide}&${utm}`
          : `${baseUrl}?${utm}`;
      case 'booking':
        return ids.booking !== 'YOUR_BOOKING_AID'
          ? `${baseUrl}?aid=${ids.booking}&${utm}`
          : `${baseUrl}?${utm}`;
      case 'viator':
        return ids.viator !== 'YOUR_VIATOR_PID'
          ? `${baseUrl}?pid=${ids.viator}&${utm}`
          : `${baseUrl}?${utm}`;
      case 'todaytix':
        return ids.todayTix !== 'YOUR_TODAYTIX_ID'
          ? `${baseUrl}?ref=${ids.todayTix}&${utm}`
          : `${baseUrl}?${utm}`;
      case 'opentable':
        return ids.openTable !== 'YOUR_OPENTABLE_REF'
          ? `${baseUrl}?ref=${ids.openTable}&${utm}`
          : `${baseUrl}?${utm}`;
      case 'klook':
        return ids.klook !== 'YOUR_KLOOK_AID'
          ? `${baseUrl}?aid=${ids.klook}&${utm}`
          : `${baseUrl}?${utm}`;
      case 'tiqets':
        return ids.tiqets !== 'YOUR_TIQETS_ID'
          ? `${baseUrl}?partner=${ids.tiqets}&${utm}`
          : `${baseUrl}?${utm}`;
      default:
        return baseUrl.includes('?') ? `${baseUrl}&${utm}` : `${baseUrl}?${utm}`;
    }
  },

  // Detect provider from URL
  detect(url) {
    if (!url) return 'unknown';
    if (url.includes('getyourguide')) return 'getyourguide';
    if (url.includes('booking.com')) return 'booking';
    if (url.includes('viator')) return 'viator';
    if (url.includes('todaytix')) return 'todaytix';
    if (url.includes('opentable')) return 'opentable';
    if (url.includes('klook')) return 'klook';
    if (url.includes('tiqets')) return 'tiqets';
    return 'unknown';
  },

  // Auto-build link with auto-detected provider
  auto(url) {
    return this.build(url, this.detect(url));
  }
};
