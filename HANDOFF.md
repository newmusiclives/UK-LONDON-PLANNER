# Overnight Handoff — Itinerary Delivery Pipeline

**Session:** Wed 22 Apr 2026, evening
**Goal:** Get the "pay $50 → receive personalised itinerary by email" pipeline live in time for Thu 24 Apr campaign kickoff, launch Thu 8 May.

---

## ✅ What I shipped (you don't need to redo)

### Code (committed as `2c9aec8`, pushed to main)
- `netlify/functions/submit-itinerary.js` — upserts GHL contact + stashes itinerary JSON
- `netlify/functions/get-itinerary.js` — reads stored itinerary by token
- `js/itinerary-delivery.js` — post-generation save CTA on /itinerary page
- `js/itinerary-renderer.js` — hydrates from `?token=` before falling back to localStorage
- `js/payment.js` — passes itinerary token as Stripe `client_reference_id`
- `netlify.toml` — `/api/submit-itinerary` and `/api/get-itinerary` redirects
- `email-templates/35-itinerary-delivery.html` — paid unlock email

### GHL (via REST, already in your account)
- **6 products created** with prices (amounts in cents):

| Product | Tier | Amount | Product ID | Price ID |
|---|---|---|---|---|
| London Short Stay Itinerary | tier1 | $50 | `69e954858af7db456e4477a7` | `69e9548fe894bc31fd424587` |
| London Week Explorer Itinerary | tier2 | $75 | `69e95507e894bc47e5425ed5` | `69e955089cbe9be46373d64d` |
| London Extended Itinerary | tier3 | $150 | `69e9550859575063972dd236` | `69e95508fad86c674b395c76` |
| UK Short Break Add-on | uk-short | $50 | `69e95508e894bc22b0425ed7` | `69e95508e894bc2053425edc` |
| UK Explorer Add-on | uk-standard | $75 | `69e95509a9be1638230fb989` | `69e95509df08174992bd1c7d` |
| Grand UK Tour Add-on | uk-extended | $150 | `69e9550983e802177d9fba38` | `69e95509ce7398c9ca5155d6` |

> **Pricing unit caveat:** GHL's Products API didn't clearly document whether `amount` is cents or dollars. I used cents (5000/7500/15000). **Check the Payments → Products page in GHL** — if tiles show "$50.00" you're good; if they show "$5,000.00" the amounts were dollars, just edit each price in the UI to knock three zeros off. Smoke test will catch this too.

- **4 new custom fields:**
  - `itinerary_token` (TEXT) — id `PgIMdemlczfi9LeySgok`
  - `itinerary_json` (LARGE_TEXT) — id `dvoyCjqRjmNC2OC3kTxJ`
  - `customer_tier` (TEXT) — id `4baZQrLPAPdlNicz6SHQ`
  - `itinerary_generated_at` (TEXT) — id `ZRXpzsXdCHoi1ziLIHOW`

- **Email template uploaded:** "Itinerary Delivery — Paid Unlock" (id `69e957ba495909839c8d9180`)

### Smoke test passed
Ran locally against live GHL: submit → get returned correct itinerary JSON + metadata. Test contact `CA2lc4nqrFTBn9XIuvoj` cleaned up.

---

## 🚧 What you need to do (blocking launch)

Ordered by dependency. Do 1, 2, 3 first — nothing else works without them.

### 1. ✅ DONE — `GHL_PRIVATE_TOKEN` already in Netlify env (confirmed 2026-04-22)

### 2. ✅ DONE — Product prices verified at $50/$75/$150 in GHL UI (confirmed 2026-04-22). GHL Products API `amount` field is in cents.

### 3. Create Stripe Payment Links for each product — 15 min

GHL has Stripe connected, so each product in GHL should auto-create a matching Stripe product. You now need Payment Links:

- In GHL: **Payments → Products → click a product → Payment Link** section → generate.
- OR in Stripe: **Products → find matching product → Payment Links → Create**.
- Enable **"Client reference ID"** (critical — passes the itinerary token through to the success page and GHL webhook).
- Success URL: `https://londonplanned.com/success.html?session_id={CHECKOUT_SESSION_ID}`
- Cancel URL: `https://londonplanned.com/cancel.html`

Paste the 6 URLs into Netlify env vars:
- `STRIPE_LINK_TIER1` (Short Stay)
- `STRIPE_LINK_TIER2` (Week Explorer)
- `STRIPE_LINK_TIER3` (Extended)
- `STRIPE_LINK_UK_SHORT`
- `STRIPE_LINK_UK_STANDARD`
- `STRIPE_LINK_UK_EXTENDED`

Redeploy Netlify (clear cache).

### 4. Build the "LP — Purchase Delivery" workflow in GHL — 15 min

Same pattern as the Contact Form workflow we built today.

**Trigger:** Order Form Submitted (or "Order Submitted" — Stripe integration fires this when a payment link is paid). In the trigger, filter by **Product** = any of your 6 products.

**Actions, in order:**
1. **Add Contact Tag**
   - Tags: `customer`, `london-planned`, `customer-{{trigger.product_name}}` (or just `customer-paid`)
