#!/usr/bin/env node
// Option 2 — bulk search-URL patch for unlinked venues.
// Fills `affiliateUrl` with a provider search URL so every venue has at
// least a fallback booking path. AffiliateLinks.build() (in js/config.js)
// will still append the user's partner ID + UTM tags at render time.
//
// Rules:
//   restaurants.json  -> OpenTable London search
//   attractions.json  -> GetYourGuide search
//   hidden-london     -> GetYourGuide search (works for experiences, tours)
//   musical-london    -> GetYourGuide search (experiences/tours; venues
//                         that are purely tickets may not have GYG listings
//                         but search fallback still earns on side bookings)
//   nightlife.json    -> skipped (pubs/bars don't typically have affiliate
//                         booking platforms)
//   cafes.json        -> skipped (same reason)
//
// Usage: node affiliate-patch.js [--preview] [--apply]
//   --preview : print 20 sample outputs per file and exit (default)
//   --apply   : write changes to disk

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', '..', 'data');

const PROVIDERS = {
  restaurants: {
    template: (name) => `https://www.opentable.co.uk/s?term=${encodeURIComponent(name + ' London')}&covers=2`,
    label: 'Reserve via OpenTable'
  },
  attractions: {
    template: (name) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(name + ' London')}`,
    label: 'Book via GetYourGuide'
  },
  'hidden-london': {
    template: (name) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(name + ' London')}`,
    label: 'Find Tours & Tickets'
  },
  'musical-london': {
    template: (name) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(name + ' London')}`,
    label: 'Book Music Experiences'
  }
};

const argv = process.argv.slice(2);
const apply = argv.includes('--apply');
const preview = !apply || argv.includes('--preview');

let totalPatched = 0;
const previewBucket = {};

for (const [file, provider] of Object.entries(PROVIDERS)) {
  const filePath = path.join(DATA_DIR, file + '.json');
  const arr = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  let patched = 0;
  const previews = [];
  for (const item of arr) {
    if (item.affiliateUrl) continue;                // already has a link
    if (!item.name) continue;

    const url = provider.template(item.name);
    if (apply) {
      item.affiliateUrl = url;
      item.affiliateLabel = provider.label;
    }
    patched++;
    if (previews.length < 5) previews.push({ name: item.name, url });
  }

  previewBucket[file] = { patched, total: arr.length, samples: previews };
  totalPatched += patched;

  if (apply) {
    fs.writeFileSync(filePath, JSON.stringify(arr, null, 2) + '\n');
  }
}

console.log(apply ? '=== APPLIED ===' : '=== PREVIEW (no changes written) ===');
for (const [file, info] of Object.entries(previewBucket)) {
  console.log(`\n${file}: ${info.patched} / ${info.total} need a link`);
  for (const s of info.samples) console.log(`  ${s.name.padEnd(40)} -> ${s.url}`);
}
console.log(`\nTotal venues to patch: ${totalPatched}`);
if (!apply) console.log('\nRun with --apply to write changes.');
