// ============================================================
// EMBEDDED BOOKING WIDGETS
// Renders affiliate search widgets inline on pages
// ============================================================
const BookingWidgets = {

  // GetYourGuide activity search widget
  renderGYGWidget(containerId, destination = 'London') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const partnerId = CONFIG.affiliateIds?.getYourGuide || '';
    const hasPartner = partnerId && !partnerId.includes('YOUR_');

    container.innerHTML = `
      <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:1.5rem;text-align:center;">
        <h4 style="margin-bottom:0.75rem;">🎟️ Book Attractions & Tours</h4>
        <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:1rem;">Skip-the-line tickets and guided tours for London's top attractions</p>
        <div style="display:flex;gap:0.5rem;max-width:500px;margin:0 auto;">
          <input type="text" id="gyg-search" value="${destination}" placeholder="Search attractions..."
            style="flex:1;padding:0.7rem 1rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:0.9rem;">
          <button class="btn btn--primary" onclick="BookingWidgets._searchGYG()">Search</button>
        </div>
        <div style="display:flex;gap:0.5rem;justify-content:center;margin-top:0.75rem;flex-wrap:wrap;">
          <button class="btn btn--outline btn--small" onclick="BookingWidgets._searchGYG('Tower of London')">Tower of London</button>
          <button class="btn btn--outline btn--small" onclick="BookingWidgets._searchGYG('Thames cruise')">Thames Cruise</button>
          <button class="btn btn--outline btn--small" onclick="BookingWidgets._searchGYG('London walking tour')">Walking Tours</button>
          <button class="btn btn--outline btn--small" onclick="BookingWidgets._searchGYG('Harry Potter London')">Harry Potter</button>
        </div>
      </div>
    `;
  },

  _searchGYG(query) {
    const input = document.getElementById('gyg-search');
    const q = query || input?.value || 'London';
    const partnerId = CONFIG.affiliateIds?.getYourGuide || '';
    const hasPartner = partnerId && !partnerId.includes('YOUR_');
    const url = hasPartner
      ? `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&partner_id=${partnerId}`
      : `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}`;
    window.open(url, '_blank');
    if (typeof Analytics !== 'undefined') Analytics.affiliateClick('getyourguide', q);
  },

  // Booking.com hotel search widget
  renderHotelWidget(containerId, city = 'London') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:1.5rem;text-align:center;">
        <h4 style="margin-bottom:0.75rem;">🏨 Find Your Perfect Hotel</h4>
        <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:1rem;">Compare prices across 1,000+ London hotels. Free cancellation on most rooms.</p>
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:0.5rem;max-width:550px;margin:0 auto;">
          <div style="text-align:left;">
            <label style="font-size:0.75rem;font-weight:600;display:block;margin-bottom:0.25rem;">Check-in</label>
            <input type="date" id="hotel-checkin" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:0.85rem;">
          </div>
          <div style="text-align:left;">
            <label style="font-size:0.75rem;font-weight:600;display:block;margin-bottom:0.25rem;">Check-out</label>
            <input type="date" id="hotel-checkout" style="width:100%;padding:0.6rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:0.85rem;">
          </div>
          <div style="display:flex;align-items:flex-end;">
            <button class="btn btn--primary" onclick="BookingWidgets._searchHotels('${city}')">Search</button>
          </div>
        </div>
      </div>
    `;

    // Pre-fill dates from travel dates if available
    const state = typeof State !== 'undefined' ? State.get() : {};
    if (state.travelDates?.start) document.getElementById('hotel-checkin').value = state.travelDates.start;
    if (state.travelDates?.end) document.getElementById('hotel-checkout').value = state.travelDates.end;
  },

  _searchHotels(city) {
    const checkin = document.getElementById('hotel-checkin')?.value || '';
    const checkout = document.getElementById('hotel-checkout')?.value || '';
    const aid = CONFIG.affiliateIds?.booking || '';
    const hasAid = aid && !aid.includes('YOUR_');

    let url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city + ', United Kingdom')}`;
    if (checkin) url += `&checkin=${checkin}`;
    if (checkout) url += `&checkout=${checkout}`;
    if (hasAid) url += `&aid=${aid}`;

    window.open(url, '_blank');
    if (typeof Analytics !== 'undefined') Analytics.affiliateClick('booking', city);
  },

  // Skyscanner flight search widget
  renderFlightWidget(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:1.5rem;text-align:center;">
        <h4 style="margin-bottom:0.75rem;">✈️ Find Cheap Flights to London</h4>
        <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:1rem;">Compare 100+ airlines for the best deals to all 5 London airports</p>
        <div style="display:flex;gap:0.5rem;max-width:500px;margin:0 auto;flex-wrap:wrap;justify-content:center;">
          <input type="text" id="flight-from" placeholder="Flying from (e.g. New York)"
            style="flex:1;min-width:200px;padding:0.7rem 1rem;border:2px solid var(--color-border);border-radius:var(--radius-md);font-size:0.9rem;">
          <button class="btn btn--primary" onclick="BookingWidgets._searchFlights()">Search Flights</button>
        </div>
      </div>
    `;
  },

  _searchFlights() {
    const from = document.getElementById('flight-from')?.value || '';
    const url = `https://www.skyscanner.net/transport/flights/${encodeURIComponent(from)}/lond/`;
    window.open(url, '_blank');
    if (typeof Analytics !== 'undefined') Analytics.affiliateClick('skyscanner', 'flights');
  },

  // Compact inline booking CTA (for use within itinerary activities)
  renderInlineBooking(activity) {
    if (!activity.affiliateUrl) return '';
    const provider = typeof AffiliateLinks !== 'undefined' ? AffiliateLinks.detect(activity.affiliateUrl) : 'unknown';
    return `
      <div class="activity__cta">
        <a href="${typeof AffiliateLinks !== 'undefined' ? AffiliateLinks.auto(activity.affiliateUrl) : activity.affiliateUrl}"
          target="_blank" rel="noopener" class="affiliate-cta"
          onclick="if(typeof Analytics!=='undefined')Analytics.affiliateClick('${provider}','${activity.name.replace(/'/g, '')}')">
          ${activity.affiliateLabel || 'Book Now'} →
        </a>
      </div>
    `;
  }
};
