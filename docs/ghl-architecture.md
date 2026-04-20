# London Planned — Complete GHL Marketing Architecture

**Location ID:** `15PtxwoCpKZwf1QxFOX6`
**Sub-account:** London Planned · **Agency:** app.lightworkdigital.com
**Brief received:** 2026-04-20 (source: Lightwork Digital April 2026 brief)

Two-phase build:
- **Part 1 — Pre-Launch:** Waitlist, AI Staff, Organic Marketing, Partners. Build and activate now.
- **Part 2 — Full Site:** All 5 capture points, Products, Full Funnel. Build now, activate at `LAUNCH_MODE=live`.

---

## Part 1 — Pre-Launch

### 1.1 Capture points
| Point | Page | Data | GHL Action |
|---|---|---|---|
| Waitlist Signup | / (coming-soon) | Name, Email, Share Code, Referral | Create contact, tag, nurture |
| Free Guide | free-guide.html | First name, Email | Create, tag `free-guide`, guide sequence |
| Partners Enquiry | partners.html | Full B2B profile | Partner pipeline, notify team |
| Footer Email | all pages | Email | Tag `newsletter`, tips sequence |
| AI Chat | all pages | Email if captured | Tag `chat-lead` |

### 2. AI Chat Widget — pre-launch config
- Name: London Planned Assistant · Persona: Lena · Tone: Friendly London local, warm, practical, US audience
- Primary goal: capture email + answer "what's coming"
- Secondary goal: share waitlist link, explain referral
- Fallback: "I'll find out for you — drop your email and I'll follow up"
- 24/7 AI, no human handoff pre-launch
- Post-capture: create contact, tag `chat-lead` + `pre-launch`, enter waitlist nurture

**Knowledge base topics:** what is LP, launch date, pricing from $50, what's included, referral programme, UK extensions, free guide on free-guide.html, team behind it.

### 2.3 Organic content cadence (via Social Planner)
- Instagram 3x/week — neighbourhood shots, facts, teasers
- Facebook 2x/week — longer tips, American-in-London stories
- Pinterest 5x/week — neighbourhood guides, packing, photo spots
- Email (waitlist) 1x/week — London tip
- Blog promote on publish — via email campaign

### 3. Pipelines (replace existing with brief spec)

**3.1 Waitlist Pipeline**
1. Signed Up — entry: waitlist form → exit: first email opened
2. Engaged — entry: 2+ opens OR any click → exit: refers friend OR launch email sent
3. Referrer — entry: referred contact signs up → exit: referred contact converts post-launch
4. VIP — High Referrer — entry: 3+ referrals → exit: launch → Customer pipeline

**3.2 Partners Pipeline (B2B)**
1. Enquiry Received — entry: partners form → action: auto-reply 5min + notify
2. Qualified — entry: hotel/agent/operator profile → action: personal outreach 24h
3. In Conversation — entry: reply received → action: schedule call
4. Agreement Sent — entry: terms agreed → action: send partner agreement PDF
5. Active Partner — entry: signed → action: onboard to white-label + affiliate
6. Not a Fit — entry: no response after 3 attempts → action: long-term nurture

### 4. Pre-launch tags

**Waitlist:** `london-planned`, `waitlist`, `organic`, `referred`, `referrer`, `vip-referrer`, `free-guide`, `newsletter`, `chat-lead`, `pre-launch`

**Partners:** `partner-lead`, `partner-qualified`, `partner-hotel`, `partner-agent`, `partner-operator`, `partner-airline`, `partner-active`, `partner-white-label`

### 5. Pre-launch workflows

**5.1 Waitlist Signup — EXISTING. DO NOT REBUILD.**
Workflow ID: `59922814-1837-409c-bda7-fcf7a3d87765`

**5.2 Free Guide Lead Capture**
Trigger: `free-guide.html` form webhook.
1. Upsert contact with firstName + email
2. Tags: `london-planned`, `free-guide`, `pre-launch`
3. Send: Guide delivery email with download link
4. Wait 2d → "Hope the guide was useful — what's coming" teaser
5. Wait 5d → Add to waitlist nurture if not already

