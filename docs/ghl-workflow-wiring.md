# GHL Workflow Wiring — Copy/Paste Blueprint

**Location ID:** `15PtxwoCpKZwf1QxFOX6`

Each workflow below has:
- **JSON spec** — canonical action list (reference, not a paste-able file)
- **GHL UI steps** — click-by-click instructions for the workflow builder

GHL does not support raw-JSON workflow import outside of Snapshots. Use the JSON as your blueprint while building in **Automation → Workflows → + New**.

For each **Send Email** step, the template must already exist in **Marketing → Emails → Templates** under the name shown (e.g. `LP - Free Guide Delivery`).

---

## PART 1 — Pre-Launch (wire now)

### 1. `LP - Lead Capture` (extend existing)

**Purpose:** Free-guide form → deliver PDF, warm the lead, transition them to the waitlist nurture after 7 days.

```json
{
  "workflow_name": "LP - Lead Capture",
  "status": "published",
  "trigger": {
    "type": "inbound_webhook",
    "url": "https://services.leadconnectorhq.com/hooks/15PtxwoCpKZwf1QxFOX6/webhook-trigger/bfa452dc-4423-40cc-86bb-e5e660108dc8",
    "expected_payload": { "email": "string", "firstName": "string", "source": "free-guide" }
  },
  "steps": [
    { "type": "create_or_update_contact", "match_on": "email", "fields": ["email", "first_name"] },
    { "type": "add_contact_tag", "tags": ["london-planned", "free-guide", "pre-launch"] },
    { "type": "send_email", "template": "LP - Free Guide Delivery" },
    { "type": "wait", "duration": "2 days" },
    { "type": "send_email", "template": "LP - Guide Follow-Up Teaser" },
    { "type": "wait", "duration": "5 days" },
    { "type": "add_contact_tag", "tags": ["waitlist"] }
  ]
}
```

**UI steps:**
1. Open `LP - Lead Capture` in the workflow builder.
2. After the existing Inbound Webhook trigger, click **+** to add actions in order:
   - **Create/Update Contact** — map `email` and `first_name` from webhook body.
   - **Add Contact Tag** → select all 3: `london-planned`, `free-guide`, `pre-launch`.
   - **Send Email** → template `LP - Free Guide Delivery`.
   - **Wait** → 2 days.
   - **Send Email** → `LP - Guide Follow-Up Teaser`.
   - **Wait** → 5 days.
   - **Add Contact Tag** → `waitlist` (this auto-triggers Welcome + Nurture).
3. **Save & Publish**.

---

### 2. `LP - Newsletter Opt-In` (extend existing)

**Purpose:** Footer email form → 3-tip sequence → transition to waitlist.

```json
{
  "workflow_name": "LP - Newsletter Opt-In",
  "status": "published",
  "trigger": { "type": "inbound_webhook", "expected_payload": { "email": "string", "source": "footer" } },
  "steps": [
    { "type": "create_or_update_contact", "match_on": "email", "fields": ["email"] },
    { "type": "add_contact_tag", "tags": ["london-planned", "newsletter", "pre-launch"] },
    { "type": "send_email", "template": "LP - Newsletter Tip 1" },
    { "type": "wait", "duration": "3 days" },
    { "type": "send_email", "template": "LP - Newsletter Tip 2" },
    { "type": "wait", "duration": "3 days" },
    { "type": "send_email", "template": "LP - Newsletter Tip 3" },
    { "type": "add_contact_tag", "tags": ["waitlist"] }
  ]
}
```

**UI steps:** same pattern as above — add actions under the existing webhook trigger; save & publish.

---

### 3. `LP - Partner Lead` (extend existing)

**Purpose:** B2B enquiry → auto-reply, opportunity creation, follow-up, lose after no response.

