// netlify/functions/get-itinerary.js
// Fetches a stored itinerary by token (token = GHL contact id).
// Called from /itinerary.html when loaded with ?token=XXX.

const CF = {
  itinerary_json:          'dvoyCjqRjmNC2OC3kTxJ',
  customer_tier:           '4baZQrLPAPdlNicz6SHQ',
  itinerary_generated_at:  'ZRXpzsXdCHoi1ziLIHOW',
};

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

async function ghlFetch(path) {
  const token = process.env.GHL_PRIVATE_TOKEN;
  if (!token) throw new Error('GHL_PRIVATE_TOKEN not set');
  const res = await fetch(`${GHL_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_VERSION,
      Accept: 'application/json',
    },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    const msg = json.message || json.error || `HTTP ${res.status}`;
    throw new Error(`GHL ${path} → ${msg}`);
  }
  return json;
}

exports.handler = async (event) => {
  const cors = {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type',
  };
  const token = event.queryStringParameters?.token;
  if (!token) {
    return {
      statusCode: 400,
      headers: { ...cors, 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'token required' }),
    };
  }

  try {
    const res = await ghlFetch(`/contacts/${encodeURIComponent(token)}`);
    const contact = res.contact || res;
    const fields = contact.customFields || [];
    const find = id => fields.find(f => f.id === id)?.value;

    const itineraryStr = find(CF.itinerary_json);
    if (!itineraryStr) {
      return {
        statusCode: 404,
        headers: { ...cors, 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'no itinerary stored for this token' }),
      };
    }

    let itinerary;
    try {
      itinerary = JSON.parse(itineraryStr);
    } catch {
      return {
        statusCode: 500,
        headers: { ...cors, 'content-type': 'application/json' },
        body: JSON.stringify({ error: 'stored itinerary is not valid JSON' }),
      };
    }

    const tier = find(CF.customer_tier);
    const generatedAt = find(CF.itinerary_generated_at);
    const hasPaidTag = (contact.tags || []).includes('customer');

    return {
      statusCode: 200,
      headers: {
        ...cors,
        'content-type': 'application/json',
        'cache-control': 'private, max-age=60',
      },
      body: JSON.stringify({
        ok: true,
        itinerary,
        meta: {
          tier,
          generatedAt,
          paid: hasPaidTag,
          firstName: contact.firstName || '',
          email: contact.email || '',
        },
      }),
    };
  } catch (e) {
    console.error('get-itinerary error:', e);
    return {
      statusCode: 500,
      headers: { ...cors, 'content-type': 'application/json' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
