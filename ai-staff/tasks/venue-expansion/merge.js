#!/usr/bin/env node
// Merge all new-<file>*.json files into data/<file>.json, de-duping by id.
const fs = require('fs');
const path = require('path');

const name = process.argv[2];
if (!name) { console.error('usage: merge.js <file>'); process.exit(1); }

const target = path.join(__dirname, '..', '..', '..', 'data', name + '.json');
const dir = __dirname;
const incomingFiles = fs.readdirSync(dir)
  .filter(f => f.startsWith('new-' + name) && f.endsWith('.json'))
  .sort();

const existing = JSON.parse(fs.readFileSync(target, 'utf8'));
const ids = new Set(existing.map(x => x.id));
const skipped = [];
const added = [];

for (const f of incomingFiles) {
  const arr = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  for (const item of arr) {
    if (!item.id) { skipped.push('MISSING_ID:' + JSON.stringify(item).slice(0,80)); continue; }
    if (ids.has(item.id)) { skipped.push('DUPLICATE:' + item.id); continue; }
    ids.add(item.id);
    added.push(item);
  }
}

const merged = existing.concat(added);
fs.writeFileSync(target, JSON.stringify(merged, null, 2) + '\n');

console.log(`${name}: files=${incomingFiles.length} existing=${existing.length} added=${added.length} skipped=${skipped.length} total=${merged.length}`);
if (skipped.length) console.log('  skipped:\n   ' + skipped.join('\n   '));