**5.3 Footer Newsletter Signup**
Trigger: footer "Get 3 Free London Insider Tips" form.
1. Upsert contact with email
2. Tags: `london-planned`, `newsletter`, `pre-launch`
3. Send Tip 1 of 3 immediately
4. Wait 3d → Tip 2 of 3
5. Wait 3d → Tip 3 of 3 + waitlist CTA
6. Add to waitlist nurture

**5.4 Weekly Waitlist Nurture (12 touches)**
Trigger: tag `waitlist` applied.
| Week | Type | Subject |
|---|---|---|
| 0 | Email | Welcome: Your London adventure starts here — and a gift for you |
| 1 | Email | Neighbourhoods Americans always get wrong (and where to actually stay) |
| 2 | Email | Tube, Oyster & Black Cabs: no-stress guide to getting around |
| 3 | Email | 10 things Americans wish they'd known before their first London trip |
| 4 | Email | London in [season]: what's on, what to pack, what to skip |
| 5 | Email | The London food scene: beyond fish and chips |
| 6 | Email | Tipping, taxes & money in London: American's complete guide |
| 7 | Email | Hidden London: spots only locals know |
| 8 | SMS | Quick one — when are you planning your London trip? Reply with the year 🇬🇧 |
| 10 | Email | How our AI builds your custom London itinerary (sneak peek) |
| 12 | Email | You're going to love this — [launch preview / countdown] |

**5.5 Partner Enquiry**
Trigger: partners form webhook.
1. Create contact with all form fields
2. Tags: `partner-lead`, `partner-[type]`
3. Create opportunity in Partners Pipeline → Enquiry Received
4. Auto-reply within 5min
5. Notify internal team (SMS + email)
6. Wait 23h → if no manual reply → internal alert
7. Wait 3d → if still Enquiry Received → "Just checking in" to partner
8. Wait 7d no response → move to Not a Fit

---

## Part 2 — Full Site Launch

### 6.1 Post-launch capture points
| Point | Page | Data | GHL Action |
|---|---|---|---|
| Itinerary Wizard | wizard.html | Trip length, dates, group, occasion, budget, interests, destinations | Contact + rich fields → Customer pipeline at purchase |
| Free Guide | free-guide.html | First name, email | Guide nurture → wizard upsell |
| Quiz | quiz.html | Personality type + email | Tag with personality, tailored sequence |
| Footer Email | all | email | Newsletter + tips |
| AI Chat | all | email if captured | Relevant sequence |
| Partners | partners.html | full B2B | Partners pipeline (same as pre-launch) |
| Book Services clicks | book-services.html | affiliate link clicks | Tag + follow-up sequence |

### 7. Products (GHL → Stripe)
| Product | Days | Price | Tag on Purchase | Tier ID |
|---|---|---|---|---|
| London Short Stay Itinerary | 1–5 | $50.00 | `itinerary-short`, `customer` | tier-short |
| London Week Explorer Itinerary | 6–10 | $75.00 | `itinerary-week`, `customer` | tier-week |
| London Extended Adventure Itinerary | 11–21 | $150.00 | `itinerary-extended`, `customer` | tier-extended |
| London + UK Extension (add-on) | — | +$50.00 | `uk-extension` | — |

### 8. Custom fields needed (Section 8)
**Already exist:** `share_code`, `referred_by`, `referral_count`, `perk_tier`, `promo_code`, `redemption_code`, `trip_start`, `trip_end`, `partner_type`, `traveller-volume`

**To add:**
| Field | Type | Source |
|---|---|---|
| trip_length_days | Number | Wizard step 1 |
| arrival_date | Date | Wizard step 1 (= existing `trip_start`?) |
| departure_date | Date | Wizard step 1 (= existing `trip_end`?) |
| beyond_london | Checkbox | Wizard step 1 |
| uk_destinations | Text/multi | Wizard step 1 |
| group_type | Text/picklist | Wizard step 2 |
| occasion | Text/picklist | Wizard step 3 |
| budget_accommodation | Text/picklist | Wizard step 4 |
| budget_food | Text/picklist | Wizard step 4 |
| budget_entertainment | Text/picklist | Wizard step 4 |
| interests | Text (comma list) | Wizard step 5 |
| itinerary_tier | Text | Derived from trip_length_days |
| traveller_type | Text | Quiz result |
| referral_code | Text | = existing `share_code`? |