```json
{
  "workflow_name": "LP - Partner Lead",
  "status": "published",
  "trigger": { "type": "inbound_webhook", "expected_payload": {
    "email": "string", "firstName": "string", "companyName": "string", "phone": "string", "partnerType": "string", "travellerVolume": "number"
  }},
  "steps": [
    { "type": "create_or_update_contact", "match_on": "email",
      "fields": ["email", "first_name", "phone", "company_name", "partner_type", "traveller-volume"] },
    { "type": "add_contact_tag", "tags": ["london-planned", "partner-lead", "pre-launch"] },
    { "type": "add_contact_tag_from_field", "field": "partner_type",
      "map": {
        "Hotel": "partner-hotel", "Tour Operator": "partner-operator",
        "Airline": "partner-airline", "Rail": "partner-airline",
        "Travel Agent": "partner-agent", "Concierge": "partner-agent"
      } },
    { "type": "create_opportunity", "pipeline": "Partner Leads", "stage": "New Lead",
      "name": "{{contact.company_name}} — {{contact.partner_type}}" },
    { "type": "send_email", "template": "LP - Partner Auto-Reply" },
    { "type": "internal_notification", "channel": "email_and_sms", "message":
      "New partner lead: {{contact.company_name}} ({{contact.partner_type}}) — reply within 24h" },
    { "type": "wait", "duration": "3 days" },
    { "type": "send_email", "template": "LP - Partner Follow-Up" },
    { "type": "wait", "duration": "7 days" },
    { "type": "update_opportunity", "stage": "Lost" }
  ]
}
```

**UI steps:**
1. Inside webhook trigger, map the 6 inbound fields to contact fields.
2. Add actions in order above. For the **`add_contact_tag_from_field`** step, use GHL's "If / Else" branches — one per partner_type value — and add a specific `partner-*` tag inside each branch.
3. The internal notification step = **Send Internal Email** or **Send Internal SMS** inside GHL.
4. Save & Publish.

---

### 4. `LP - Weekly Waitlist Nurture` (NEW workflow)

**Purpose:** 8-touch educational sequence running alongside your existing 5-email Welcome arc. Triggered by the same `waitlist` tag but starts after a 7-day buffer so emails don't collide with Welcome.

```json
{
  "workflow_name": "LP - Weekly Waitlist Nurture",
  "status": "published",
  "trigger": { "type": "contact_tag_added", "tag": "waitlist" },
  "steps": [
    { "type": "wait", "duration": "7 days", "note": "lets LP - Waitlist Welcome run first" },
    { "type": "send_email", "template": "LP - Nurture W1 Neighbourhoods" },
    { "type": "wait", "duration": "7 days" },
    { "type": "send_email", "template": "LP - Nurture W2 Transport" },
    { "type": "wait", "duration": "7 days" },
    { "type": "send_email", "template": "LP - Nurture W3 10 Things" },
    { "type": "wait", "duration": "7 days" },
    { "type": "send_email", "template": "LP - Nurture W4 Seasonal" },
    { "type": "wait", "duration": "7 days" },
    { "type": "send_email", "template": "LP - Nurture W5 Food" },
    { "type": "wait", "duration": "7 days" },
    { "type": "send_email", "template": "LP - Nurture W6 Money" },
    { "type": "wait", "duration": "7 days" },
    { "type": "send_email", "template": "LP - Nurture W7 Hidden London" },
    { "type": "wait", "duration": "7 days" },
    { "type": "send_sms", "body": "Quick one — when are you planning your London trip? Reply with the year 🇬🇧" },
    { "type": "wait", "duration": "14 days" },
    { "type": "send_email", "template": "LP - Nurture W10 How AI Works" }
  ]
}
```

**UI steps:**
1. **+ New Workflow** → name `LP - Weekly Waitlist Nurture`.
2. Trigger: **Contact Tag Added** → `waitlist`.
3. Add each action in the order above. Imports needed: templates 05–12 from `/email-templates/`.
4. **Save & Publish**.

---

## PART 2 — Full Site Launch (build in DRAFT, activate at launch)

All below should be **saved as Draft** until `LAUNCH_MODE=live`. Don't publish early — they'll fire on existing pre-launch contacts.

### 5. `LP - Wizard Submission Pre-Purchase` (Workflow 11.1)

```json
{
  "workflow_name": "LP - Wizard Submission Pre-Purchase",
  "status": "draft",
  "trigger": {
    "type": "inbound_webhook",
    "note": "create this, paste URL into admin.html → Wizard Submission Webhook",
    "expected_payload": {
      "email": "string", "firstName": "string",
      "trip_length_days": "number", "trip_start": "date", "trip_end": "date",
      "beyond_london": "boolean", "uk_destinations": "array",
      "group_type": "string", "occasion": "string",
      "budget_accommodation": "string", "budget_food": "string", "budget_entertainment": "string",
      "interests": "array", "itinerary_tier": "string",
      "share_code": "string", "referred_by": "string"
    }
  },
  "steps": [
    { "type": "create_or_update_contact", "match_on": "email", "fields": "all_from_payload" },
    { "type": "add_contact_tag", "tags": ["london-planned", "post-launch"] },
    { "type": "add_contact_tag_from_field", "field": "group_type", "prefix": "group-" },
    { "type": "add_contact_tag_from_field", "field": "occasion", "prefix": "occasion-",
      "transform": "lowercase_kebab" },
    { "type": "add_contact_tag_from_field", "field": "budget_accommodation", "prefix": "budget-",
      "transform": "lowercase" },
    { "type": "add_contact_tag_from_array_field", "field": "interests", "prefix": "interest-",
      "transform": "lowercase" },
    { "type": "if_else", "condition": "{{contact.beyond_london}} == true",
      "true_branch": [{ "type": "add_contact_tag", "tags": ["uk-extension"] }] },
    { "type": "create_opportunity", "pipeline": "Customer Journey", "stage": "Prospect",
      "name": "{{contact.first_name}} — {{contact.trip_length_days}} days" },
    { "type": "send_email", "template": "LP - Wizard Preview" }
  ]
}
```

