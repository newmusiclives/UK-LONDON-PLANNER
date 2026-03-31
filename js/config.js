const CONFIG = {
  siteName: 'London Journey Planner',
  siteTagline: 'Your Perfect London Trip, Curated by Experts',

  pricing: {
    tier1: { label: 'Short Stay', days: [1, 5], price: 20, currency: 'USD' },
    tier2: { label: 'Week Explorer', days: [6, 10], price: 40, currency: 'USD' },
    tier3: { label: 'Extended Adventure', days: [11, 21], price: 75, currency: 'USD' },
    consultation: { price: 75, currency: 'USD', duration: '1 hour' }
  },

  // Replace these with your actual Stripe Payment Links
  stripe: {
    links: {
      tier1: 'https://buy.stripe.com/YOUR_TIER1_LINK',
      tier2: 'https://buy.stripe.com/YOUR_TIER2_LINK',
      tier3: 'https://buy.stripe.com/YOUR_TIER3_LINK',
      consultation: 'https://buy.stripe.com/YOUR_CONSULTATION_LINK'
    }
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
