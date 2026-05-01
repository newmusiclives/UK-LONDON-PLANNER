#!/usr/bin/env node
// scripts/hash-password.js
// Generate a scrypt password hash to drop into a Netlify env var
// (e.g. AUTH_HASH_PAUL). Reads the password from a prompt so it
// never lands in shell history.
//
// Usage:
//   node scripts/hash-password.js
//
// Output: copy the printed string into the Netlify dashboard env var.

const readline = require('readline');
const { Writable } = require('stream');

// Re-implement the hash so this script has zero coupling to the function bundle.
const crypto = require('crypto');

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

function promptHidden(question) {
  return new Promise((resolve) => {
    let muted = false;
    const out = new Writable({
      write(chunk, enc, cb) {
        if (!muted) process.stdout.write(chunk, enc);
        cb();
      },
    });
    const rl = readline.createInterface({ input: process.stdin, output: out, terminal: true });
    process.stdout.write(question);
    muted = true;
    rl.question('', (ans) => {
      muted = false;
      process.stdout.write('\n');
      rl.close();
      resolve(ans);
    });
  });
}

async function main() {
  const pw1 = await promptHidden('Enter password: ');
  if (pw1.length < 12) {
    console.error('Password must be at least 12 characters.');
    process.exit(1);
  }
  const pw2 = await promptHidden('Confirm password: ');
  if (pw1 !== pw2) {
    console.error('Passwords do not match.');
    process.exit(1);
  }

  const hash = await makePasswordHash(pw1);

  console.log('\n=== Password hash ===');
  console.log(hash);
  console.log('\nNext steps:');
  console.log('  1. Copy the hash above.');
  console.log('  2. In Netlify dashboard → Site settings → Environment variables, add:');
  console.log('     AUTH_HASH_<USERID> = <the hash>');
  console.log('     (e.g. AUTH_HASH_PAUL)');
  console.log('  3. Also set ADMIN_JWT_SECRET to a random ≥32-char string if not already set.');
  console.log('     Generate one with: openssl rand -base64 48');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
