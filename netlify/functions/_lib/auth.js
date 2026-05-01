// netlify/functions/_lib/auth.js
// Shared auth helpers: password hashing (scrypt) and session signing (HMAC).
// Uses Node built-ins only — no new dependencies.

const crypto = require('crypto');

const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours
const COOKIE_NAME = 'lp_admin_session';

function getJwtSecret() {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s || s.length < 32) {
    throw new Error('ADMIN_JWT_SECRET env var missing or too short (need ≥32 chars)');
  }
  return s;
}

// ----- Password hashing (scrypt) -----
// Stored format: "<saltBase64>$<keyBase64>"

function scryptHash(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

async function makePasswordHash(password) {
  const salt = crypto.randomBytes(16);
  const key = await scryptHash(password, salt);
  return `${salt.toString('base64')}$${key.toString('base64')}`;
}

async function verifyPassword(password, stored) {
  if (!stored || !stored.includes('$')) return false;
  const [saltB64, keyB64] = stored.split('$');
  const salt = Buffer.from(saltB64, 'base64');
  const expected = Buffer.from(keyB64, 'base64');
  const computed = await scryptHash(password, salt);
  if (computed.length !== expected.length) return false;
  return crypto.timingSafeEqual(computed, expected);
}

// ----- Session token (HMAC-signed JSON) -----
// Format: "<payloadBase64Url>.<hmacBase64Url>"

function signSession(payload) {
  const secret = getJwtSecret();
  const fullPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const b64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

function verifySession(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  const secret = getJwtSecret();
  const expectedSig = crypto.createHmac('sha256', secret).update(b64).digest('base64url');
  if (sig.length !== expectedSig.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(b64, 'base64url').toString());
  } catch {
    return null;
  }
  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

// ----- Cookie helpers -----

function sessionCookie(token) {
  const maxAge = SESSION_TTL_SECONDS;
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function clearCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function readCookie(headers) {
  const cookieHeader = headers.cookie || headers.Cookie || '';
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

// ----- Request guards -----

function requireSession(event) {
  const token = readCookie(event.headers);
  const session = verifySession(token);
  if (!session) {
    return { ok: false, response: { statusCode: 401, body: JSON.stringify({ error: 'unauthorized' }) } };
  }
  return { ok: true, session };
}

module.exports = {
  COOKIE_NAME,
  makePasswordHash,
  verifyPassword,
  signSession,
  verifySession,
  sessionCookie,
  clearCookie,
  readCookie,
  requireSession,
};
