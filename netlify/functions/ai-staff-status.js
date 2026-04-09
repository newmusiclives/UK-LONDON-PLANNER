// netlify/functions/ai-staff-status.js
// Read-only status endpoint for the admin panel.
// Reports which env vars are configured WITHOUT exposing values.

exports.handler = async () => {
  const env = process.env;
  const status = {
    anthropic: !!env.ANTHROPIC_API_KEY,
    ghl: !!(env.GHL_API_KEY && env.GHL_LOCATION_ID),
    manifest: !!env.MANIFEST_LINK_TIER1,
    weather: !!env.OPENWEATHERMAP_API_KEY,
    ga: !!env.GOOGLE_ANALYTICS_ID,
    timestamp: new Date().toISOString(),
  };
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify(status),
  };
};
