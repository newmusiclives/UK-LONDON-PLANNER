# London Planned — SMS copy (7 messages)

Paste these into the SMS step of each GHL workflow. All within 160 characters (single-segment, cheaper). Merge fields use GHL syntax: `{{contact.first_name}}`, `{{custom_field}}`.

---

## 1. Launch Day Broadcast
**Trigger:** Launch-day campaign to full waitlist
**Workflow:** Manual broadcast
**Length:** 119 chars

```
🇬🇧 London Planned is LIVE! Custom itineraries from $50. Your 40% waitlist code is in your inbox — londonplanned.com
```

---

## 2. Abandoned Cart 1h
**Trigger:** `checkout-started` tag + 1h no purchase
**Workflow:** 11.2 Abandoned Cart
**Length:** 98 chars

```
Still planning London, {{contact.first_name}}? Your itinerary is one tap away — londonplanned.com/checkout
```

---

## 3. Nurture Check-In (Week 8)
**Trigger:** Tag `waitlist` + 8 weeks on list
**Workflow:** 5.4 Weekly Waitlist Nurture, Week 8
**Length:** 79 chars

```
Quick one — when are you planning your London trip? Reply with the year 🇬🇧
```

---

## 4. Pre-Trip 7 Days
**Trigger:** `trip_start` − 7 days
**Workflow:** 11.4 Pre-Trip Sequence
**Length:** 131 chars

```
🚇 One week to London! Pro tip: tap your contactless card at the airport Tube gate — no Oyster needed. Daily cap £8.50. You've got this!
```

---

## 5. Arrival Day
**Trigger:** `trip_start` = today
**Workflow:** 11.4 Pre-Trip Sequence
**Length:** 138 chars

```
You're in London, {{contact.first_name}}! 🇬🇧 Your itinerary: londonplanned.com/my-trips Download for offline use and have an incredible trip.
```

---

## 6. Post-Trip Referral (Day 5)
**Trigger:** `trip-complete` + 5 days, no referral click
**Workflow:** 11.5 Post-Trip
**Length:** 137 chars

```
Loved London, {{contact.first_name}}? Give a friend $15 off, get $15 credit for your next trip: londonplanned.com/refer/{{contact.share_code}}
```

---

## 7. Referral Reward
**Trigger:** Referred contact converts (matches `share_code`)
**Workflow:** 11.7 Referral Reward
**Length:** 99 chars

```
🎉 Your friend just booked their London trip — your £15 credit is live. Check email for how to use it.
```

---

## Rules of thumb

- Keep under 160 chars to stay single-segment (cheapest send cost).
- Only one emoji per message — readability beats cuteness.
- Always include first name merge when the SMS feels personal.
- Always include a link when there's an action to take.
- Never send between 10pm and 7am local time — schedule in workflow.
