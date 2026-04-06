# Affiliate Program Setup Guide

## Programs to Join (in order of priority)

### 1. GetYourGuide Partner Program
- **What:** Attractions, tours, experiences, skip-the-line tickets
- **Commission:** 8% per booking
- **Sign up:** https://partner.getyourguide.com/
- **Covers:** Tower of London, London Eye, Warner Bros Studio, Thames cruises, walking tours, stadium tours, speedboat rides, helicopter tours, etc.
- **How to use:** Once approved, you get a partner ID. Replace `YOUR_GYG_PARTNER_ID` in config.js

### 2. Booking.com Affiliate Partner Programme
- **What:** Hotels, hostels, apartments
- **Commission:** 25-40% of Booking.com's commission (roughly 4-6% of booking value)
- **Sign up:** https://www.booking.com/affiliate-program/v2/index.html
- **Covers:** All hotel recommendations
- **How to use:** Replace `YOUR_BOOKING_AID` in config.js

### 3. TripAdvisor / Viator Affiliate Program
- **What:** Tours, activities, experiences
- **Commission:** 8% per booking
- **Sign up:** https://www.viator.com/affiliates
- **Covers:** Alternative booking source for attractions and tours

### 4. TodayTix Affiliate Program
- **What:** West End theatre tickets
- **Commission:** Varies (typically 5-8%)
- **Sign up:** Contact partnerships@todaytix.com
- **Covers:** All West End shows, musicals, plays

### 5. OpenTable Affiliate Program
- **What:** Restaurant reservations
- **Commission:** $1-2 per seated diner
- **Sign up:** https://www.opentable.com/affiliates
- **Covers:** All restaurant reservations (Dishoom, Hawksmoor, The Ivy, etc.)

### 6. Klook Affiliate Program
- **What:** Attractions, transport, experiences
- **Commission:** Up to 5% per booking
- **Sign up:** https://affiliate.klook.com/
- **Covers:** London Pass, attraction combos, Oyster cards

### 7. Tiqets Affiliate Program
- **What:** Museum and attraction tickets
- **Commission:** 6% per booking
- **Sign up:** https://www.tiqets.com/affiliates
- **Covers:** Tower of London, Kew Gardens, Hampton Court, etc.

### 8. Go City (formerly London Pass) Affiliate Program
- **What:** Multi-attraction passes
- **Commission:** 6-10% per pass sold
- **Sign up:** https://gocity.com/affiliates
- **Covers:** Explorer Pass, All-Inclusive Pass

### 9. Trainline Partner Program
- **What:** UK rail tickets
- **Commission:** Up to 2% per booking
- **Sign up:** https://www.trainline.com/affiliates
- **Covers:** Transport to day trip destinations (Windsor, Brighton, etc.)

### 10. Amazon Associates
- **What:** London guidebooks, travel gear
- **Commission:** 1-10% depending on category
- **Sign up:** https://affiliate-program.amazon.co.uk/
- **Covers:** Add a "Pack for London" section with recommended gear

### 11. WithLocals Partner Program
- **What:** Trip planning, private experiences, online sessions with locals
- **Commission:** 5-8% per booking
- **Sign up:** https://www.withlocals.com/partners/ (via Impact.com)
- **Covers:** Trip planning concierge, online expert consultations, private local experiences
- **How to use:** Replace `YOUR_WITHLOCALS_ID` in config.js

### 12. ToursByLocals Affiliate Program
- **What:** Private local guides for multi-day or single-day tours
- **Commission:** ~8% per booking
- **Sign up:** https://www.toursbylocals.com/affiliates
- **Covers:** Private London guide hire (replaces in-house personal guide offering)
- **How to use:** Replace `YOUR_TOURSBYLOCALS_ID` in config.js

### 13. Context Travel Affiliate Program
- **What:** Expert-led walking tours and private "Context Conversations" (video planning calls)
- **Commission:** ~10% per booking
- **Sign up:** Via CJ Affiliate (Commission Junction) — search "Context Travel"
- **Covers:** Expert consultation calls, scholar-led London tours
- **How to use:** Replace `YOUR_CONTEXTTRAVEL_ID` in config.js

---

## Setup Steps

1. Sign up for each program above
2. Get your affiliate/partner IDs
3. Open `js/config.js` and fill in the `affiliateIds` section
4. All links throughout the site will automatically include your affiliate tracking

---

## Revenue Estimates (per itinerary sold)

Assuming 50% of users click at least one affiliate link and 10% convert:

| Source | Avg Booking Value | Commission | Est. Revenue |
|--------|------------------|------------|--------------|
| Hotel (5 nights) | £750 | 5% | £37.50 |
| Attractions (3-4) | £120 | 8% | £9.60 |
| Theatre tickets | £100 | 6% | £6.00 |
| Restaurant bookings (3-4) | £150 | $1.50/diner | £6.00 |
| Tours/experiences | £80 | 8% | £6.40 |
| **Total potential per converting customer** | | | **~£65** |

Plus the itinerary fee ($50-$99).

### Partner Services (Expert & Concierge)

| Source | Avg Booking Value | Commission | Est. Revenue |
|--------|------------------|------------|--------------|
| WithLocals trip planning | £200 | 6% | £12.00 |
| Context Travel consultation | £80 | 10% | £8.00 |
| ToursByLocals private guide | £300 | 8% | £24.00 |
| **Total potential per converting customer** | | | **~£44** |
