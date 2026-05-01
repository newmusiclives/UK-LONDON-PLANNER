// netlify/functions/listings-action.js
// POST /.netlify/functions/listings-action
// Body: { category, listingId, action, payload? }
// Auth: requires valid session cookie.
// Applies a review action by mutating the relevant data/*.json file and
// committing direct to main via the GitHub Contents API.

const { requireSession } = require('./_lib/auth');
const { CATEGORIES } = require('./_lib/listings');
const { commitJsonUpdate } = require('./_lib/github-commit');

const VALID_ACTIONS = new Set(['confirm', 'mark-closed', 'flag-review', 'update-notes']);

function reviewerStamp(session) {
  return {
    lastChecked: new Date().toISOString(),
    lastCheckedBy: session.email || session.uid || 'unknown',
  };
}

function applyAction(item, action, payload, session) {
  if (!item.verification) item.verification = {};
  const v = item.verification;
  Object.assign(v, reviewerStamp(session));

  switch (action) {
    case 'confirm':
      v.status = 'manually-verified';
      // Don't clear notes — historical context.
      return { commitVerb: 'Confirm', noun: item.name };

    case 'mark-closed':
      v.status = 'closed';
      v.businessStatus = 'CLOSED_PERMANENTLY';
      if (payload?.notes) v.notes = String(payload.notes).slice(0, 500);
      return { commitVerb: 'Mark closed', noun: item.name };

    case 'flag-review':
      v.status = 'needs-review';
      if (payload?.notes) v.notes = String(payload.notes).slice(0, 500);
      else v.notes = v.notes || 'Flagged for human review';
      return { commitVerb: 'Flag for review', noun: item.name };

    case 'update-notes':
      v.notes = payload?.notes ? String(payload.notes).slice(0, 500) : null;
      return { commitVerb: 'Update notes', noun: item.name };

    default:
      throw new Error(`Unhandled action: ${action}`);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'method not allowed' }) };
  }

  const guard = requireSession(event);
  if (!guard.ok) return guard.response;
  const session = guard.session;

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid json' }) };
  }

  const { category, listingId, action, payload } = body;
  if (!category || !listingId || !action) {
    return { statusCode: 400, body: JSON.stringify({ error: 'category, listingId, action required' }) };
  }
  if (!VALID_ACTIONS.has(action)) {
    return { statusCode: 400, body: JSON.stringify({ error: `unknown action: ${action}` }) };
  }
  if (!CATEGORIES[category]) {
    return { statusCode: 400, body: JSON.stringify({ error: `unknown category: ${category}` }) };
  }

  const filePath = CATEGORIES[category].file;
  let actionMeta;

  try {
    const result = await commitJsonUpdate({
      filePath,
      transform: (items) => {
        const item = items.find((i) => i.id === listingId);
        if (!item) throw new Error(`listing not found in ${filePath}: ${listingId}`);
        actionMeta = applyAction(item, action, payload, session);
      },
      message: () => `listings: ${actionMeta.commitVerb} ${actionMeta.noun} (by ${session.email})`,
      author: { name: session.name || session.email, email: session.email },
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        changed: result.changed,
        commitSha: result.commitSha,
        commitUrl: result.commitUrl,
        action: actionMeta,
      }),
    };
  } catch (err) {
    const status = err.status === 404 ? 404 : 500;
    return {
      statusCode: status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
