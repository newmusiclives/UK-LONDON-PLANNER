#!/usr/bin/env node
// scripts/sweep-places.js
// Phase 3 of the listings-verification project: recurring re-check of every
// already-resolved listing against the current Places API data, flagging drift.
//
// Only touches items with verification.placeId set (so backfill must run first).
// Picks the staleness threshold per category — restaurants/cafes/nightlife
// volatile, so 7 days; attractions/hotels stable, so 30 days.
//
// Cost per call (Place Details only, ~$25/1000): ~$2.50 per 100 listings.
// Google's $200/mo free Places credit covers daily sweeps comfortably.
//
// Usage:
//   node scripts/sweep-places.js                    # all stale items
//   node scripts/sweep-places.js --file=cafes.json  # one file
//   node scripts/sweep-places.js --limit=50         # cap calls
//   node scripts/sweep-places.js --dry-run          # estimate without calls
//   node scripts/sweep-places.js --force            # ignore staleness threshold

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const DATA_DIR = path.join(REPO, 'data');

// Staleness threshold (days) per file. Higher volatility → shorter threshold.
const STALENESS = {
  'restaurants.json': 7,
  'cafes.json': 7,
  'nightlife.json': 7,
  'entertainment.json': 14,
  'attractions.json': 30,
  'hidden-london.json': 30,
  'hotels.json': 30,
  'musical-london.json': 14,
};

const DETAIL_FIELDS = [
  'id',
  'displayName',
  'businessStatus',
  'currentOpeningHours',
  'regularOpeningHours',
  'priceLevel',
  'nationalPhoneNumber',
  'location',
].join(',');

const COST_PLACE_DETAILS = 0.025;

function parseArgs() {
  const args = { file: null, limit: Infinity, dryRun: false, force: false };
  for (const arg of process.argv.slice(2)) {
    if (arg === '--dry-run') args.dryRun = true;
    else if (arg === '--force') args.force = true;
    else if (arg.startsWith('--file=')) args.file = arg.slice(7);
    else if (arg.startsWith('--limit=')) args.limit = parseInt(arg.slice(8), 10);
  }
  return args;
}

function isStale(item, file, force) {
  if (force) return true;
  const threshold = STALENESS[file] || 14;
  const lc = item.verification?.lastChecked;
  if (!lc) return true;
  const ageDays = (Date.now() - Date.parse(lc)) / (24 * 60 * 60 * 1000);
  return ageDays > threshold;
}

async function placeDetails(placeId, apiKey) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': DETAIL_FIELDS },
  });
  if (res.status === 404) return { gone: true };
  if (!res.ok) throw new Error(`placeDetails ${res.status}: ${await res.text()}`);
  return res.json();
}

function diffSnapshot(stored, fresh) {
  const changes = [];
  if (stored.businessStatus !== fresh.businessStatus) {
    changes.push(`businessStatus: ${stored.businessStatus} → ${fresh.businessStatus}`);
  }
  if (stored.priceSnapshot !== fresh.priceLevel) {
    changes.push(`priceLevel: ${stored.priceSnapshot} → ${fresh.priceLevel}`);
  }
  if (stored.phone && fresh.nationalPhoneNumber && stored.phone !== fresh.nationalPhoneNumber) {
    changes.push(`phone: ${stored.phone} → ${fresh.nationalPhoneNumber}`);
  }
  // Hours diff is too verbose to compare structurally; flag if either side has a value
  // and the JSON-stringified shapes differ.
  const storedHours = JSON.stringify(stored.hoursSnapshot || null);
  const freshHours = JSON.stringify(fresh.currentOpeningHours || fresh.regularOpeningHours || null);
  if (storedHours !== freshHours) changes.push('opening hours changed');
  return changes;
}

