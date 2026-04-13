// ============================================================
// REFERRAL PROGRAMME
// Give $10, get $10. Unique referral links, tracking, discount codes.
// ============================================================
const ReferralProgram = {
  STORAGE_KEY: 'referralData',

  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('referral-program')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const data = this._getData();
    const shareUrl = this._getShareUrl();

    container.innerHTML = `
      <div class="ref-widget">
        <div class="ref-hero">
          <div class="ref-hero__icon">🎁</div>
          <h3 class="ref-hero__title">Give $10, Get $10</h3>
          <p class="ref-hero__desc">Share your unique link with friends planning a London trip. When they purchase an itinerary, you both get $10 off.</p>
        </div>

        <div class="ref-stats">
          <div class="ref-stat">
            <div class="ref-stat__num">${data.referralsSent}</div>
            <div class="ref-stat__label">Links Shared</div>
          </div>
          <div class="ref-stat">
            <div class="ref-stat__num">${data.referralsConverted}</div>
            <div class="ref-stat__label">Friends Signed Up</div>
          </div>
          <div class="ref-stat">
            <div class="ref-stat__num">$${data.creditEarned}</div>
            <div class="ref-stat__label">Credit Earned</div>
          </div>
        </div>

        <div class="ref-share">
          <label class="ref-share__label">Your Referral Link</label>
          <div class="ref-share__row">
            <input type="text" class="ref-share__input" id="ref-url" value="${shareUrl}" readonly>
            <button class="btn btn--primary btn--small" id="ref-copy">Copy</button>
          </div>
        </div>

        <div class="ref-channels">
          <a href="https://wa.me/?text=${encodeURIComponent('Plan your London trip with this brilliant tool — and get $10 off! ' + shareUrl)}"
             target="_blank" rel="noopener" class="ref-channel ref-channel--whatsapp">WhatsApp</a>
          <a href="mailto:?subject=${encodeURIComponent('$10 off your London itinerary')}&body=${encodeURIComponent('Hey! I used this to plan my London trip and it was brilliant. Use my link and we both get $10 off: ' + shareUrl)}"
             class="ref-channel ref-channel--email">Email</a>
          <a href="https://x.com/intent/tweet?text=${encodeURIComponent('Planning a London trip? This tool is incredible — use my link for $10 off:')}&url=${encodeURIComponent(shareUrl)}"
             target="_blank" rel="noopener" class="ref-channel ref-channel--x">X / Twitter</a>
        </div>

        ${data.discountCode ? `
          <div class="ref-discount">
            <div class="ref-discount__label">Your Discount Code</div>
            <div class="ref-discount__code">${data.discountCode}</div>
            <p class="ref-discount__note">Apply at checkout for $${data.creditEarned} off your next itinerary</p>
          </div>
        ` : ''}

        <div class="ref-how">
          <h4>How It Works</h4>
          <div class="ref-steps">
            <div class="ref-step"><span class="ref-step__num">1</span><span>Share your unique link with friends</span></div>
            <div class="ref-step"><span class="ref-step__num">2</span><span>They get $10 off their first itinerary</span></div>
            <div class="ref-step"><span class="ref-step__num">3</span><span>You earn $10 credit when they purchase</span></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('ref-copy').addEventListener('click', () => {
      navigator.clipboard.writeText(shareUrl).then(() => {
        const btn = document.getElementById('ref-copy');
        btn.textContent = 'Copied!';
        this._trackShare('copy');
        setTimeout(() => btn.textContent = 'Copy', 2000);
      });
    });
  },

  _getData() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      return {
        referralCode: stored.referralCode || this._generateCode(),
        referralsSent: stored.referralsSent || 0,
        referralsConverted: stored.referralsConverted || 0,
        creditEarned: stored.creditEarned || 0,
        discountCode: stored.discountCode || null
      };
    } catch (e) {
      return { referralCode: this._generateCode(), referralsSent: 0, referralsConverted: 0, creditEarned: 0, discountCode: null };
    }
  },

  _generateCode() {
    const code = 'LONDON-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const data = this._getData();
    data.referralCode = code;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    return code;
  },

  _getShareUrl() {
    const data = this._getData();
    return (window.location.origin || 'https://londonplanned.com') + '/?ref=' + data.referralCode;
  },

  _trackShare(channel) {
    try {
      const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      data.referralsSent = (data.referralsSent || 0) + 1;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* ignore */ }
  },

  // Check for incoming referral code on page load
  checkIncoming() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('appliedReferral', ref);
    }
  }
};

// Check for incoming referral on every page
document.addEventListener('DOMContentLoaded', () => {
  if (typeof ReferralProgram !== 'undefined') ReferralProgram.checkIncoming();
});