### 6. `LP - Abandoned Cart` (Workflow 11.2)

```json
{
  "workflow_name": "LP - Abandoned Cart",
  "status": "draft",
  "trigger": { "type": "contact_tag_added", "tag": "checkout-started" },
  "steps": [
    { "type": "wait", "duration": "1 hour" },
    { "type": "if_else", "condition": "has_tag('customer') == false", "true_branch": [
      { "type": "send_sms", "body": "Still planning London, {{contact.first_name}}? Your itinerary is one tap away — londonplanned.com/checkout" }
    ]},
    { "type": "wait", "duration": "23 hours" },
    { "type": "if_else", "condition": "has_tag('customer') == false", "true_branch": [
      { "type": "add_contact_tag", "tags": ["cart-abandoned"] },
      { "type": "send_email", "template": "LP - Cart Abandon 24h" }
    ]},
    { "type": "wait", "duration": "48 hours" },
    { "type": "if_else", "condition": "has_tag('customer') == false", "true_branch": [
      { "type": "send_email", "template": "LP - Cart Abandon 72h Final" }
    ]}
  ]
}
```

### 7. `LP - Post-Purchase` (Workflow 11.3)

```json
{
  "workflow_name": "LP - Post-Purchase",
  "status": "draft",
  "trigger": { "type": "stripe_payment_succeeded", "note": "GHL Stripe integration fires this when a product buy completes" },
  "steps": [
    { "type": "add_contact_tag", "tags": ["customer", "post-launch"] },
    { "type": "add_contact_tag_from_product", "map": {
      "London Short Stay Itinerary": ["itinerary-short"],
      "London Week Explorer Itinerary": ["itinerary-week"],
      "London Extended Adventure Itinerary": ["itinerary-extended"]
    }},
    { "type": "update_opportunity_stage_by_tag", "pipeline": "Customer Journey",
      "map": { "itinerary-short": "Customer - Short Stay",
               "itinerary-week": "Customer - Week Explorer",
               "itinerary-extended": "Customer - Extended" } },
    { "type": "send_email", "template": "LP - Purchase Confirmation" },
    { "type": "webhook", "method": "POST", "url": "https://londonplanned.com/.netlify/functions/trigger-itinerary-generation",
      "note": "fires your site to build the itinerary; you pass the contact ID and custom fields" },
    { "type": "wait_for_tag", "tag": "itinerary-delivered", "timeout": "1 hour" },
    { "type": "update_opportunity_stage", "stage": "Itinerary Delivered" },
    { "type": "send_email", "template": "LP - Itinerary Delivery" },
    { "type": "wait", "duration": "1 day" },
    { "type": "send_email", "template": "LP - Day 1 Post-Purchase Tips" },
    { "type": "wait", "duration": "1 day" },
    { "type": "send_email", "template": "LP - Affiliate Transfers & Insurance" },
    { "type": "wait", "duration": "2 days" },
    { "type": "send_email", "template": "LP - Affiliate Hotels & Rail" }
  ]
}
```

### 8. `LP - Pre-Trip Sequence` (Workflow 11.4)

