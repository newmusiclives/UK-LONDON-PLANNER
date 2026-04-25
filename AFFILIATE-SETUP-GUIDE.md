# Affiliate Program Setup Guide

**Last updated:** 2026-04-25

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
| Klook | affiliate.klook.com/home | Applied 2026-04-25. Direct program. ~2 working day approval. Drop `AFFILIATE_KLOOK` into Netlify when ID arrives. |

### 📝 To apply (in priority order — verified 2026-04-25)

| # | Program | Sign-up URL | Network | Commission | Notes |
|---|---|---|---|---|---|
| 1 | **Context Travel** | https://explore.contexttravel.com/affiliate-home | Direct (Tipalti payouts) | 10% flat | Open application, easy approval. Payout = month after service date. |
| 2 | **Tiqets** | https://www.tiqets.com/en/partner-program/sign-up-form/ | Direct (Awin alt — merchant 12428) | ~5–8% gross-margin share | Direct form preferred over Awin. **Pre-launch risk** — see note below. |
| 3 | **Trainline** | https://join.partnerize.com/trainline/en | **Partnerize** (mandatory) | Variable CPA per ticket (~20% on premium); 30-day cookie | Was Awin historically; now Partnerize only. **Pre-launch risk.** |
| 4 | **Go City** | https://signup.partnerize.com/signup/en/gocity | **Partnerize** (mandatory) | 6% content / 3% coupon; 90-day cookie; AOV ~$350 | Same Partnerize account as Trainline. Standard track — influencer track has 20k+ follower prereq. |
| 5 | **WithLocals** | https://www.withlocals.com/info/partners/ → apply via Awin | **Awin** (advertiser 37836) | 10%; 30-day cookie; AOV $200+ | Awin account = ~$5 refundable deposit. Manual approval 1–2 weeks. **Pre-launch risk.** |
| 6 | **ToursByLocals** | https://www.toursbylocals.com/become-a-travel-agency | Direct (no public affiliate program) | 5% base → 10% after $7,500/yr | Travel-agency partnership, not a real affiliate program. Manual back-and-forth expected. Last priority. |

✅ **Klook applied 2026-04-25** — moved to "waiting on approval" above.

#### Pre-launch reviewer risk

Tiqets, Trainline, and WithLocals reviewers will visit londonplanned.com to evaluate. While the coming-soon gate is up, a waitlist page alone may trigger "no published content" rejections. Two options:

1. **Send reviewers a preview URL** with the bypass token: `https://londonplanned.com/?preview=<PREVIEW_TOKEN>` (sets the `lp_preview` cookie for the session — see `netlify/edge-functions/coming-soon-gate.js:55-78`).
2. **Defer those three** until after the 2026-05-08 launch when `LAUNCH_MODE=live`.

Klook, Context Travel, and Go City are documented as more tolerant of pre-launch sites — apply those Monday regardless.

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
