// ============================================================
// MARKETING ENGINE — Proactive AI-powered marketing system
// Social media scheduling, SMS outreach, campaign calendar,
// lead scoring, performance tracking, AI content generation
// ============================================================
const MarketingEngine = {
  STORAGE_KEY: 'marketingEngine',

  // ── Campaign Calendar ──────────────────────────────────
  campaigns: [
    { id: 'spring-break', name: 'Spring Break London', status: 'scheduled', startDate: '2026-03-15', endDate: '2026-04-15', channels: ['email', 'instagram', 'tiktok', 'sms'], budget: 0, target: 'Families & students planning Easter trips', cta: 'Plan My Spring Trip', discount: '15% off 5+ day itineraries' },
    { id: 'summer-2026', name: 'Summer in London 2026', status: 'draft', startDate: '2026-05-01', endDate: '2026-08-31', channels: ['email', 'instagram', 'tiktok', 'facebook', 'sms'], budget: 0, target: 'Couples & groups planning summer holidays', cta: 'Plan My Summer Adventure', discount: 'Free UK extension add-on' },
    { id: 'festive-london', name: 'Christmas & NYE in London', status: 'draft', startDate: '2026-11-01', endDate: '2026-12-31', channels: ['email', 'instagram', 'pinterest', 'sms'], budget: 0, target: 'Couples & families for festive markets and NYE', cta: 'Plan My Festive Trip', discount: '20% early bird discount' },
    { id: 'weekly-newsletter', name: 'The London Edit (Weekly)', status: 'active', startDate: '2026-01-01', endDate: '2026-12-31', channels: ['email'], budget: 0, target: 'All subscribers', cta: 'Read This Week\'s Edition', discount: null },
    { id: 'abandoned-cart', name: 'Wizard Abandonment Recovery', status: 'active', startDate: '2026-01-01', endDate: '2026-12-31', channels: ['email', 'sms'], budget: 0, target: 'Users who started but didn\'t finish wizard', cta: 'Finish Planning Your Trip', discount: '10% comeback discount' },
  ],

  // ── Social Media Content Templates ─────────────────────
  socialTemplates: {
    instagram: {
      carousel: [
        { hook: '5 places in London tourists never find 🤫', slides: 5, cta: 'Save for your trip ✈️', hashtags: '#london #hiddengems #traveluk #londontravel #visitlondon' },
        { hook: 'Your perfect London day ☀️ (save this)', slides: 7, cta: 'Link in bio for your personalised itinerary', hashtags: '#londonitinerary #travelplanning #londonguide #uktravel' },
        { hook: 'London on a budget — everything under £10 💰', slides: 6, cta: 'Free guide in bio', hashtags: '#budgettravel #londoncheap #freeinthings #londonbudget' },
        { hook: 'The perfect London food tour 🍽️', slides: 8, cta: 'Get your own food-focused itinerary', hashtags: '#londonfood #boroughmarket #foodtour #londonrestaurants' },
      ],
      reels: [
        { concept: 'POV: You followed our London itinerary', duration: '30s', music: 'trending audio', hook: 'First 3 seconds: Big Ben reveal' },
        { concept: 'London in 48 hours — is it possible?', duration: '60s', music: 'upbeat travel', hook: 'Rapid montage of 10 activities' },
        { concept: 'Things I wish I knew before visiting London', duration: '45s', music: 'storytelling', hook: 'Oyster card mistake' },
      ]
    },
    tiktok: {
      videos: [
        { hook: 'London hack that saves you £50 👀', duration: '30s', style: 'talking head + b-roll', cta: 'Comment PLAN for the link' },
        { hook: 'Rating London\'s most famous restaurants', duration: '60s', style: 'taste test montage', cta: 'Follow for Part 2' },
        { hook: 'I planned a London trip using AI and this happened', duration: '45s', style: 'screen recording + reaction', cta: 'Link in bio' },
        { hook: 'The £0 London day that\'s better than the expensive one', duration: '30s', style: 'vlog style', cta: 'Save this for your trip' },
        { hook: '3 restaurants London locals don\'t want you to know about', duration: '45s', style: 'secret reveal', cta: 'Part 2 if this gets 1000 likes' },
      ]
    },
    x: {
      threads: [
        { opener: 'I\'ve helped 2,000+ people plan their London trip. Here are the 10 mistakes everyone makes (and how to avoid them) 🧵', tweets: 12 },
        { opener: 'The ultimate London budget guide. Everything you need for under £50/day 🧵', tweets: 10 },
        { opener: 'London\'s best kept secrets — a thread of places tourists never find 🧵', tweets: 15 },
      ]
    },
    email: {
      sequences: [
        { name: 'Welcome Series', emails: 5, spacing: '1,3,5,7,14 days', goal: 'Nurture to purchase' },
        { name: 'Abandoned Wizard', emails: 3, spacing: '1hr, 24hr, 72hr', goal: 'Complete purchase' },
        { name: 'Pre-Trip Prep', emails: 4, spacing: '-14, -7, -3, -1 days', goal: 'Excitement + upsell' },
        { name: 'Post-Trip', emails: 3, spacing: '+3, +7, +30 days', goal: 'Review + referral + rebooking' },
        { name: 'Win-Back', emails: 2, spacing: '+60, +90 days', goal: 'Re-engage dormant leads' },
      ]
    },
    sms: {
      templates: [
        { trigger: 'wizard_abandoned', delay: '2 hours', message: 'Hey {first_name}! Your London trip is waiting 🇬🇧 Finish planning and get 10% off: {wizard_link}', compliance: 'Reply STOP to unsubscribe' },
        { trigger: 'trip_tomorrow', delay: '9am day before', message: '✈️ London tomorrow! Your itinerary is ready: {itinerary_link}. Weather: {weather}. Have an amazing trip!', compliance: 'Reply STOP to unsubscribe' },
        { trigger: 'trip_ended', delay: '3 days after', message: 'Hope you loved London {first_name}! 🇬🇧 Quick 2-min review? {review_link} — helps us help more travellers!', compliance: 'Reply STOP to unsubscribe' },
        { trigger: 'flash_sale', delay: 'immediate', message: '⚡ 24HR FLASH SALE: London itineraries 25% off! Plan your trip: {sale_link}', compliance: 'Reply STOP to unsubscribe' },
      ]
    }
  },

  // ── Lead Scoring ───────────────────────────────────────
  leadScoring: {
    actions: {
      'page_view_homepage': 1,
      'page_view_wizard': 5,
      'wizard_started': 10,
      'wizard_step_2': 15,
      'wizard_step_5': 25,
      'wizard_completed': 40,
      'email_subscribed': 8,
      'quiz_completed': 12,
      'free_guide_downloaded': 10,
      'demo_viewed': 7,
      'blog_read_3plus': 6,
      'return_visit': 5,
      'referral_link_clicked': 3,
      'price_alert_subscribed': 8,
      'social_share': 4,
    },
    tiers: [
      { name: 'Cold', min: 0, max: 10, action: 'Nurture with content' },
      { name: 'Warm', min: 11, max: 30, action: 'Send targeted offers' },
      { name: 'Hot', min: 31, max: 60, action: 'Trigger sales sequence' },
      { name: 'Ready to Buy', min: 61, max: 999, action: 'Personal outreach + discount' },
    ]
  },

  // ── AI Content Generation Prompts ──────────────────────
  aiPrompts: {
    instagram_caption: 'Write an Instagram caption for a London travel post about {topic}. Include 3-5 relevant hashtags. Tone: excited, insider knowledge, slightly cheeky British humour. Max 150 words. End with a CTA to check the link in bio.',
    tiktok_script: 'Write a TikTok script (30 seconds) about {topic} in London. Hook must grab attention in first 2 seconds. Conversational, Gen-Z friendly tone. Include text overlay suggestions. End with CTA.',
    email_subject: 'Generate 5 email subject line variants for a campaign about {topic}. Mix curiosity, urgency, personalisation, and benefit-driven approaches. Max 50 characters each.',
    sms_message: 'Write a promotional SMS (max 160 characters) about {topic}. Include a clear CTA and sense of urgency. Must feel personal, not spammy.',
    blog_outline: 'Create a detailed blog post outline about {topic} for London travellers. Include H2 headings, key points, internal link opportunities, and SEO keywords to target.',
  },

  // ── Performance Metrics ────────────────────────────────
  _getMetrics() {
    const stored = this._getData();
    return stored.metrics || {
      email: { sent: 0, opened: 0, clicked: 0, converted: 0, unsubscribed: 0 },
      sms: { sent: 0, delivered: 0, clicked: 0, optedOut: 0 },
      social: { instagram: { posts: 0, reach: 0, engagement: 0, followers: 0 }, tiktok: { posts: 0, views: 0, followers: 0 }, x: { posts: 0, impressions: 0, followers: 0 } },
      leads: { total: 0, cold: 0, warm: 0, hot: 0, readyToBuy: 0 },
      revenue: { thisMonth: 0, lastMonth: 0, lifetime: 0 },
    };
  },

  // ── Score a lead ───────────────────────────────────────
  scoreLead(action) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('marketing-engine')) return;
    const points = this.leadScoring.actions[action] || 0;
    if (!points) return;

    const data = this._getData();
    data.leadScore = (data.leadScore || 0) + points;
    data.leadHistory = data.leadHistory || [];
    data.leadHistory.push({ action, points, date: new Date().toISOString() });
    this._save(data);

    // Check if tier changed
    const tier = this.getLeadTier(data.leadScore);
    const prevTier = data.lastTier || 'Cold';
    if (tier.name !== prevTier) {
      data.lastTier = tier.name;
      this._save(data);
      console.log(`[Marketing] Lead upgraded: ${prevTier} → ${tier.name} (${data.leadScore} pts)`);
    }
  },

  getLeadTier(score) {
    for (let i = this.leadScoring.tiers.length - 1; i >= 0; i--) {
      if (score >= this.leadScoring.tiers[i].min) return this.leadScoring.tiers[i];
    }
    return this.leadScoring.tiers[0];
  },

  // ── Data persistence ───────────────────────────────────
  _getData() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}'); }
    catch (e) { return {}; }
  },
  _save(data) { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); },

  // ── Auto-score on page load ────────────────────────────
  init() {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('marketing-engine')) return;
    const path = window.location.pathname;
    if (path.includes('index') || path === '/') this.scoreLead('page_view_homepage');
    if (path.includes('wizard')) this.scoreLead('page_view_wizard');
    if (path.includes('demo')) this.scoreLead('demo_viewed');

    // Track return visits
    const lastVisit = localStorage.getItem('lastVisitDate');
    const today = new Date().toDateString();
    if (lastVisit && lastVisit !== today) this.scoreLead('return_visit');
    localStorage.setItem('lastVisitDate', today);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof MarketingEngine !== 'undefined') MarketingEngine.init();
});