```json
{
  "workflow_name": "LP - Pre-Trip Sequence",
  "status": "draft",
  "trigger": { "type": "custom_field_changed", "field": "trip_start",
    "note": "fires when trip_start is set; GHL handles the relative-date scheduling" },
  "steps": [
    { "type": "send_email_at", "offset": "-30 days from trip_start", "template": "LP - Pre-Trip 30 Days" },
    { "type": "send_email_at", "offset": "-14 days from trip_start", "template": "LP - Pre-Trip 14 Days Packing" },
    { "type": "send_sms_at", "offset": "-7 days from trip_start",
      "body": "🚇 One week to London! Pro tip: tap your contactless card at the airport Tube gate — no Oyster needed. Daily cap £8.50. You've got this!" },
    { "type": "send_email_at", "offset": "-2 days from trip_start", "template": "LP - Pre-Trip 2 Days" },
    { "type": "send_sms_at", "offset": "0 days from trip_start",
      "body": "You're in London, {{contact.first_name}}! 🇬🇧 Your itinerary: londonplanned.com/my-trips Download for offline use and have an incredible trip." },
    { "type": "add_contact_tag_at", "offset": "0 days from trip_start", "tags": ["trip-active"] }
  ]
}
```

### 9. `LP - Post-Trip` (Workflow 11.5)

```json
{
  "workflow_name": "LP - Post-Trip",
  "status": "draft",
  "trigger": { "type": "custom_field_changed", "field": "trip_end",
    "note": "OR: tag trip-complete added manually" },
  "steps": [
    { "type": "wait", "duration": "1 day" },
    { "type": "add_contact_tag", "tags": ["trip-complete"] },
    { "type": "update_opportunity_stage", "pipeline": "Customer Journey", "stage": "Trip Complete" },
    { "type": "send_email", "template": "LP - Post-Trip Review Request" },
    { "type": "add_contact_tag", "tags": ["review-requested"] },
    { "type": "wait", "duration": "2 days" },
    { "type": "send_email", "template": "LP - Post-Trip Referral Offer" },
    { "type": "wait", "duration": "2 days" },
    { "type": "if_else", "condition": "referral_link_clicked == false", "true_branch": [
      { "type": "send_sms", "body": "Loved London, {{contact.first_name}}? Give a friend $15 off, get $15 credit: londonplanned.com/refer/{{contact.share_code}}" }
    ]},
    { "type": "wait", "duration": "9 days" },
    { "type": "send_email", "template": "LP - Post-Trip Where Next" },
    { "type": "wait", "duration": "16 days" },
    { "type": "send_email", "template": "LP - Post-Trip Where Next",
      "note": "month-30 repeat; alternatively build as month-30 only if you want to skip day-14" }
  ]
}
```

### 10. `LP - Quiz Lead Sequence` (Workflow 11.6)

```json
{
  "workflow_name": "LP - Quiz Lead Sequence",
  "status": "draft",
  "trigger": { "type": "inbound_webhook", "expected_payload": {
    "email": "string", "firstName": "string", "traveller_type": "string" } },
  "steps": [
    { "type": "create_or_update_contact", "match_on": "email" },
    { "type": "add_contact_tag", "tags": ["quiz-lead", "post-launch"] },
    { "type": "add_contact_tag_from_field", "field": "traveller_type", "prefix": "traveller-",
      "transform": "lowercase" },
    { "type": "send_email", "template": "LP - Quiz Result" },
    { "type": "wait", "duration": "2 days" },
    { "type": "send_email", "template": "LP - Quiz Day 2 Tailored" },
    { "type": "wait", "duration": "3 days" },
    { "type": "send_email", "template": "LP - Quiz Day 5 Wizard CTA" }
  ]
}
```

### 11. `LP - Referral Reward` (Workflow 11.7)

```json
{
  "workflow_name": "LP - Referral Reward",
  "status": "draft",
  "trigger": { "type": "contact_tag_added", "tag": "customer",
    "condition": "contact.referred_by is not empty" },
  "steps": [
    { "type": "find_contact_by_field", "field": "share_code",
      "value": "{{triggering_contact.referred_by}}", "store_as": "referrer" },
    { "type": "update_contact_field", "contact": "{{referrer}}",
      "field": "referral_count", "operation": "increment", "amount": 1 },
    { "type": "if_else", "condition": "{{referrer.referral_count}} >= 3",
      "true_branch": [{ "type": "add_contact_tag", "contact": "{{referrer}}", "tags": ["vip-referrer"] }] },
    { "type": "update_opportunity", "contact": "{{referrer}}",
      "pipeline": "Customer Journey", "stage": "Repeat / Referrer" },
    { "type": "send_email", "contact": "{{referrer}}", "template": "LP - Referral Reward" },
    { "type": "send_sms", "contact": "{{referrer}}",
      "body": "🎉 Your friend just booked their London trip — your £15 credit is live. Check email for how to use it." }
  ]
}
```

### 12. `LP - Affiliate Click Follow-Up` (Workflow 11.8)

