#!/usr/bin/env node
// scripts/migrate-add-verification.js
// Phase 0 of the listings-verification project: add a `verification` metadata
// block to every venue listing. Idempotent — re-runs leave existing
// verification blocks untouched.
//
// Usage:
//   node scripts/migrate-add-verification.js          # apply
//   node scripts/migrate-add-verification.js --check  # report-only

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const DATA_DIR = path.join(REPO, 'data');

// Files that contain venue-style listings with a real-world address.
// Excludes events.json (time-bound, separate concern), neighbourhoods/
// uk-destinations/day-trips (no per-venue addresses), demo-itinerary
// (sample data), promotions-content (content blocks).
const VENUE_FILES = [
  'attractions.json',
  'restaurants.json',
  'cafes.json',
  'nightlife.json',
  'entertainment.json',
  'hidden-london.json',
  'hotels.json',
  'musical-london.json',
];

function defaultVerification() {
  return {
    placeId: null,
    phone: null,
    coordinates: null,
    status: 'unverified',
    businessStatus: null,
    lastChecked: null,
    lastCheckedBy: null,
    hoursSnapshot: null,
    priceSnapshot: null,
    notes: null,
  };
}

const checkOnly = process.argv.includes('--check');

let totalItems = 0;
let totalAdded = 0;
let totalAlready = 0;

for (const file of VENUE_FILES) {
  const fullPath = path.join(DATA_DIR, file);
  const items = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  let added = 0;
  let already = 0;

  for (const item of items) {
    if (item.verification) {
      already++;
    } else {
      item.verification = defaultVerification();
      added++;
    }
  }

  totalItems += items.length;
  totalAdded += added;
  totalAlready += already;

  console.log(`${file}: ${items.length} items — ${added} added, ${already} already had verification`);

  if (!checkOnly && added > 0) {
    fs.writeFileSync(fullPath, JSON.stringify(items, null, 2) + '\n');
  }
}

console.log('---');
console.log(`Total: ${totalItems} items across ${VENUE_FILES.length} files`);
console.log(`Added verification block to: ${totalAdded}`);
console.log(`Already had verification: ${totalAlready}`);
console.log(checkOnly ? '(check-only mode — no files written)' : '(files updated)');
