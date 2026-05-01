// netlify/functions/_lib/listings.js
// Shared helpers for loading, sorting, and filtering venue listings.
// Bundled JSON imports — esbuild inlines the data into each function bundle.

const attractions = require('../../../data/attractions.json');
const restaurants = require('../../../data/restaurants.json');
const cafes = require('../../../data/cafes.json');
const nightlife = require('../../../data/nightlife.json');
const entertainment = require('../../../data/entertainment.json');
const hiddenLondon = require('../../../data/hidden-london.json');
const hotels = require('../../../data/hotels.json');
const musicalLondon = require('../../../data/musical-london.json');

const CATEGORIES = {
  attractions: { items: attractions, file: 'data/attractions.json' },
  restaurants: { items: restaurants, file: 'data/restaurants.json' },
  cafes: { items: cafes, file: 'data/cafes.json' },
  nightlife: { items: nightlife, file: 'data/nightlife.json' },
  entertainment: { items: entertainment, file: 'data/entertainment.json' },
  'hidden-london': { items: hiddenLondon, file: 'data/hidden-london.json' },
  hotels: { items: hotels, file: 'data/hotels.json' },
  'musical-london': { items: musicalLondon, file: 'data/musical-london.json' },
};

// Status priority — higher = more urgent in review queue.
const STATUS_PRIORITY = {
  'not-found': 5,
  'needs-review': 4,
  'closed': 4,
  unverified: 3,
  drift: 4, // future: when an automated re-check detects drift
  'auto-verified': 1,
  'manually-verified': 0,
  null: 3,
  undefined: 3,
};

function priorityScore(item) {
  const status = item.verification?.status ?? 'unverified';
  return STATUS_PRIORITY[status] ?? 2;
}

// Returns Date.now() for sort math. Null lastChecked sorts oldest (highest priority).
function lastCheckedTs(item) {
  const lc = item.verification?.lastChecked;
  if (!lc) return 0;
  const t = Date.parse(lc);
  return Number.isFinite(t) ? t : 0;
}

function summarise(item, category) {
  return {
    category,
    id: item.id,
    name: item.name,
    neighbourhood: item.neighbourhood || null,
    address: item.address || null,
    estimatedCost: item.estimatedCost || null,
    affiliateUrl: item.affiliateUrl || null,
    verification: item.verification || null,
  };
}

// Returns { total, filtered, items } where items is summarised.
function listListings({ category, status, search, limit = 50, offset = 0 } = {}) {
  let pool = [];
  let total = 0;

  if (category && category !== 'all') {
    if (!CATEGORIES[category]) {
      throw new Error(`Unknown category: ${category}`);
    }
    pool = CATEGORIES[category].items.map((item) => ({ item, category }));
    total = pool.length;
  } else {
    for (const [cat, { items }] of Object.entries(CATEGORIES)) {
      total += items.length;
      for (const item of items) pool.push({ item, category: cat });
    }
  }

  const statusList = status ? status.split(',').map((s) => s.trim()) : null;
  const searchLower = search ? search.toLowerCase().trim() : null;

  let filtered = pool;
  if (statusList && statusList.length > 0) {
    filtered = filtered.filter(({ item }) => {
      const s = item.verification?.status ?? 'unverified';
      return statusList.includes(s);
    });
  }
  if (searchLower) {
    filtered = filtered.filter(({ item }) => {
      return (
        (item.name && item.name.toLowerCase().includes(searchLower)) ||
        (item.neighbourhood && item.neighbourhood.toLowerCase().includes(searchLower)) ||
        (item.address && item.address.toLowerCase().includes(searchLower))
      );
    });
  }

  // Sort: priority desc, then lastChecked asc (null first), then name asc.
  filtered.sort((a, b) => {
    const pa = priorityScore(a.item);
    const pb = priorityScore(b.item);
    if (pa !== pb) return pb - pa;
    const ta = lastCheckedTs(a.item);
    const tb = lastCheckedTs(b.item);
    if (ta !== tb) return ta - tb;
    return a.item.name.localeCompare(b.item.name);
  });

  const filteredCount = filtered.length;
  const page = filtered.slice(offset, offset + limit);

  return {
    total,
    filtered: filteredCount,
    limit,
    offset,
    items: page.map(({ item, category: cat }) => summarise(item, cat)),
  };
}

function categoryStats() {
  const out = {};
  let totals = { total: 0, byStatus: {} };
  for (const [cat, { items }] of Object.entries(CATEGORIES)) {
    const byStatus = {};
    for (const item of items) {
      const s = item.verification?.status ?? 'unverified';
      byStatus[s] = (byStatus[s] || 0) + 1;
      totals.byStatus[s] = (totals.byStatus[s] || 0) + 1;
    }
    out[cat] = { total: items.length, byStatus };
    totals.total += items.length;
  }
  return { categories: out, totals };
}

module.exports = {
  CATEGORIES,
  listListings,
  categoryStats,
  priorityScore,
  lastCheckedTs,
};
