// netlify/functions/auth-logout.js
// POST -> clears the session cookie.

const { clearCookie } = require('./_lib/auth');

exports.handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': clearCookie(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ok: true }),
  };
};