Note: existing `trip_start`/`trip_end` and `share_code` likely cover `arrival_date`/`departure_date`/`referral_code`. Before creating new duplicates, confirm reuse of existing fields.

### 9. Customer Journey Pipeline (new)
1. Prospect — entry: any capture (not purchased)
2. Checkout Started — entry: order form opened (UTM tracked)
3. Customer — Short Stay — entry: $50 tier payment
4. Customer — Week Explorer — entry: $75 tier payment
5. Customer — Extended Adventure — entry: $150 tier payment
6. Itinerary Delivered — entry: delivery email sent
7. Trip Active — entry: arrival_date reached
8. Trip Complete — entry: departure_date + 1 day
9. Repeat / Referrer — entry: referred conversion OR second purchase

### 10. Post-launch tags
**Source:** `post-launch`, `quiz-lead` (plus all pre-launch source tags)
**Traveller:** `group-solo`, `group-couple`, `group-family`, `group-friends`, `group-hens`, `group-stags`
**Occasion:** `occasion-honeymoon`, `occasion-anniversary`, `occasion-birthday`, `occasion-first-time`, `occasion-bucket-list`, `occasion-graduation`
**Budget:** `budget-budget`, `budget-mid`, `budget-premium`
**Interest:** `interest-history`, `interest-food`, `interest-nightlife`, `interest-art`, `interest-theatre`, `interest-sport`
**Traveller type:** `traveller-explorer`, `traveller-foodie`, `traveller-culture`, `traveller-party`
**Product:** `itinerary-short`, `itinerary-week`, `itinerary-extended`, `uk-extension`, `customer`, `checkout-started`, `cart-abandoned`
**Lifecycle:** `itinerary-delivered`, `trip-complete`, `review-requested`, `reviewed`, `repeat-customer`, `test`
**Affiliate:** `affiliate-hotel`, `affiliate-flights`, `affiliate-insurance`, `affiliate-transfer`, `affiliate-esim`, `affiliate-rail`, `affiliate-eurostar`, `affiliate-car`, `affiliate-attractions`, `affiliate-theatre`, `affiliate-pass`, `affiliate-money`, `affiliate-concierge`, `affiliate-expert`, `affiliate-guide`

### 11. Post-launch workflows

**11.1 Wizard Submission Pre-Purchase** — wizard webhook → upsert with all custom fields → apply profile tags → Customer pipeline Prospect → send personalised preview email + CTA.

**11.2 Abandoned Cart** — `checkout-started` + no purchase:
- 1h: SMS "Still planning? Your itinerary is one click away"
- 24h: Email "Your custom London itinerary is waiting" + FAQ + guarantee
- 72h: Email final nudge with testimonial + guarantee
- Apply `cart-abandoned` after 2h

**11.3 Post-Purchase (all tiers)** — Stripe payment confirmed:
- Apply `customer` + tier tag, move to correct Customer pipeline stage
- Immediate: confirmation email ("building right now")
- Immediate: webhook to londonplanned.com → trigger AI itinerary generation
- On delivery webhook: send delivery email with PDF/link, tag `itinerary-delivered`
- Day 1: "While you explore London" tips + currency + packing
- Day 2: Affiliate upsell — transfers, insurance, eSIM (tailored to budget)
- Day 4: Affiliate upsell — hotels + UK rail if `uk-extension` tag

**11.4 Pre-Trip** — relative to `arrival_date`:
- 30d out: checklist email (ESTA, passport, insurance, currency)
- 14d out: personalised packing list (by season + trip length)
- 7d out: SMS ("One week! Top up Oyster at the airport first")
- 2d out: email (offline maps, emergency contacts, Day 1 quick-start)
- Arrival day: SMS ("You're here! Open your itinerary")

**11.5 Post-Trip** — `departure_date` + 1d OR manual `trip-complete`:
- Day 1: review request email
- Day 3: referral offer ("$15 off for friend, $15 credit for you")
- Day 5: SMS referral reminder if no click
- Day 14: "Planning your next trip?" (Europe extension, repeat)
- Day 30: "Where to next?" (Scotland, Ireland, Paris)

