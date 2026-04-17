// ============================================================
// TRIP BUDDY — Post-purchase referral engine
// Supersedes the legacy Referral module when 'growth-trip-buddy' is on.
// Renders a share panel with unique code (persisted across waitlist → purchase),
// and pushes referrer attribution into GHL via the waitlist webhook.
// Loads on success.html (and any page with #trip-buddy-mount).
// ============================================================
(function () {
  'use strict';

  const FLAG = 'growth-trip-buddy';

  function flagOn() {
    try { return typeof FeatureFlags !== 'undefined' && FeatureFlags.isEnabled(FLAG); }
    catch (_) { return false; }
  }

  function shareCode() {
    try { return typeof ShareCodes !== 'undefined' ? ShareCodes.mine() : ''; } catch (_) { return ''; }
  }

  function shareUrl(code) {
    try { return typeof ShareCodes !== 'undefined' ? ShareCodes.shareUrl(code) : (location.origin + '/?ref=' + code); }
    catch (_) { return location.origin + '/?ref=' + code; }
  }

  function render(host) {
    const code = shareCode();
    const url = shareUrl(code);
    const msg = encodeURIComponent('I just booked my London trip with London Planned — use my link for 20% off:');

    host.innerHTML = `
      <section class="section" style="padding: 2rem 0 3rem;">
        <div class="container" style="max-width: 620px;">
          <div class="card" style="padding: 2rem;">
            <div style="text-align:center; margin-bottom:1.25rem;">
              <div style="display:inline-block; padding: 0.35rem 0.9rem; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #C9A84C; background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.4); border-radius: 999px;">Trip Buddy</div>
              <h3 style="margin: 0.75rem 0 0.4rem; font-family: 'Playfair Display', serif;">Refer friends, earn £20 per booking</h3>
              <p style="margin: 0; color: var(--color-text-muted); font-size: 0.95rem;">
                Your unique link gives friends <strong style="color:#C9A84C">20% off</strong> any itinerary.
                When they buy, you earn a <strong style="color:#C9A84C">£20 voucher</strong> — redeemable against bookings, tours, or experiences.
              </p>
            </div>

            <div style="display:flex; gap:0.5rem; margin-bottom: 1rem;">
              <input id="tb-url" type="text" readonly value="${url}"
                style="flex:1; padding: 0.75rem 0.9rem; font-family: ui-monospace, monospace; font-size: 0.9rem; border: 2px solid var(--color-border); border-radius: var(--radius-md); background: #f8f9fa;">
              <button id="tb-copy" class="btn btn--primary" style="white-space: nowrap;">Copy</button>
            </div>

            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1.25rem;">
              <a href="https://wa.me/?text=${msg}%20${encodeURIComponent(url)}" target="_blank" rel="noopener" class="btn btn--outline" style="text-align:center;">WhatsApp</a>
              <a href="https://x.com/intent/tweet?text=${msg}&url=${encodeURIComponent(url)}" target="_blank" rel="noopener" class="btn btn--outline" style="text-align:center;">X</a>
              <a href="mailto:?subject=${encodeURIComponent('20% off your London trip')}&body=${msg}%0A%0A${encodeURIComponent(url)}" class="btn btn--outline" style="text-align:center;">Email</a>
              <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener" class="btn btn--outline" style="text-align:center;">Facebook</a>
            </div>

            <p style="font-size:0.78rem; color: var(--color-text-muted); text-align:center; margin: 0;">
              Your referral code: <strong>${code}</strong> &middot; Vouchers are tracked in your account and paid out within 7 days of the friend's trip completion.
            </p>
          </div>
        </div>
      </section>
    `;

    const btn = host.querySelector('#tb-copy');
    const input = host.querySelector('#tb-url');
    btn.addEventListener('click', function () {
      input.select();
      input.setSelectionRange(0, 99999);
      try {
        if (navigator.clipboard) navigator.clipboard.writeText(input.value);
        else document.execCommand('copy');
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1800);
      } catch (_) {}
    });
  }

  function hideLegacyReferralBlock() {
    // When Trip Buddy takes over, hide the older Referral section so we don't duplicate.
    const legacy = document.getElementById('referral-url');
    if (legacy) {
      let node = legacy;
      while (node && node.tagName !== 'SECTION') node = node.parentElement;
      if (node) node.style.display = 'none';
    }
  }

  function init() {
    if (!flagOn()) return;

    let host = document.getElementById('trip-buddy-mount');
    if (!host) {
      // Auto-mount on success.html even without an explicit mount point.
      const main = document.querySelector('main') || document.body;
      host = document.createElement('div');
      host.id = 'trip-buddy-mount';
      main.appendChild(host);
    }

    hideLegacyReferralBlock();
    render(host);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
