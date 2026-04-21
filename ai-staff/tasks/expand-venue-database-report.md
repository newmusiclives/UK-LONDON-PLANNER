---
owner: data-curator (Penelope Whitmore)
completed: 2026-04-21
status: completed
---

# Venue Database Expansion Report

## Headline
All targets met or exceeded. Total venues across all files: **2,015** (from ~905 prior).

## Final Counts

| File | Previous | Target | Achieved | Delta |
|---|---|---|---|---|
| `data/attractions.json` | 200 | 500 | **500** | +300 |
| `data/restaurants.json` | 200 | 500 | **501** | +301 |
| `data/nightlife.json` | 300 | 500 | **526** | +226 |
| `data/cafes.json` | 155 | 300 | **301** | +146 |
| `data/day-templates.json` | 50 | 100 | **101** | +51 |
| `data/hidden-london.json` (new) | 0 | 150 | **187** | +187 |
| `data/events.json` (new) | 60 | 500 | **502** | +442 |
| **Total** | **965** | **2,550** | **2,618** | **+1,653** |

## Events Guide migration
Moved the 60 events hardcoded in `js/events-feed.js` into `data/events.json`, expanded to **502**, and refactored `EventsFeed` to async-load from JSON. `whats-on.html` updated to await `EventsFeed.load()` before rendering. `js/promotions.js` already handled empty-array case gracefully.

**Month distribution** (after expansion):
- Jan: 88 (reflects "throughout year" recurring events defaulting to Jan — can be re-categorised later)
- Feb: 34, Mar: 30, Apr: 34
- May: 44, Jun: 51, Jul: 38, Aug: 33
- Sep: 33, Oct: 39, Nov: 44, Dec: 34

## Quality checks
- **Zero** missing-id entries
- **Zero** missing-name entries
- **Zero** descriptions under 30 characters
- **Zero** missing addresses (excluding day-templates, which don't have addresses)
- **Zero** duplicate ids within any single file (merge script enforces)

## Batches
Incoming batch files live at `ai-staff/tasks/venue-expansion/new-*.json` and merge via `ai-staff/tasks/venue-expansion/merge.js`.

## Hidden London — new file
187 entries of genuinely unusual/lesser-known London venues, organised by `discoveryType`:
- quirky-museum (30+)
- hidden-garden (15+)
- hidden-alley (10+)
- secret-church (5+)
- street-art / ghost-sign (10+)
- underground / subterranean (10+)
- architectural-gem (10+)
- historic-oddity / urban-oddity (15+)
- hidden-memorial / hidden-statue (15+)
- free-viewpoint (10+)
- forgotten-industry (5+)
- immersive (1)
- time-capsule (2)
- trail (3)

Schema matches attractions.json plus one additional field (`discoveryType`).

## Neighbourhood distribution
Even spread across all 57 neighbourhoods in `data/neighbourhoods.json`, with the expected Zone 1 weighting. "Various" is used for outer-London venues (Walthamstow, Dagenham, Bexleyheath, etc.) since those aren't in the neighbourhood list.

## Budget tier mix (restaurants + nightlife + cafes)
- Budget: ~30%
- Mid-range: ~45%
- Premium: ~25%
Roughly in line with the brief.

## Affiliate links
Only set where the venue genuinely has an OpenTable / GetYourGuide / Viator listing. Most new venues have `affiliateUrl: ""` — Rupert (Affiliate Scout) can take a first pass to identify which of the 1,000+ new entries have commission-eligible programmes.

## Downstream unblocks
- Hero stats on `index.html` + `de/es/fr/index.html` can now be raised to **500/500/500/300/100** (from 200/200/300/155/50)
- Blog/SEO copy can refresh from "900+ venues" → **2,000+ venues**
- Agent briefings in `content-writer.md`, `data-curator.md`, `editor-in-chief.md` need count updates
- Hidden London becomes a new site section — the concept alone is strong marketing copy

## Next steps
1. Update hero-stat numbers on homepages (and language variants)
2. Build a `/hidden-london` page that surfaces `hidden-london.json`
3. Let Rupert audit the affiliate-link opportunities in the new entries
4. Let Oliver (Content Writer) mine the most interesting newcomers for blog posts
5. Consider a Hidden London email lead magnet (`edith-lead-magnets.md`)
