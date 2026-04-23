// js/itinerary-delivery.js
// Renders a "Save & email my itinerary" CTA onto itinerary.html when the page
// loaded a locally-generated itinerary but no ?token= param (i.e. this is a
// fresh wizard run that hasn't been persisted to the server yet).
//
// Posts the itinerary to /api/submit-itinerary, receives back a token, and
// updates the URL so future visits (and the purchase flow) can resolve to
// the same stored itinerary.

const ItineraryDelivery = (() => {
  let mounted = false;

  function mountSaveCta(itinerary) {
    if (mounted) return;
    mounted = true;

    const main = document.querySelector('.main');
    if (!main) return;

    const existingHeader = main.querySelector('.itinerary-header');
    const card = document.createElement('div');
    card.id = 'itinerary-save-card';
    card.style.cssText = 'background:#fff;border:2px solid #C9A84C;border-radius:12px;padding:1.5rem 2rem;margin:0 0 2rem;max-width:900px;margin-left:auto;margin-right:auto;';
    card.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:1rem;flex-wrap:wrap;">
        <div style="flex:1;min-width:260px;">
          <h3 style="margin:0 0 0.5rem;color:#1B2A4A;">📧 Save this itinerary to your inbox</h3>
          <p style="margin:0;color:#4b5563;font-size:0.95rem;">Enter your email and we'll save your plan so you can come back to it anytime — and unlock the full itinerary for just $${State.getPrice(itinerary.tripDays)}.</p>
        </div>
        <form id="itinerary-save-form" style="display:grid;gap:0.5rem;min-width:260px;flex:1;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
            <input type="text" id="save-first-name" placeholder="First name" required
              style="padding:0.65rem 0.85rem;border:2px solid #e5e7eb;border-radius:8px;font-size:0.95rem;">
            <input type="text" id="save-last-name" placeholder="Last name"
              style="padding:0.65rem 0.85rem;border:2px solid #e5e7eb;border-radius:8px;font-size:0.95rem;">
          </div>
          <input type="email" id="save-email" placeholder="you@example.com" required
            style="padding:0.65rem 0.85rem;border:2px solid #e5e7eb;border-radius:8px;font-size:0.95rem;">
          <button type="submit" class="btn btn--primary" style="width:100%;">Save my itinerary</button>
          <div id="save-status" style="font-size:0.85rem;color:#6b7280;min-height:1em;"></div>
        </form>
      </div>
    `;

    if (existingHeader) {
      existingHeader.parentNode.insertBefore(card, existingHeader.nextSibling);
    } else {
      main.prepend(card);
    }

    document.getElementById('itinerary-save-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      const status = document.getElementById('save-status');
      btn.disabled = true;
      btn.textContent = 'Saving…';
      status.textContent = '';

      const firstName = document.getElementById('save-first-name').value.trim();
      const lastName  = document.getElementById('save-last-name').value.trim();
      const email     = document.getElementById('save-email').value.trim();

      const tier = State.getPriceTier(itinerary.tripDays);

      try {
        const res = await fetch('/api/submit-itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            firstName,
            lastName,
            tier,
            shareCode: localStorage.getItem('lp_share_code') || '',
            referredBy: localStorage.getItem('lp_referred_by') || '',
            itinerary,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.token) {
          throw new Error(data.error || `HTTP ${res.status}`);
        }

        // Swap URL to include the token so refreshes hit the server copy
        const url = new URL(window.location.href);
        url.searchParams.set('token', data.token);
        history.replaceState({}, '', url.toString());

        // Save email + firstName to state so the purchase click can prefill
        // the GHL checkout form and keep contact matching reliable.
        if (typeof State !== 'undefined' && State.save) {
          State.save({ email, firstName, lastName });
        }

        btn.textContent = 'Saved ✓';
        status.innerHTML = '<span style="color:#059669;">Itinerary saved. We\'ve also emailed you a link — check your inbox.</span>';

        // Tuck the CTA away after a successful save
        setTimeout(() => {
          const c = document.getElementById('itinerary-save-card');
          if (c) c.style.display = 'none';
        }, 3000);
      } catch (err) {
        console.warn('save itinerary failed:', err);
        btn.disabled = false;
        btn.textContent = 'Save my itinerary';
        status.innerHTML = '<span style="color:#dc2626;">Couldn\'t save right now. Please try again or continue without saving.</span>';
      }
    });
  }

  return { mountSaveCta };
})();
