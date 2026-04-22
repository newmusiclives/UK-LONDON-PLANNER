// netlify/functions/submit-itinerary.js
// Accepts a wizard-generated itinerary and stashes it against a GHL contact.
// Returns an access token (the contact id) the browser uses to redirect to
// /itinerary.html?token=XXX, where the itinerary renders from get-itinerary.
//
// Body shape:
//   {
//     email:       "required",
//     firstName:   "optional",
//     lastName:    "optional",
//     tier:        "tier1|tier2|tier3|uk-short|uk-standard|uk-extended" (optional),
//     shareCode:   "LP-XXXXXX" (optional, from referral attribution),
//     referredBy:  "LP-YYYYYY" (optional),
//     itinerary:   { ... the full engine output ... }
//   }

const CF = {
  itinerary_token:         'PgIMdemlczfi9LeySgok',
  itinerary_json:          'dvoyCjqRjmNC2OC3kTxJ',
  customer_tier:           '4baZQrLPAPdlNicz6SHQ',
  itinerary_generated_at:  'ZRXpzsXdCHoi1ziLIHOW',
  share_code:              'ukupWGIJx3n1ybxF1qTL',
  referred_by:             'YwIdytd5P2egBrH3UUil',
};

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

async function ghlFetch(path, opts = {}) {
  const token = process.env.GHL_PRIVATE_TOKEN;
  if (!token) throw new Error('GHL_PRIVATE_TOKEN not set');
  const res = await fetch(`${GHL_BASE}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_VERSION,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
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
    'access-control-allow-methods': 'POST, OPTIONS',
  };
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: 'POST only' };

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'invalid JSON body' }) };
  }

  const { email, firstName, lastName, tier, shareCode, referredBy, itinerary } = payload;
  if (!email) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'email required' }) };
  if (!itinerary || typeof itinerary !== 'object') {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'itinerary object required' }) };
  }

  const locationId = process.env.GHL_LOCATION_ID;
  if (!locationId) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: 'GHL_LOCATION_ID not set' }) };

  try {
    // 1. Upsert contact
    const itineraryJsonStr = JSON.stringify(itinerary);
    const generatedAt = new Date().toISOString();

    const customFields = [
      { id: CF.itinerary_json,         value: itineraryJsonStr },
      { id: CF.customer_tier,          value: tier || 'tier1' },
      { id: CF.itinerary_generated_at, value: generatedAt },
    ];
    if (shareCode)  customFields.push({ id: CF.share_code,  value: shareCode });
    if (referredBy) customFields.push({ id: CF.referred_by, value: referredBy });

    const upsertBody = {
      locationId,
      email,
      firstName: firstName || '',
      lastName:  lastName  || '',
      tags: ['wizard-complete', 'itinerary-pending-purchase', 'london-planned'],
      customFields,
    };

    const upsertRes = await ghlFetch('/contacts/upsert', {
      method: 'POST',
      body: JSON.stringify(upsertBody),
    });

    const contactId = upsertRes.contact?.id || upsertRes.id;
    if (!contactId) throw new Error('upsert returned no contact id');

    // 2. Write the contact id back as the itinerary_token so the value
    //    is also visible on the contact's record in GHL.
    await ghlFetch(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify({
        customFields: [{ id: CF.itinerary_token, value: contactId }],
      }),
    });

    return {
      statusCode: 200,
      headers: { ...cors, 'content-type': 'application/json' },
      body: JSON.stringify({ ok: true, token: contactId }),
    };
  } catch (e) {
    console.error('submit-itinerary error:', e);
    return {
      statusCode: 500,
      headers: { ...cors, 'content-type': 'application/json' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