function applyFresh(item, fresh, drift) {
  const v = item.verification;
  v.businessStatus = fresh.businessStatus || null;
  v.priceSnapshot = fresh.priceLevel || null;
  v.phone = fresh.nationalPhoneNumber || v.phone || null;
  v.coordinates = fresh.location ? { lat: fresh.location.latitude, lng: fresh.location.longitude } : v.coordinates;
  v.hoursSnapshot = fresh.currentOpeningHours || fresh.regularOpeningHours || v.hoursSnapshot || null;
  v.lastChecked = new Date().toISOString();
  v.lastCheckedBy = 'sweep-places.js';

  if (fresh.businessStatus === 'CLOSED_PERMANENTLY') {
    v.status = 'closed';
    v.notes = `Closed per Places sweep (${new Date().toISOString().slice(0, 10)})`;
  } else if (drift.length > 0) {
    v.status = 'drift';
    v.notes = `Drift detected: ${drift.join('; ')}`;
  } else if (v.status === 'auto-verified' || v.status === 'manually-verified') {
    // Healthy re-check — keep status, just bump lastChecked above
  } else if (v.status === 'unverified' || !v.status) {
    v.status = 'auto-verified';
  }
}

function applyGone(item) {
  const v = item.verification;
  v.status = 'not-found';
  v.lastChecked = new Date().toISOString();
  v.lastCheckedBy = 'sweep-places.js';
  v.notes = `Place ID returned 404 from Places API — listing may have been delisted`;
}

async function sweepFile(file, apiKey, args, totals) {
  const fullPath = path.join(DATA_DIR, file);
  const items = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  let checked = 0, drifted = 0, closed = 0, gone = 0, errors = 0;

  for (const item of items) {
    if (totals.calls >= args.limit) break;
    const v = item.verification;
    if (!v?.placeId) continue;
    if (!isStale(item, file, args.force)) continue;

    if (args.dryRun) {
      totals.calls++;
      totals.cost += COST_PLACE_DETAILS;
      checked++;
      continue;
    }

    try {
      const fresh = await placeDetails(v.placeId, apiKey);
      totals.calls++;
      totals.cost += COST_PLACE_DETAILS;
      if (fresh.gone) {
        applyGone(item);
        gone++;
      } else {
        const drift = diffSnapshot(v, fresh);
        if (fresh.businessStatus === 'CLOSED_PERMANENTLY') closed++;
        else if (drift.length > 0) drifted++;
        applyFresh(item, fresh, drift);
      }
      checked++;
      // Tiny pause to be polite to the API
      await new Promise((r) => setTimeout(r, 50));
    } catch (err) {
      console.error(`  ERROR on "${item.name}" (${v.placeId}): ${err.message}`);
      errors++;
      // Persist progress and stop on errors
      fs.writeFileSync(fullPath, JSON.stringify(items, null, 2) + '\n');
      throw err;
    }
  }

  if (!args.dryRun && checked > 0) {
    fs.writeFileSync(fullPath, JSON.stringify(items, null, 2) + '\n');
  }
  console.log(`${file}: checked=${checked}, drifted=${drifted}, closed=${closed}, gone=${gone}, errors=${errors}`);
}

async function main() {
  const args = parseArgs();
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey && !args.dryRun) {
    console.error('GOOGLE_PLACES_API_KEY not set. Use --dry-run for cost estimate without a key.');
    process.exit(1);
  }

  const files = args.file ? [args.file] : Object.keys(STALENESS);
  const totals = { calls: 0, cost: 0 };

  console.log(args.dryRun ? '=== DRY RUN ===' : '=== SWEEP ===');
  console.log(`Files: ${files.join(', ')}`);
  console.log(`Limit: ${args.limit === Infinity ? 'no limit' : args.limit}`);
  console.log(`Force re-check: ${args.force}`);
  console.log('---');

  for (const file of files) {
    if (totals.calls >= args.limit) {
      console.log(`(call limit reached — stopping before ${file})`);
      break;
    }
    await sweepFile(file, apiKey, args, totals);
  }

  console.log('---');
  console.log(`Total API calls: ${totals.calls}`);
  console.log(`Estimated cost: $${totals.cost.toFixed(2)}`);
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