```json
{
  "workflow_name": "LP - Affiliate Click Follow-Up",
  "status": "draft",
  "trigger": { "type": "contact_tag_added", "tag": "affiliate-insurance" },
  "steps": [
    { "type": "wait", "duration": "3 days" },
    { "type": "if_else", "condition": "affiliate_conversion_recorded == false", "true_branch": [
      { "type": "send_email", "template": "LP - Affiliate Insurance Follow-Up" }
    ]}
  ],
  "note": "Duplicate this workflow for each of the 15 affiliate categories (trigger by tag: affiliate-hotel, affiliate-transfer, etc). Swap the template per category."
}
```

---

## Template name → file mapping

When you import the HTML files into GHL, use these exact names so the JSON specs above resolve:

| File in repo | GHL template name |
|---|---|
| `02-free-guide-delivery.html` | `LP - Free Guide Delivery` |
| `03-guide-follow-up-teaser.html` | `LP - Guide Follow-Up Teaser` |
| `04a-newsletter-tip-1.html` | `LP - Newsletter Tip 1` |
| `04b-newsletter-tip-2.html` | `LP - Newsletter Tip 2` |
| `04c-newsletter-tip-3.html` | `LP - Newsletter Tip 3` |
| `05-nurture-w1-neighbourhoods.html` | `LP - Nurture W1 Neighbourhoods` |
| `06-nurture-w2-transport.html` | `LP - Nurture W2 Transport` |
| `07-nurture-w3-10-things.html` | `LP - Nurture W3 10 Things` |
| `08-nurture-w4-seasonal.html` | `LP - Nurture W4 Seasonal` |
| `09-nurture-w5-food.html` | `LP - Nurture W5 Food` |
| `10-nurture-w6-money.html` | `LP - Nurture W6 Money` |
| `11-nurture-w7-hidden-london.html` | `LP - Nurture W7 Hidden London` |
| `12-nurture-w10-how-ai-works.html` | `LP - Nurture W10 How AI Works` |
| `13-partner-auto-reply.html` | `LP - Partner Auto-Reply` |
| `14-partner-follow-up.html` | `LP - Partner Follow-Up` |
| `15-wizard-preview.html` | `LP - Wizard Preview` |
| `16-cart-abandon-24h.html` | `LP - Cart Abandon 24h` |
| `17-cart-abandon-72h-final.html` | `LP - Cart Abandon 72h Final` |
| `18-purchase-confirmation.html` | `LP - Purchase Confirmation` |
| `19-itinerary-delivery.html` | `LP - Itinerary Delivery` |
| `20-day-1-post-purchase-tips.html` | `LP - Day 1 Post-Purchase Tips` |
| `21-affiliate-transfers-insurance.html` | `LP - Affiliate Transfers & Insurance` |
| `22-affiliate-hotels-rail.html` | `LP - Affiliate Hotels & Rail` |
| `23-pretrip-30-days.html` | `LP - Pre-Trip 30 Days` |
| `24-pretrip-14-days-packing.html` | `LP - Pre-Trip 14 Days Packing` |
| `25-pretrip-2-days.html` | `LP - Pre-Trip 2 Days` |
| `26-posttrip-review-request.html` | `LP - Post-Trip Review Request` |
| `27-posttrip-referral-offer.html` | `LP - Post-Trip Referral Offer` |
| `28-posttrip-where-next.html` | `LP - Post-Trip Where Next` |
| `29-quiz-result.html` | `LP - Quiz Result` |
| `30-quiz-day2-tailored.html` | `LP - Quiz Day 2 Tailored` |
| `31-quiz-day5-wizard-cta.html` | `LP - Quiz Day 5 Wizard CTA` |
| `32-referral-reward.html` | `LP - Referral Reward` |
| `33-affiliate-insurance-followup.html` | `LP - Affiliate Insurance Follow-Up` |

---

## Build order (recommended)

**Today:**
1. Import templates 02, 03, 04a, 04b, 04c (5 files)
2. Wire workflows 1 (Lead Capture), 2 (Newsletter Opt-In)

**Tomorrow:**
3. Import templates 05–12 (8 nurture files), 13, 14 (partner)
4. Build workflow 4 (Weekly Waitlist Nurture), wire workflow 3 (Partner Lead)

**Next week (drafts):**
5. Import templates 15–33 (19 files)
6. Build workflows 5–12 in DRAFT mode

**Launch day:**
7. Flip Part 2 workflow drafts → Published
8. Set `LAUNCH_MODE=live` in Netlify
