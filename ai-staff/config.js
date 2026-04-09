// ai-staff/config.js — env loader for the orchestrator
// Reads .env from repo root if present. Never logs secret values.

const fs = require('fs');
const path = require('path');

function loadDotenv() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return {};
  const out = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    out[m[1]] = val;
  }
  return out;
}

const env = { ...loadDotenv(), ...process.env };

function required(key) {
  if (!env[key]) {
    throw new Error(`Missing required env var: ${key}. Copy .env.example to .env and fill it in.`);
  }
  return env[key];
}

function optional(key, fallback = '') {
  return env[key] || fallback;
}

const config = {
  anthropic: {
    apiKey: () => required('ANTHROPIC_API_KEY'),
    apiUrl: 'https://api.anthropic.com/v1/messages',
    version: '2023-06-01',
  },
  ghl: {
    apiKey: () => optional('GHL_API_KEY'),
    locationId: () => optional('GHL_LOCATION_ID'),
    pipelineId: () => optional('GHL_PIPELINE_ID'),
    calendarId: () => optional('GHL_CALENDAR_ID'),
    webhooks: {
      itineraryPurchase: () => optional('GHL_WEBHOOK_ITINERARY_PURCHASE'),
      contactForm: () => optional('GHL_WEBHOOK_CONTACT_FORM'),
      emailCapture: () => optional('GHL_WEBHOOK_EMAIL_CAPTURE'),
      newsletter: () => optional('GHL_WEBHOOK_NEWSLETTER'),
    },
    isConfigured() {
      return !!(env.GHL_API_KEY && env.GHL_LOCATION_ID);
    },
  },
  manifest: {
    links: {
      tier1: () => optional('MANIFEST_LINK_TIER1'),
      tier2: () => optional('MANIFEST_LINK_TIER2'),
      tier3: () => optional('MANIFEST_LINK_TIER3'),
      ukShort: () => optional('MANIFEST_LINK_UK_SHORT'),
      ukStandard: () => optional('MANIFEST_LINK_UK_STANDARD'),
      ukExtended: () => optional('MANIFEST_LINK_UK_EXTENDED'),
    },
    isConfigured() {
      return !!env.MANIFEST_LINK_TIER1;
    },
  },
  // Safe-to-log status (no secret values)
  status() {
    return {
      anthropic: !!env.ANTHROPIC_API_KEY,
      ghl: this.ghl.isConfigured(),
      manifest: this.manifest.isConfigured(),
      weather: !!env.OPENWEATHERMAP_API_KEY,
      ga: !!env.GOOGLE_ANALYTICS_ID,
    };
  },
};

module.exports = config;
