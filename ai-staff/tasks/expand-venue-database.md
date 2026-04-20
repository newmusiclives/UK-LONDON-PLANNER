---
owner: data-curator (Penelope Whitmore)
priority: P0 — blocks full-site launch
created: 2026-04-20
status: queued
---

# Expand Venue Database to Support Hero-Stat Claims

## Why this exists
The homepage hero currently advertises rounded counts that match the current database (200/200/300/155/50). Pre-launch, we want to raise those claims to 400/400/500/300/100. We will only raise the displayed numbers **after** the underlying JSON files contain enough verified venues to back them.

## Targets

| File | Current | Target | To add |
|---|---|---|---|
| `data/attractions.json` | 200 | 400+ | +200 |
| `data/restaurants.json` | 200 | 400+ | +200 |
| `data/nightlife.json` | 300 | 500+ | +200 |
| `data/cafes.json` | 155 | 300+ | +145 |
| `data/day-templates.json` | 50 | 100 | +50 |

Total: ~795 new items.

## Hard rules
- **No fabrication.** Every venue must be real, currently open, verifiable via Google Maps / official site. If unsure, skip it.
- **Match existing schema exactly.** Reference `data/restaurants.json[0]` (Dishoom Shoreditch) and `data/attractions.json[0]` for the canonical shapes.
- **Neighbourhood coverage.** Spread additions across all 57 neighbourhoods in `neighbourhoods.json` — don't just pile on Soho/Shoreditch.
- **Budget-tier mix.** Roughly 30% budget, 45% mid-range, 25% premium for restaurants/nightlife/cafes.
- **Affiliate links where honest.** Only add `affiliateUrl` if the venue genuinely has an OpenTable/Viator/GetYourGuide/Booking listing. Leave null otherwise — don't force it.

## Sequencing (weekly batches)
Run in 4 weekly batches of ~200 items each, so Oliver (Content Writer) and Poppy (Social) can mine new entries as blog/social hooks in parallel.

- **Week 1:** +50 attractions, +50 restaurants, +50 nightlife, +40 cafes, +10 day-templates
- **Week 2:** same split
- **Week 3:** same split
- **Week 4:** remaining balance + QA pass (dedupe, field-completeness, rating spot-checks)

## Definition of done
1. Each target file hits the count in the table above.
2. Zero duplicate `id` values across files.
3. Zero venues missing `name`, `neighbourhood`, `description` (≥50 chars), `address`.
4. QA report at `ai-staff/tasks/expand-venue-database-report.md` listing per-file counts + any flagged venues.
5. Hero-stat update proposed in a separate PR so visible claims and data ship together.

## Downstream unblocks
- Hero stats on `index.html` and `de/es/fr/index.html` raised to 400/400/500/300/100
- Blog/SEO copy currently saying "900+ venues" refreshed to reflect new total (~1,600+)
- Agent briefings (content-writer.md, data-curator.md, editor-in-chief.md) updated with new counts

## Coordinate with
- Rupert (Affiliate Scout) — new venues may unlock affiliate revenue; he takes the first pass at commission-eligible links.
- Oliver (Content Writer) — new openings become blog posts; flag the 10 most interesting each week.
