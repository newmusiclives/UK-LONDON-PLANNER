// netlify/functions/auth-me.js
// GET -> { user } if session valid, 401 otherwise.

const { requireSession } = require('./_lib/auth');

exports.handler = async (event) => {
  const guard = requireSession(event);
  if (!guard.ok) return guard.response;

  const { uid, email, name, role } = guard.session;
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: { id: uid, email, name, role } }),
  };
};
