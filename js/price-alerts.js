// ============================================================
// PRICE DROP ALERTS
// Monitor prices, notify users of drops, email re-engagement
// ============================================================
const PriceAlerts = {
  STORAGE_KEY: 'priceAlerts',

  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('price-alerts')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const alerts = this._getAlerts();
    const watchlist = this._getWatchlist();

    container.innerHTML = `
      <div class="pa-widget">
        <div class="pa-header">
          <h3 class="pa-title">Price Drop Alerts</h3>
          <p class="pa-subtitle">We'll notify you when prices drop for your saved attractions, hotels, and experiences.</p>
        </div>

        ${this._renderSetupForm()}
        ${this._renderWatchlist(watchlist)}
        ${this._renderRecentDrops()}
        ${this._renderTips()}
      </div>
    `;

    // Wire up form
    const form = document.getElementById('pa-add-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this._addToWatchlist();
      });
    }
  },

  _renderSetupForm() {
    const email = localStorage.getItem('subscriberEmail') || '';
    return `
      <div class="pa-section">
        <h4>Get Notified</h4>
        <form id="pa-add-form" class="pa-form">
          <input type="email" id="pa-email" placeholder="Your email" value="${email}" required
            class="pa-input">
          <select id="pa-category" class="pa-select">
            <option value="hotels">Hotels</option>
            <option value="attractions">Attractions & Tours</option>
            <option value="flights">Flights</option>
            <option value="shows">Theatre & Shows</option>
          </select>
          <button type="submit" class="btn btn--primary btn--small">Watch Prices</button>
        </form>
      </div>`;
  },

  _renderWatchlist(watchlist) {
    if (!watchlist.length) {
      return `
        <div class="pa-section">
          <h4>Your Watchlist</h4>
          <p class="pa-empty">No items watched yet. Add categories above to get started.</p>
        </div>`;
    }

    return `
      <div class="pa-section">
        <h4>Your Watchlist (${watchlist.length})</h4>
        <div class="pa-list">
          ${watchlist.map((item, i) => `
            <div class="pa-item">
              <div class="pa-item__icon">${this._getCategoryIcon(item.category)}</div>
              <div class="pa-item__info">
                <strong>${this._getCategoryLabel(item.category)}</strong>
                <small>Watching since ${new Date(item.addedAt).toLocaleDateString()}</small>
              </div>
              <button class="pa-item__remove" onclick="PriceAlerts._removeFromWatchlist(${i})" title="Remove">&times;</button>
            </div>
          `).join('')}
        </div>
      </div>`;
  },

  _renderRecentDrops() {
    // Simulated price drops for demo purposes
    const drops = [
      { item: 'Tower of London Skip-the-Line', provider: 'GetYourGuide', was: '£29.90', now: '£24.90', savings: '17%', url: '#' },
      { item: 'London Eye Fast Track', provider: 'GetYourGuide', was: '£32.00', now: '£27.50', savings: '14%', url: '#' },
      { item: 'The Hoxton Southwark', provider: 'Booking.com', was: '£165/night', now: '£139/night', savings: '16%', url: '#' },
      { item: 'Wicked (West End)', provider: 'TodayTix', was: '£65', now: '£45', savings: '31%', url: '#' },
    ];

    return `
      <div class="pa-section">
        <h4>Recent Price Drops in London</h4>
        <div class="pa-drops">
          ${drops.map(d => `
            <div class="pa-drop">
              <div class="pa-drop__info">
                <strong>${d.item}</strong>
                <small>${d.provider}</small>
              </div>
              <div class="pa-drop__prices">
                <span class="pa-drop__was">${d.was}</span>
                <span class="pa-drop__now">${d.now}</span>
                <span class="pa-drop__savings">-${d.savings}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
  },

  _renderTips() {
    return `
      <div class="pa-section pa-tips">
        <h4>Booking Tips</h4>
        <ul>
          <li><strong>Book midweek:</strong> Hotels are 15-30% cheaper Tuesday-Thursday</li>
          <li><strong>Attractions:</strong> Online tickets are almost always cheaper than walk-up</li>
          <li><strong>Theatre:</strong> TKTS booth in Leicester Square sells same-day tickets up to 50% off</li>
          <li><strong>Flights:</strong> Cheapest 6-8 weeks before travel. Tuesday is typically the cheapest day to fly</li>
        </ul>
      </div>`;
  },

  _addToWatchlist() {
    const email = document.getElementById('pa-email').value;
    const category = document.getElementById('pa-category').value;
    if (!email) return;

    localStorage.setItem('subscriberEmail', email);
    const watchlist = this._getWatchlist();

    if (!watchlist.find(w => w.category === category)) {
      watchlist.push({ category, email, addedAt: new Date().toISOString() });
      localStorage.setItem(this.STORAGE_KEY + '_watchlist', JSON.stringify(watchlist));
    }

    // Re-render
    const container = document.querySelector('.pa-widget')?.parentElement;
    if (container) this.init(container);
  },

  _removeFromWatchlist(index) {
    const watchlist = this._getWatchlist();
    watchlist.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY + '_watchlist', JSON.stringify(watchlist));
    const container = document.querySelector('.pa-widget')?.parentElement;
    if (container) this.init(container);
  },

  _getAlerts() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
  },

  _getWatchlist() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY + '_watchlist') || '[]'); }
    catch (e) { return []; }
  },

  _getCategoryIcon(cat) {
    return { hotels: '🏨', attractions: '🎡', flights: '✈️', shows: '🎭' }[cat] || '📌';
  },

  _getCategoryLabel(cat) {
    return { hotels: 'Hotels', attractions: 'Attractions & Tours', flights: 'Flights', shows: 'Theatre & Shows' }[cat] || cat;
  }
};
