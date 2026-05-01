// netlify/functions/listings-list.js
// GET /.netlify/functions/listings-list?category=&status=&search=&limit=&offset=
// Auth: requires valid session cookie.
// Returns the review queue, sorted by priority + oldest-first.

const { requireSession } = require('./_lib/auth');
const { listListings, categoryStats } = require('./_lib/listings');

exports.handler = async (event) => {
  const guard = requireSession(event);
  if (!guard.ok) return guard.response;

  const params = event.queryStringParameters || {};

  // ?stats=1 returns just the per-category counts (cheap).
  if (params.stats === '1') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryStats()),
    };
  }

  let limit = parseInt(params.limit || '50', 10);
  let offset = parseInt(params.offset || '0', 10);
  if (!Number.isFinite(limit) || limit < 1) limit = 50;
  if (limit > 200) limit = 200;
  if (!Number.isFinite(offset) || offset < 0) offset = 0;

  try {
    const result = listListings({
      category: params.category || null,
      status: params.status || null,
      search: params.search || null,
      limit,
      offset,
    });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
