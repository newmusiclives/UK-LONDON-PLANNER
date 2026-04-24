// netlify/functions/increment-referrer.js
// Finds a contact by their share_code and bumps referral_count by 1.
// Fired from the waitlist signup flow when referredBy is present.
//
// GHL workflows can't update a *different* contact's number field, so the
// increment has to live outside the workflow. This function is called as a
// fire-and-forget side effect of waitlist submission in js/config.js.
//
// Body shape:
//   { referredBy: "LP-XXXXXX" }
//
// Response:
//   { ok: true, incremented: true,  contactId, newCount } — matched + bumped
//   { ok: true, incremented: false, reason: "not_found" } — graceful no-op
//   { error: "..." }                                      — 4xx / 5xx

const CF = {
  share_code:     'ukupWGIJx3n1ybxF1qTL',
  referral_count: '2GIsRCfOJbAcpVfna8ox',
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

function readCustomFieldValue(contact, fieldId) {
  const arr = contact.customFields || contact.custom_fields || [];
  const hit = arr.find((c) => c.id === fieldId);
  if (!hit) return null;
  return hit.value ?? hit.fieldValue ?? null;
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

  const referredBy = (payload.referredBy || '').toString().trim().toUpperCase();
  if (!/^LP-[A-Z0-9]{6}$/.test(referredBy)) {
    return {
      statusCode: 400,
      headers: { ...cors, 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'valid referredBy required (format LP-XXXXXX)' }),
    };
  }

  const locationId = process.env.GHL_LOCATION_ID;
  if (!locationId) {
    return {
      statusCode: 500,
      headers: { ...cors, 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'GHL_LOCATION_ID not set' }),
    };
  }

  try {
    // 1. Find contact by share_code custom field
    const searchRes = await ghlFetch('/contacts/search', {
      method: 'POST',
      body: JSON.stringify({
        locationId,
        pageLimit: 1,
        filters: [{
          field: `customFields.${CF.share_code}`,
          operator: 'eq',
          value: referredBy,
        }],
      }),
    });

    const contacts = searchRes.contacts || searchRes.data || [];
    if (!contacts.length) {
      return {
        statusCode: 200,
        headers: { ...cors, 'content-type': 'application/json' },
        body: JSON.stringify({ ok: true, incremented: false, reason: 'not_found' }),
      };
    }

    const referrer = contacts[0];
    const contactId = referrer.id;
    if (!contactId) throw new Error('search returned contact without id');

    // 2. Read current referral_count (may be null / undefined on first bump)
    const rawCount = readCustomFieldValue(referrer, CF.referral_count);
    const currentCount = Number(rawCount) || 0;
    const newCount = currentCount + 1;

    // 3. Write incremented value back
    await ghlFetch(`/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify({
        customFields: [{ id: CF.referral_count, value: newCount }],
      }),
    });

    return {
      statusCode: 200,
      headers: { ...cors, 'content-type': 'application/json' },
      body: JSON.stringify({ ok: true, incremented: true, contactId, newCount }),
    };
  } catch (e) {
    console.error('increment-referrer error:', e);
    return {
      statusCode: 500,
      headers: { ...cors, 'content-type': 'application/json' },
      body: JSON.stringify({ error: e.message }),
    };
  }
};