2. **Update Opportunity** (if using Customer Journey pipeline id `9PZlh90lbfTOsqItkWHb`): move to "Customer-Short Stay" / etc. based on product
3. **Send Email**
   - From Name: `London Planned`
   - From Email: same verified sender you use on the other working workflows
   - To Email: `{{contact.email}}`
   - Subject: `Your London Itinerary is ready 🎉`
   - Template: **"Itinerary Delivery — Paid Unlock"** (id `69e957ba495909839c8d9180`)
4. **Internal Notification** — *Send Email* action (envelope icon ✉️, NOT the bell 🔔 Internal Notification action) to paul@lightworkdigital.com with purchase details. We learned today's lesson — bell icon = in-app only = no email.

**Publish.** Test by firing a manual purchase (see §7 below).

> **If the Stripe→GHL trigger isn't available:** Stripe integration may not be fully wired. Fallback: set up a Stripe webhook → Inbound Webhook trigger in GHL → parse `client_reference_id` (which contains the itinerary token = contact id) and run the same actions. If you hit this, ping me and I'll write the webhook spec.

### 5. GA4 measurement ID — 10 min

- Create GA4 property at analytics.google.com
- Get the measurement ID (`G-XXXXXXXXXX`)
- Add to Netlify env: `GOOGLE_ANALYTICS_ID`
- Redeploy

### 6. Social connects in GHL — 20 min

**Prioritise in this order:**
1. **Pinterest** — best cold-start channel for travel; heavy weight for the 2-week plan
2. **Instagram + Facebook** — any existing personal list overlap will convert here fastest
3. **X / Twitter** — low effort, complements Pinterest
4. **Skip:** TikTok (needs video content we don't have), LinkedIn (wrong audience for $50 London itineraries)

In GHL: **Marketing → Social Planner → Connect Account** for each.

### 7. Smoke test end-to-end — 10 min

Once steps 1-4 are done:

1. Open https://londonplanned.com/wizard in private mode
2. Fill the wizard with 3-day London, any preferences
3. Hit "Generate Itinerary" → lands on `/itinerary.html`
4. Use the **Save card** at the top: enter your email, submit
5. URL should update to `…?token=XXXX` — confirm the card says "Saved ✓"
6. Click "Unlock" button → Stripe Payment Link opens
7. Pay (or use a Stripe test card `4242 4242 4242 4242` in test mode)
8. Redirected to `/success.html` → auto-redirects to `/itinerary.html`
9. Check your inbox: **"Your London Itinerary is ready"** email should arrive with a link
10. Click the link → itinerary loads with full unlock (PDF download, sharing, etc.)

If any step fails, the GHL workflow **Execution Logs** tab shows exactly where it broke.

---

## ⚠️ Decisions I made without your input

Flag if you want to change any:

1. **Token = GHL contact id.** Simple, no separate search needed. Means the itinerary URL leaks the contactId format. If that bothers you, we can swap in a UUID + custom-field search later.
2. **Price amounts in cents** (e.g. 5000 for $50). GHL docs are ambiguous. Step 2 above verifies.
3. **Itinerary stored as JSON on the contact record** (LARGE_TEXT field). Capped at whatever GHL's LARGE_TEXT limit is — should be fine for normal-sized itineraries. If we hit limits, move to Netlify Blobs or S3.
4. **Save CTA only shows for un-paid itineraries.** Once a token is in the URL, CTA stays hidden (assumption: already saved).
5. **Didn't touch wizard.js.** All the "save to server" wiring lives on `/itinerary.html` so the wizard flow stays unchanged. If you want email to be collected during the wizard instead (step 7), ping me and I'll shift it.
6. **Existing "London + UK Extension" product** (id `69e652608e6cc8d2ef823036`, created 2026-04-20, no price) was left alone. Safe to delete from GHL UI since the new 6 products cover everything. I didn't want to destructive-delete without your go-ahead.

---

## 📋 What's NOT done (nice-to-have, not blocking)

- **Post-save nurture email** when someone saves their itinerary but hasn't paid yet. Would live in a new workflow triggered by `wizard-complete` tag. Good for converting abandoners. ~20 min build when you want it.
- **PDF generation on the server side.** Currently the user downloads PDF via `html2pdf.js` client-side on the itinerary page. Fine for now; could move server-side for email attachment later.
- **AI enhancement layer.** The itinerary is still purely deterministic from the venue DB. Post-launch, can have an AI agent add editorial intros and per-day narrative. Adds maybe $0.10/itinerary and 5 sec generation time.
- **Wizard email capture at step 7.** Current flow captures on itinerary.html after generation. Either works; wizard-step capture might feel more natural.

---

## Campaign next step

Once the pipeline is live and smoke-tested, we can write the 2-week campaign plan (compressed from the 6-week one). Doesn't block — you can import the 6k list to GHL and queue the re-consent email without pipeline being live. But the "pay $50" CTA in those emails needs the pipeline working.

Let me know when you're back and I'll pick up wherever you are.
