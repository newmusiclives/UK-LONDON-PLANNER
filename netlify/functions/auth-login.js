// netlify/functions/auth-login.js
// POST { email, password } -> sets HTTP-only session cookie on success.

const users = require('./_lib/users');
const { verifyPassword, signSession, sessionCookie } = require('./_lib/auth');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'invalid json' }) };
  }

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';
  if (!email || !password) {
    return { statusCode: 400, body: JSON.stringify({ error: 'email and password required' }) };
  }

  const user = users.find((u) => u.email.toLowerCase() === email);

  // Always run the password verify to keep timing roughly constant whether
  // or not the email exists. Use a dummy hash if user not found.
  const stored = user ? process.env[user.hashEnvVar] : '';
  const dummyHash =
    'AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
  const ok = await verifyPassword(password, stored || dummyHash);

  if (!user || !ok) {
    return { statusCode: 401, body: JSON.stringify({ error: 'invalid credentials' }) };
  }

  if (!stored) {
    // User exists in registry but their hash env var isn't set on this deploy.
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `auth not configured for user (env var ${user.hashEnvVar} missing)` }),
    };
  }

  const token = signSession({ uid: user.id, email: user.email, role: user.role, name: user.name });

  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': sessionCookie(token),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ok: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } }),
  };
};
