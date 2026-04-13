// ============================================================
// TRIP COUNTDOWN & PACKING LIST
// Post-purchase: countdown timer, weather-aware packing checklist,
// travel document reminders, currency converter quick widget
// ============================================================
const TripCountdown = {
  _rendered: false,

  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('trip-countdown')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container || this._rendered) return;
    this._rendered = true;

    const state = typeof State !== 'undefined' ? State.get() : {};
    const dates = state.travelDates || {};
    const startDate = dates.start ? new Date(dates.start) : null;
    const tripDays = state.tripDays || 5;

    container.innerHTML = `
      <div class="tc-widget">
        ${this._renderCountdown(startDate)}
        ${this._renderPackingList(startDate)}
        ${this._renderDocChecklist()}
        ${this._renderQuickCurrency()}
      </div>
    `;

    if (startDate) this._startTimer(startDate);
  },

  _renderCountdown(startDate) {
    if (!startDate) {
      return `
        <div class="tc-section tc-countdown">
          <h3 class="tc-title">Your London Trip</h3>
          <p class="tc-subtitle">Set your travel dates in the wizard to see a live countdown!</p>
          <a href="wizard.html" class="btn btn--small btn--primary">Set Travel Dates</a>
        </div>`;
    }

    const now = new Date();
    const diff = startDate - now;
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

    let message = '';
    if (days === 0) message = "Today's the day! Have an incredible trip!";
    else if (days === 1) message = 'Tomorrow you fly! Double-check everything below.';
    else if (days <= 7) message = `Nearly there! ${days} days until London.`;
    else if (days <= 30) message = `${days} days to go. Time to start planning the details.`;
    else message = `${days} days until your London adventure begins.`;

    return `
      <div class="tc-section tc-countdown">
        <h3 class="tc-title">Countdown to London</h3>
        <div class="tc-timer" id="tc-timer">
          <div class="tc-timer__unit"><span class="tc-timer__num" id="tc-days">${days}</span><span class="tc-timer__label">days</span></div>
          <div class="tc-timer__unit"><span class="tc-timer__num" id="tc-hours">0</span><span class="tc-timer__label">hours</span></div>
          <div class="tc-timer__unit"><span class="tc-timer__num" id="tc-mins">0</span><span class="tc-timer__label">mins</span></div>
          <div class="tc-timer__unit"><span class="tc-timer__num" id="tc-secs">0</span><span class="tc-timer__label">secs</span></div>
        </div>
        <p class="tc-message">${message}</p>
      </div>`;
  },

  _startTimer(startDate) {
    const update = () => {
      const now = new Date();
      const diff = Math.max(0, startDate - now);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const el = (id) => document.getElementById(id);
      if (el('tc-days')) el('tc-days').textContent = d;
      if (el('tc-hours')) el('tc-hours').textContent = h;
      if (el('tc-mins')) el('tc-mins').textContent = m;
      if (el('tc-secs')) el('tc-secs').textContent = s;
    };
    update();
    setInterval(update, 1000);
  },

  _renderPackingList(startDate) {
    const month = startDate ? startDate.getMonth() : new Date().getMonth();
    const seasonal = this._getSeasonalItems(month);

    const essentials = [
      { text: 'Passport / ID', icon: '🛂' },
      { text: 'Travel insurance documents', icon: '📋' },
      { text: 'Flight / train tickets (digital or print)', icon: '✈️' },
      { text: 'Hotel confirmation', icon: '🏨' },
      { text: 'Oyster card or contactless payment', icon: '💳' },
      { text: 'Phone charger + UK adapter (Type G)', icon: '🔌' },
      { text: 'Portable battery pack', icon: '🔋' },
      { text: 'Comfortable walking shoes', icon: '👟' },
      { text: 'Day bag / small backpack', icon: '🎒' },
      { text: 'Medications & prescriptions', icon: '💊' },
    ];

    const allItems = [...essentials, ...seasonal];

    return `
      <div class="tc-section tc-packing">
        <h3 class="tc-title">Packing Checklist</h3>
        <p class="tc-subtitle">Weather-aware for ${this._getMonthName(month)} in London</p>
        <div class="tc-checklist" id="tc-packing-list">
          ${allItems.map((item, i) => `
            <label class="tc-check">
              <input type="checkbox" data-key="pack-${i}" onchange="TripCountdown._saveCheck(this)">
              <span class="tc-check__icon">${item.icon}</span>
              <span class="tc-check__text">${item.text}</span>
            </label>
          `).join('')}
        </div>
        <p class="tc-hint">Your progress is saved automatically.</p>
      </div>`;
  },

  _getSeasonalItems(month) {
    const winter = [11, 0, 1]; // Dec, Jan, Feb
    const summer = [5, 6, 7]; // Jun, Jul, Aug
    const rainy = [9, 10, 2, 3]; // Oct, Nov, Mar, Apr

    const items = [];
    if (winter.includes(month)) {
      items.push({ text: 'Warm coat / puffer jacket', icon: '🧥' });
      items.push({ text: 'Scarf, gloves & hat', icon: '🧣' });
      items.push({ text: 'Thermal layers', icon: '🧤' });
    } else if (summer.includes(month)) {
      items.push({ text: 'Sunglasses', icon: '🕶️' });
      items.push({ text: 'Sun cream (SPF 30+)', icon: '🧴' });
      items.push({ text: 'Light layers (evenings cool down)', icon: '👕' });
    }
    if (rainy.includes(month) || winter.includes(month)) {
      items.push({ text: 'Waterproof jacket or compact umbrella', icon: '☂️' });
      items.push({ text: 'Waterproof shoes or shoe covers', icon: '🥾' });
    }
    items.push({ text: 'Reusable water bottle', icon: '🧊' });
    items.push({ text: 'Camera / phone with space for photos', icon: '📸' });
    return items;
  },

  _getMonthName(m) {
    return ['January','February','March','April','May','June','July','August','September','October','November','December'][m];
  },

  _renderDocChecklist() {
    const docs = [
      { text: 'Passport valid for 6+ months', icon: '🛂' },
      { text: 'Visa / ETA if required (check gov.uk)', icon: '📄' },
      { text: 'Travel insurance purchased', icon: '🛡️' },
      { text: 'Emergency contacts saved in phone', icon: '📞' },
      { text: 'Bank notified of travel dates', icon: '🏦' },
      { text: 'Copies of documents in email / cloud', icon: '☁️' },
    ];

    return `
      <div class="tc-section tc-docs">
        <h3 class="tc-title">Travel Documents</h3>
        <div class="tc-checklist" id="tc-docs-list">
          ${docs.map((item, i) => `
            <label class="tc-check">
              <input type="checkbox" data-key="doc-${i}" onchange="TripCountdown._saveCheck(this)">
              <span class="tc-check__icon">${item.icon}</span>
              <span class="tc-check__text">${item.text}</span>
            </label>
          `).join('')}
        </div>
      </div>`;
  },

  _renderQuickCurrency() {
    return `
      <div class="tc-section tc-currency">
        <h3 class="tc-title">Quick Currency Guide</h3>
        <div class="tc-currency-grid">
          <div class="tc-currency-card">
            <div class="tc-currency-card__label">Budget Lunch</div>
            <div class="tc-currency-card__amount">~£8-12</div>
          </div>
          <div class="tc-currency-card">
            <div class="tc-currency-card__label">Pint of Beer</div>
            <div class="tc-currency-card__amount">~£6-7</div>
          </div>
          <div class="tc-currency-card">
            <div class="tc-currency-card__label">Tube Single</div>
            <div class="tc-currency-card__amount">~£2.80</div>
          </div>
          <div class="tc-currency-card">
            <div class="tc-currency-card__label">Coffee</div>
            <div class="tc-currency-card__amount">~£3-4</div>
          </div>
          <div class="tc-currency-card">
            <div class="tc-currency-card__label">Nice Dinner</div>
            <div class="tc-currency-card__amount">~£30-50pp</div>
          </div>
          <div class="tc-currency-card">
            <div class="tc-currency-card__label">Day Travelcard</div>
            <div class="tc-currency-card__amount">~£14.90</div>
          </div>
        </div>
        <p class="tc-hint">Tip: Use contactless payment everywhere — no need to carry much cash.</p>
      </div>`;
  },

  _saveCheck(el) {
    const key = el.dataset.key;
    const saved = JSON.parse(localStorage.getItem('tripChecklist') || '{}');
    saved[key] = el.checked;
    localStorage.setItem('tripChecklist', JSON.stringify(saved));
  },

  _restoreChecks() {
    const saved = JSON.parse(localStorage.getItem('tripChecklist') || '{}');
    Object.entries(saved).forEach(([key, checked]) => {
      const el = document.querySelector(`[data-key="${key}"]`);
      if (el) el.checked = checked;
    });
  }
};

// Restore checks after render
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => TripCountdown._restoreChecks(), 100);
});
