#!/usr/bin/env node
// scripts/backfill-places.js
// Phase 1 of the listings-verification project: backfill Google Places API
// data into every venue's verification block. Resumable — items already with
// a placeId are skipped, so re-running is safe and cheap.
//
// Uses the Places API (New) v1 endpoints (places.googleapis.com).
// Required: GOOGLE_PLACES_API_KEY env var.
//
// Usage:
//   node scripts/backfill-places.js                  # backfill all unresolved
//   node scripts/backfill-places.js --file=cafes.json # one file only
//   node scripts/backfill-places.js --limit=50       # cap calls per run
//   node scripts/backfill-places.js --dry-run        # estimate cost, no calls

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const DATA_DIR = path.join(REPO, 'data');

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

// Places API (New) pricing — for cost estimates only.
// Text Search Essentials: $32/1000 ($0.032/call)
// Place Details Essentials + Pro (status, hours, price, contact): ~$25/1000 ($0.025/call)
const COST_TEXT_SEARCH = 0.032;
const COST_PLACE_DETAILS = 0.025;

// Detail fields we want from each resolved place.
const DETAIL_FIELDS = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'businessStatus',
  'currentOpeningHours',
  'regularOpeningHours',
  'priceLevel',
  'nationalPhoneNumber',
  'internationalPhoneNumber',
  'websiteUri',
].join(',');

function parseArgs() {
  const args = { file: null, limit: Infinity, dryRun: false };
  for (const arg of process.argv.slice(2)) {
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg.startsWith('--file=')) args.file = arg.slice(7);
    else if (arg.startsWith('--limit=')) args.limit = parseInt(arg.slice(8), 10);
  }
  return args;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function findPlace(query, apiKey) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress',
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 1, regionCode: 'GB' }),
  });
  if (!res.ok) throw new Error(`searchText ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.places && data.places[0] ? data.places[0] : null;
}

async function placeDetails(placeId, apiKey) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': DETAIL_FIELDS,
    },
  });
  if (!res.ok) throw new Error(`placeDetails ${res.status}: ${await res.text()}`);
  return res.json();
}

function applyDetails(item, details, foundResult) {
  const v = item.verification;
  v.placeId = details.id;
  v.phone = details.nationalPhoneNumber || details.internationalPhoneNumber || null;
  v.coordinates = details.location
    ? { lat: details.location.latitude, lng: details.location.longitude }
    : null;
  v.businessStatus = details.businessStatus || null;
  v.hoursSnapshot = (details.currentOpeningHours || details.regularOpeningHours) || null;
  v.priceSnapshot = details.priceLevel || null;
  v.lastChecked = new Date().toISOString();
  v.lastCheckedBy = 'backfill-places.js';
  // Heuristic: if name match is fuzzy, mark for human review rather than auto-verified.
  const stored = item.name.toLowerCase().trim();
  const found = (foundResult.displayName?.text || '').toLowerCase().trim();
  const looseMatch = found.includes(stored) || stored.includes(found);
  v.status = looseMatch ? 'auto-verified' : 'needs-review';
  if (!looseMatch) {
    v.notes = `Name mismatch: stored "${item.name}" vs Places "${foundResult.displayName?.text}"`;
  }
}

async function backfillFile(file, apiKey, args, totals) {
  const fullPath = path.join(DATA_DIR, file);
  const items = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  let resolved = 0;
  let unresolved = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of items) {
    if (totals.calls >= args.limit) break;
    if (item.verification?.placeId) {
      skipped++;
      continue;
    }
    if (!item.address) {
      unresolved++;
      continue;
    }

    const query = `${item.name}, ${item.address}`;
    if (args.dryRun) {
      totals.calls += 2; // search + details
      totals.cost += COST_TEXT_SEARCH + COST_PLACE_DETAILS;
      continue;
    }

    try {
      const found = await findPlace(query, apiKey);
      totals.calls++;
      totals.cost += COST_TEXT_SEARCH;
      if (!found) {
        item.verification.status = 'not-found';
        item.verification.lastChecked = new Date().toISOString();
        item.verification.lastCheckedBy = 'backfill-places.js';
        item.verification.notes = `No Places match for query: ${query}`;
        unresolved++;
        continue;
      }
      await sleep(50); // gentle rate-limit between calls
      const details = await placeDetails(found.id, apiKey);
      totals.calls++;
      totals.cost += COST_PLACE_DETAILS;
      applyDetails(item, details, found);
      resolved++;
      await sleep(50);
    } catch (err) {
      console.error(`  ERROR on "${item.name}": ${err.message}`);
      errors++;
      // Persist progress on error so we don't lose what we've done
      fs.writeFileSync(fullPath, JSON.stringify(items, null, 2) + '\n');
      // Stop on errors so the user can investigate; resuming will skip done items
      throw err;
    }
  }

  // Persist after each file in case the next one throws
  if (!args.dryRun && (resolved > 0 || unresolved > 0)) {
    fs.writeFileSync(fullPath, JSON.stringify(items, null, 2) + '\n');
  }

  console.log(
    `${file}: resolved=${resolved}, unresolved=${unresolved}, skipped=${skipped}, errors=${errors}`,
  );
}

async function main() {
  const args = parseArgs();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey && !args.dryRun) {
    console.error('GOOGLE_PLACES_API_KEY not set. Use --dry-run for cost estimate without a key.');
    process.exit(1);
  }

  const files = args.file ? [args.file] : VENUE_FILES;
  const totals = { calls: 0, cost: 0 };

  console.log(args.dryRun ? '=== DRY RUN (no API calls) ===' : '=== BACKFILL ===');
  console.log(`Files: ${files.join(', ')}`);
  console.log(`Limit: ${args.limit === Infinity ? 'no limit' : args.limit + ' calls'}`);
  console.log('---');

  for (const file of files) {
    if (totals.calls >= args.limit) {
      console.log(`(call limit reached — stopping before ${file})`);
      break;
    }
    await backfillFile(file, apiKey, args, totals);
  }

  console.log('---');
  console.log(`Total API calls: ${totals.calls}`);
  console.log(`Estimated cost: $${totals.cost.toFixed(2)}`);
  console.log(
    args.dryRun
      ? '(no files written; re-run without --dry-run to apply)'
      : '(files updated incrementally; safe to re-run to resume)',
  );
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