**11.6 Quiz Lead Sequence** — quiz completed on quiz.html:
- Upsert with `traveller_type`, tag `quiz-lead` + personality
- Send quiz result email (personalised)
- Day 2: tailored content by personality
- Day 5: wizard CTA

**11.7 Referral Reward** — referred contact purchases AND `referredBy` matches an existing share code:
- Email referrer: "Your friend just booked — $15 credit is ready"
- Apply `referrer` (or `vip-referrer` if 3+)
- Move to Repeat / Referrer stage
- SMS referrer

**11.8 Affiliate Click Follow-Up** — fires 3 days after affiliate tag applied if no confirmed purchase from that affiliate:
- One follow-up email per affiliate category max
- No more than 2 affiliate emails per week total

### 12. Email templates to build (33)
Numbered list — full personalisation variables documented in original brief Section 12. Covers:
- Pre-launch (1–14): waitlist welcome [existing], free guide delivery + teaser, newsletter tips 1–3, weekly nurture 8 touches, partner auto-reply + follow-up
- Post-launch (15–33): wizard preview, abandoned cart 24h + 72h, purchase confirmation, itinerary delivery, post-purchase days 1/2/4, pre-trip 30d/14d/2d, post-trip review request + referral offer + where-next, quiz result + day 2 + day 5, referral reward, affiliate insurance follow-up

### 13. SMS templates (7)
1. Launch Day broadcast
2. Abandoned Cart 1h
3. Nurture check-in (Week 8)
4. Pre-Trip 7 days
5. Arrival Day
6. Post-Trip referral (Day 5)
7. Referral reward (referred conversion)

### 14. AI Chat — post-launch config
| Setting | Pre-Launch | Post-Launch |
|---|---|---|
| Primary goal | Capture email + interest | Answer + guide to wizard |
| CTA | Join waitlist | Start itinerary from $50 |
| Product knowledge | Teaser | Full pricing/tiers/delivery |
| Post-purchase support | N/A | Itinerary Qs, delivery status |

Post-launch knowledge additions: exact pricing $50/$75/$150, UK extension, refund/guarantee policy, My Trips access, affiliate comparisons, Oyster vs Travelcard, tipping, weather, ESTA.

### 15. Affiliate tracking (book-services.html)
15 categories, each with tag + optional 3-day follow-up email. Full list: flights, hotels, transfers, car hire, UK rail, Eurostar, insurance, eSIM, money card, attractions, theatre, London Pass, concierge, expert call, private guide.

### 16. Partners programme — post-launch
**Tiers:** Affiliate (20%), White-Label (20% + partner-branded PDF), Enterprise (custom + API option).

**16.2 Onboarding workflow (post-agreement):**
1. Send welcome email with affiliate tracking link format
2. Create GHL tracking link (UTM source = partner slug)
3. If white-label: send PDF branding guide
4. Set up monthly payout report (automated)
5. Move opportunity to Active Partner
6. Tag `partner-active` + `partner-white-label` if applicable

---

## Build sequencing

**Part 1 priorities:**
1. Confirm waitlist workflow still published (UI check)
2. Replace existing pipelines with brief-spec versions (UI)
3. Create pre-launch tag library (done via QA seed contact, see below)
4. Build workflows 5.2, 5.3, 5.4, 5.5 (UI — MCP can't create workflows)
5. Build email templates 1–14 (MCP can create as drafts)
6. Configure AI Chat Widget pre-launch (UI)
7. Set up Social Planner channels (UI)

**Part 2 priorities (build in DRAFT, activate at launch):**
1. Create missing custom fields (UI — Section 8)
2. Create 4 products with Stripe sync (UI — Section 7)
3. Create Customer Journey pipeline (UI — Section 9)
4. Post-launch tag library (done via QA seed contact)
5. Build workflows 11.1–11.8 (UI)
6. Build email templates 15–33 (MCP)
7. Build SMS templates 1–7 (UI)
8. Update AI Chat to post-launch config (UI)
9. Create affiliate tracking links (UI)
10. Partner onboarding workflow (UI)
11. End-to-end test with `test` tag
