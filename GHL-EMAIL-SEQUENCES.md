# GoHighLevel Email & SMS Sequence Templates

Set these up as Workflows in your GoHighLevel account (Automation > Workflows).

---

## 1. Free Preview Abandonment Sequence
**Trigger:** Webhook — itinerary generated but no purchase within 24 hours

### Email 1 — 24 hours after generation
**Subject:** Your London itinerary is waiting...
**Body:**
Hi {{contact.first_name}},

You created a personalised {{custom.trip_days}}-day London itinerary yesterday — and it looked incredible!

Your first 2 days are ready to view, but there are {{custom.remaining_days}} more days packed with insider tips, hidden gems, and restaurant picks waiting to be unlocked.

[View My Itinerary] → link to itinerary.html

Unlock your full guide from just $20.

Cheers,
The London & UK Planner Team

### Email 2 — 72 hours (if no purchase)
**Subject:** Still planning your London trip?
**Body:**
Hi {{contact.first_name}},

Quick reminder — your personalised London itinerary is still saved and ready.

Here's what you'll get when you unlock:
- All {{custom.trip_days}} days with morning, afternoon & evening plans
- Restaurant & pub recommendations with booking links
- Interactive map showing all your activities
- Downloadable PDF guide
- Smart packing list

Don't let your perfect trip slip away!

[Unlock My Full Itinerary] → link

---

## 2. Post-Purchase Welcome Sequence
**Trigger:** Webhook — itinerary purchase completed

### Email 1 — Immediately
**Subject:** Your London itinerary is unlocked! 🎉
**Body:**
Hi {{contact.first_name}},

Your {{custom.trip_days}}-day London itinerary is now fully unlocked!

Here's what to do next:
1. **View your itinerary** — [Open Itinerary]
2. **Download the PDF** — take it offline
3. **Check the interactive map** — see all your activities plotted
4. **Consider our Booking Concierge ($150)** — we'll handle all your reservations

Need any changes? Reply to this email and our team will help.

### Email 2 — 3 days later
**Subject:** 5 things to do before your London trip
**Body:**
1. **Book restaurants** — popular spots fill up fast, especially for dinner
2. **Buy theatre tickets** — West End shows sell out weeks ahead
3. **Get an Oyster card app** — or just use contactless payment
4. **Download Citymapper** — the best transport app for London
5. **Check your packing list** — we generated one based on your interests

[View Packing List] → link

### Email 3 — 7 days before trip (if travel dates set)
**Subject:** 1 week to London! Here's your prep checklist
**Body:**
Your trip is just 7 days away! Here's your final checklist:

☐ Passport valid for 6+ months
☐ Travel insurance sorted
☐ Restaurant reservations confirmed
☐ Theatre tickets booked
☐ UK power adapter packed (Type G)
☐ Oyster card / contactless ready
☐ Itinerary PDF downloaded to phone
☐ Weather checked for London next week

[View Your Itinerary] → link

---

## 3. Concierge Upsell Sequence
**Trigger:** 48 hours after itinerary purchase (if concierge not purchased)

### Email 1
**Subject:** Want us to handle all your London bookings?
**Body:**
Hi {{contact.first_name}},

Now that you have your itinerary, there's a lot of booking to do — restaurants, attractions, theatre tickets, tours...

Our **Booking Concierge ($150)** handles it all for you:
✓ We book every restaurant, attraction & experience
✓ Theatre ticket purchasing
✓ Hotel reservation assistance
✓ If anything's unavailable, we find the best alternative
✓ You get a confirmation email with all booking references

Save hours of research and booking. We know the tricks to get tables at fully-booked restaurants.

[Add Booking Concierge — $150] → link

---

## 4. Email Capture / Lead Nurture Sequence
**Trigger:** Footer or blog email signup

### Email 1 — Immediately
**Subject:** Welcome! Here are your 3 London insider tips
**Body:**
Thanks for joining! Here are tips most tourists never discover:

**1. The Free Museum Trick**
London's best museums are free (British Museum, Tate Modern, V&A, Natural History Museum). But donate £5 and you can skip the suggested donation queue.

**2. The £1.75 Sightseeing Tour**
Take the number 11 bus from Liverpool Street to Fulham Broadway. It passes St Paul's, the Strand, Trafalgar Square, Westminster, and the Houses of Parliament. Better than a £35 tour bus.

**3. The Secret to Getting Theatre Tickets**
The TKTS booth in Leicester Square sells same-day West End tickets at up to 50% off. Arrive at 10am for the best selection.

Want a personalised itinerary? [Plan My Trip — From $20]

### Email 2 — 3 days later
**Subject:** The best London neighbourhoods (and which one suits you)
**Body:**
London has 32 boroughs and hundreds of distinct neighbourhoods. Here's which ones match your travel style...

[Read the full guide] → neighbourhood guide page

### Email 3 — 7 days later
**Subject:** London's best-kept food secret
**Body:**
Most tourists eat in the West End and pay twice what they should. London's real food scene is in...

[Read the food guide] → blog food guide page

---

## 5. Post-Trip Review Request
**Trigger:** 2 days after trip end date (if travel dates set)

### Email 1
**Subject:** How was London? 🇬🇧
**Body:**
Welcome back, {{contact.first_name}}!

We'd love to hear about your trip. Your feedback helps us improve our itineraries for future travellers.

[Leave a Review] → link to review page

### SMS (if phone provided)
"Hi {{contact.first_name}}! Hope you had an amazing time in London 🇬🇧 We'd love a quick review: [link]"

---

## 6. Consultation Follow-Up
**Trigger:** Consultation form submission

### Email 1 — Immediately
**Subject:** Your consultation request is confirmed!
**Body:**
Thanks for booking a personal planning session! We'll be in touch within 24 hours to confirm your time slot.

### SMS — Immediately
"Thanks for booking your London planning session! We'll confirm your slot within 24 hours. Reply with any questions."

### Email 2 — 24 hours before session
**Subject:** Your London planning session is tomorrow!
**Body:**
Quick reminder: your 1-hour video consultation is tomorrow at {{custom.datetime}}.

Have your questions ready — we'll cover everything from restaurant bookings to hidden gems.

---

## Setup Notes
- All webhook URLs go in Admin Panel > Integrations > GoHighLevel
- Use "Contact Tag" triggers in GHL to segment customers
- Tags used: london-planner, lead, customer, itinerary-buyer, concierge, consultation
- Custom fields needed: trip_days, remaining_days, trip_start_date, occasion, group_type
