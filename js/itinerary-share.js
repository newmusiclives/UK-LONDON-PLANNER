// ============================================================
// ITINERARY SHARING & SOCIAL
// Shareable URLs, WhatsApp/email/social share, copy link
// ============================================================
const ItineraryShare = {
  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('itinerary-share')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const shareId = this._getOrCreateShareId();
    const shareUrl = window.location.origin + '/itinerary.html?share=' + shareId;
    const itinerary = typeof State !== 'undefined' ? State.getItinerary() : null;
    const title = itinerary?.title || 'My London Itinerary';
    const days = itinerary?.days?.length || '5';
    const message = `Check out my ${days}-day London itinerary planned with London & UK Planner!`;

    container.innerHTML = `
      <div class="is-widget">
        <h3 class="is-title">Share Your Itinerary</h3>
        <p class="is-subtitle">Let friends and family see your trip plans</p>

        <div class="is-link-row">
          <input type="text" class="is-link-input" id="is-share-url" value="${shareUrl}" readonly>
          <button class="btn btn--primary btn--small" id="is-copy-btn">Copy</button>
        </div>

        <div class="is-buttons">
          <a href="https://wa.me/?text=${encodeURIComponent(message + ' ' + shareUrl)}"
             target="_blank" rel="noopener" class="is-btn is-btn--whatsapp">
            WhatsApp
          </a>
          <a href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message + '\n\n' + shareUrl)}"
             class="is-btn is-btn--email">
            Email
          </a>
          <a href="https://x.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(shareUrl)}"
             target="_blank" rel="noopener" class="is-btn is-btn--x">
            X / Twitter
          </a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}"
             target="_blank" rel="noopener" class="is-btn is-btn--facebook">
            Facebook
          </a>
        </div>

        <div class="is-preview">
          <div class="is-preview__label">Preview card</div>
          <div class="is-preview__card">
            <div class="is-preview__icon">🇬🇧</div>
            <div class="is-preview__info">
              <strong>${title}</strong>
              <span>${days} days in London — planned with London & UK Planner</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('is-copy-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(shareUrl).then(() => {
        const btn = document.getElementById('is-copy-btn');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
      });
    });

    // Save itinerary to localStorage keyed by shareId for public preview
    if (itinerary) {
      localStorage.setItem('sharedItinerary_' + shareId, JSON.stringify({
        title, days: itinerary.days?.length, interests: itinerary.interests,
        neighbourhoods: [...new Set((itinerary.days || []).flatMap(d => d.neighbourhoods || []))].slice(0, 6),
        createdAt: new Date().toISOString()
      }));
    }
  },

  _getOrCreateShareId() {
    let id = localStorage.getItem('itineraryShareId');
    if (!id) {
      id = 'lp-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 6);
      localStorage.setItem('itineraryShareId', id);
    }
    return id;
  },

  // Render a public preview when someone visits with ?share= param
  renderPublicPreview(containerId) {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get('share');
    if (!shareId) return false;

    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return false;

    const data = localStorage.getItem('sharedItinerary_' + shareId);
    if (!data) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem;">
          <h2>Shared Itinerary</h2>
          <p style="color:var(--color-text-muted);">This itinerary link may have expired or is only viewable on the device that created it.</p>
          <a href="wizard.html" class="btn btn--primary" style="margin-top:1rem;">Create Your Own Itinerary</a>
        </div>`;
      return true;
    }

    const trip = JSON.parse(data);
    container.innerHTML = `
      <div style="text-align:center;padding:3rem;">
        <div style="font-size:3rem;margin-bottom:1rem;">🇬🇧</div>
        <h2>${trip.title || 'London Itinerary'}</h2>
        <p style="color:var(--color-text-muted);margin-bottom:1rem;">${trip.days || 5} days exploring London</p>
        ${trip.neighbourhoods ? '<div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;margin-bottom:1.5rem;">' + trip.neighbourhoods.map(n => '<span class="badge badge--accent">' + n + '</span>').join('') + '</div>' : ''}
        <p style="color:var(--color-text-muted);font-size:0.9rem;margin-bottom:2rem;">Want your own personalised London itinerary? We'll plan every day, recommend the best restaurants, attractions, and hidden gems.</p>
        <a href="wizard.html" class="btn btn--primary btn--large">Plan My Own Trip</a>
      </div>`;
    return true;
  }
};
