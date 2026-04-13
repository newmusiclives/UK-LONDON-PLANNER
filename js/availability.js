// ============================================================
// REAL-TIME AVAILABILITY
// Live availability indicators, urgency cues, book-now buttons
// ============================================================
const Availability = {
  CACHE_KEY: 'availabilityCache',
  CACHE_TTL: 30 * 60 * 1000, // 30 minutes

  init() {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('real-time-availability')) return;
    this._enhanceActivityCards();
  },

  _enhanceActivityCards() {
    // Find all activity cards on itinerary/demo pages and add availability indicators
    document.querySelectorAll('.activity').forEach(card => {
      const name = card.querySelector('.activity__name');
      if (!name) return;
      const venueName = name.textContent.trim();
      const availability = this._getAvailability(venueName);

      const indicator = document.createElement('div');
      indicator.className = 'av-indicator';
      indicator.innerHTML = this._renderIndicator(availability);

      const details = card.querySelector('.activity__details');
      if (details) details.appendChild(indicator);
    });
  },

  _getAvailability(venueName) {
    // Check cache first
    const cached = this._getCache(venueName);
    if (cached) return cached;

    // Simulate availability data (in production, this would call affiliate APIs)
    const availability = this._simulateAvailability(venueName);
    this._setCache(venueName, availability);
    return availability;
  },

  _simulateAvailability(venueName) {
    // Realistic simulated data based on venue type patterns
    const hash = venueName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const spotsLeft = (hash % 30) + 1;
    const hasDiscount = hash % 4 === 0;
    const discount = hasDiscount ? (5 + (hash % 20)) : 0;

    let status, urgency;
    if (spotsLeft <= 5) {
      status = 'limited';
      urgency = `Only ${spotsLeft} spots left today!`;
    } else if (spotsLeft <= 15) {
      status = 'available';
      urgency = 'Good availability';
    } else {
      status = 'plenty';
      urgency = 'Widely available';
    }

    return {
      status,
      urgency,
      spotsLeft,
      hasDiscount,
      discount: discount ? `${discount}% off online` : null,
      bookable: true,
      lastChecked: new Date().toISOString()
    };
  },

  _renderIndicator(av) {
    if (!av) return '';

    const statusColors = {
      limited: '#E74C3C',
      available: '#2ECC71',
      plenty: '#95a5a6'
    };

    const color = statusColors[av.status] || '#95a5a6';
    let html = `<span class="av-dot" style="background:${color};"></span>`;
    html += `<span class="av-text" style="color:${color};font-size:0.78rem;font-weight:600;">${av.urgency}</span>`;

    if (av.hasDiscount && av.discount) {
      html += `<span class="av-discount">${av.discount}</span>`;
    }

    return html;
  },

  // Render a standalone availability widget for a venue
  renderWidget(containerId, venueName, bookingUrl) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('real-time-availability')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const av = this._getAvailability(venueName);

    container.innerHTML = `
      <div class="av-widget ${av.status === 'limited' ? 'av-widget--urgent' : ''}">
        <div class="av-widget__status">
          <span class="av-dot av-dot--lg" style="background:${av.status === 'limited' ? '#E74C3C' : '#2ECC71'};"></span>
          <span class="av-widget__text">${av.urgency}</span>
        </div>
        ${av.hasDiscount ? `<div class="av-widget__discount">${av.discount}</div>` : ''}
        ${bookingUrl ? `<a href="${bookingUrl}" target="_blank" rel="noopener" class="btn btn--primary btn--small">Book Now</a>` : ''}
        <small class="av-widget__updated">Last checked: just now</small>
      </div>
    `;
  },

  _getCache(key) {
    try {
      const cache = JSON.parse(sessionStorage.getItem(this.CACHE_KEY) || '{}');
      const entry = cache[key];
      if (entry && Date.now() - entry.timestamp < this.CACHE_TTL) return entry.data;
    } catch (e) { /* ignore */ }
    return null;
  },

  _setCache(key, data) {
    try {
      const cache = JSON.parse(sessionStorage.getItem(this.CACHE_KEY) || '{}');
      cache[key] = { data, timestamp: Date.now() };
      sessionStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (e) { /* ignore */ }
  }
};

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof Availability !== 'undefined') Availability.init();
  }, 300);
});
