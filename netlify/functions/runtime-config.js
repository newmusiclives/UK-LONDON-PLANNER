// netlify/functions/runtime-config.js
// Serves environment-driven config to the frontend.
// Only exposes PUBLIC identifiers — never API keys or secrets.

exports.handler = async () => {
  const env = process.env;
  const config = {
    ga: env.GOOGLE_ANALYTICS_ID || '',
    stripe: {
      tier1: env.STRIPE_LINK_TIER1 || '',
      tier2: env.STRIPE_LINK_TIER2 || '',
      tier3: env.STRIPE_LINK_TIER3 || '',
      ukShort: env.STRIPE_LINK_UK_SHORT || '',
      ukStandard: env.STRIPE_LINK_UK_STANDARD || '',
      ukExtended: env.STRIPE_LINK_UK_EXTENDED || '',
    },
    ghl: {
      configured: !!(env.GHL_API_KEY && env.GHL_LOCATION_ID),
      webhooks: {
        itineraryPurchase: env.GHL_WEBHOOK_ITINERARY_PURCHASE || '',
        contactForm: env.GHL_WEBHOOK_CONTACT_FORM || '',
        emailCapture: env.GHL_WEBHOOK_EMAIL_CAPTURE || '',
        promotionsNewsletter: env.GHL_WEBHOOK_NEWSLETTER || '',
        waitlist: env.GHL_WEBHOOK_WAITLIST || '',
        giftPurchase: env.GHL_WEBHOOK_GIFT || '',
        partnerLead: env.GHL_WEBHOOK_PARTNER || '',
        ugcSubmission: env.GHL_WEBHOOK_UGC || '',
      },
    },
    affiliates: {
      getYourGuide: env.AFFILIATE_GETYOURGUIDE || '',
      booking: env.AFFILIATE_BOOKING || '',
      viator: env.AFFILIATE_VIATOR || '',
      todayTix: env.AFFILIATE_TODAYTIX || '',
      openTable: env.AFFILIATE_OPENTABLE || '',
      klook: env.AFFILIATE_KLOOK || '',
      tiqets: env.AFFILIATE_TIQETS || '',
      goCity: env.AFFILIATE_GOCITY || '',
      trainline: env.AFFILIATE_TRAINLINE || '',
      expedia: env.AFFILIATE_EXPEDIA || '',
      hostelworld: env.AFFILIATE_HOSTELWORLD || '',
      skyscanner: env.AFFILIATE_SKYSCANNER || '',
      amazonUK: env.AFFILIATE_AMAZON_UK || '',
      tripadvisor: env.AFFILIATE_TRIPADVISOR || '',
      musement: env.AFFILIATE_MUSEMENT || '',
      headout: env.AFFILIATE_HEADOUT || '',
      eurostar: env.AFFILIATE_EUROSTAR || '',
      omio: env.AFFILIATE_OMIO || '',
      rentalcars: env.AFFILIATE_RENTALCARS || '',
      theFork: env.AFFILIATE_THEFORK || '',
      londonTheatreDirect: env.AFFILIATE_LTD || '',
      worldNomads: env.AFFILIATE_WORLDNOMADS || '',
      safetyWing: env.AFFILIATE_SAFETYWING || '',
      wise: env.AFFILIATE_WISE || '',
      revolut: env.AFFILIATE_REVOLUT || '',
      airalo: env.AFFILIATE_AIRALO || '',
      withLocals: env.AFFILIATE_WITHLOCALS || '',
      toursByLocals: env.AFFILIATE_TOURSBYLOCALS || '',
      contextTravel: env.AFFILIATE_CONTEXTTRAVEL || '',
    },
    trustpilot: env.TRUSTPILOT_BUSINESS_URL || '',
    googleReview: env.GOOGLE_REVIEW_URL || '',
  };
  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=300',
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify(config),
  };
};
