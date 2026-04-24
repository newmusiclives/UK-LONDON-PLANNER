# Affiliate Program Setup Guide

**Last updated:** 2026-04-24

## How approval controls visibility

Affiliate CTAs only render when the corresponding Netlify env var is set.
`AffiliateLinks.isApproved(provider)` gates every booking widget + inline CTA.
To turn one on: add the ID in **Netlify → Site settings → Environment variables**,
save, and Netlify redeploys automatically. No code changes needed.

---

## Status

### ✅ Approved & live

| Program | Netlify env var | Covers |
|---|---|---|
| GetYourGuide | `AFFILIATE_GETYOURGUIDE` | Attractions, tours, skip-the-line tickets (8% commission) |
| Booking.com | `AFFILIATE_BOOKING` | Hotels, hostels, apartments (4–6% of booking value) |
| Amazon Associates UK | `AFFILIATE_AMAZON_UK` | Guidebooks, travel gear (1–10%) |

### 🔗 Approved — env var still needs setting

| Program | Netlify env var | Action |
|---|---|---|
| Viator | `AFFILIATE_VIATOR` | Paste partner ID into Netlify, save, auto-redeploy |

### ⏳ Applied — waiting on approval

| Program | Sign-up | Notes |
|---|---|---|
| OpenTable | opentable.com/affiliates | $1–2 per seated diner |
| TodayTix | emailed partnerships@todaytix.com | West End theatre, 5–8% |

### 📝 To apply (in priority order)

| # | Program | What | Commission | Sign-up |
|---|---|---|---|---|
| 1 | Klook | Attractions, transport | up to 5% | affiliate.klook.com |
| 2 | Tiqets | Museum tickets | 6% | tiqets.com/affiliates |
| 3 | Go City | Multi-attraction passes | 6–10% | gocity.com/affiliates |
| 4 | Trainline | UK rail tickets | up to 2% | trainline.com/affiliates |
| 5 | WithLocals | Private local experiences | 5–8% | withlocals.com/partners (via Impact.com) |
| 6 | ToursByLocals | Private guides | ~8% | toursbylocals.com/affiliates |
| 7 | Context Travel | Expert-led tours | ~10% | via CJ Affiliate — search "Context Travel" |

---

## Full Netlify env var reference

All 29 supported affiliates follow the pattern `AFFILIATE_<PROGRAM>`:

```
AFFILIATE_GETYOURGUIDE, AFFILIATE_BOOKING, AFFILIATE_VIATOR,
AFFILIATE_TODAYTIX, AFFILIATE_OPENTABLE, AFFILIATE_KLOOK,
AFFILIATE_TIQETS, AFFILIATE_GOCITY, AFFILIATE_TRAINLINE,
AFFILIATE_EXPEDIA, AFFILIATE_HOSTELWORLD, AFFILIATE_SKYSCANNER,
AFFILIATE_AMAZON_UK, AFFILIATE_TRIPADVISOR, AFFILIATE_MUSEMENT,
AFFILIATE_HEADOUT, AFFILIATE_EUROSTAR, AFFILIATE_OMIO,
AFFILIATE_RENTALCARS, AFFILIATE_THEFORK, AFFILIATE_LTD,
AFFILIATE_WORLDNOMADS, AFFILIATE_SAFETYWING, AFFILIATE_WISE,
AFFILIATE_REVOLUT, AFFILIATE_AIRALO, AFFILIATE_WITHLOCALS,
AFFILIATE_TOURSBYLOCALS, AFFILIATE_CONTEXTTRAVEL
```

Source of truth: `netlify/functions/runtime-config.js`.

---

## Revenue estimates (per itinerary sold)

Assuming 50% of users click at least one affiliate link and 10% convert:

| Source | Avg Booking Value | Commission | Est. Revenue |
|--------|------------------|------------|--------------|
| Hotel (5 nights) | £750 | 5% | £37.50 |
| Attractions (3–4) | £120 | 8% | £9.60 |
| Theatre tickets | £100 | 6% | £6.00 |
| Restaurant bookings (3–4) | £150 | $1.50/diner | £6.00 |
| Tours/experiences | £80 | 8% | £6.40 |
| **Total potential per converting customer** | | | **~£65** |

Plus the itinerary fee ($50–$150).

### Partner services (expert & concierge)

| Source | Avg Booking Value | Commission | Est. Revenue |
|--------|------------------|------------|--------------|
| WithLocals trip planning | £200 | 6% | £12.00 |
| Context Travel consultation | £80 | 10% | £8.00 |
| ToursByLocals private guide | £300 | 8% | £24.00 |
| **Total potential per converting customer** | | | **~£44** |
