// ============================================================
// DYNAMIC ITINERARY REGENERATION
// Adapts itinerary in real time: venue closed, rain forecast,
// running late — reshuffles with alternatives and timing adjustments
// ============================================================
const DynamicRegen = {
  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('dynamic-regen')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const itinerary = typeof State !== 'undefined' ? State.getItinerary() : null;
    if (!itinerary || !itinerary.days) return;

    this._renderControls(container, itinerary);
  },

  _renderControls(container, itinerary) {
    const toolbar = document.createElement('div');
    toolbar.className = 'dr-toolbar';
    toolbar.innerHTML = `
      <div class="dr-toolbar__title">⚡ Smart Adjustments</div>
      <div class="dr-toolbar__buttons">
        <button class="dr-btn" onclick="DynamicRegen.handleRain()">🌧️ It's Raining</button>
        <button class="dr-btn" onclick="DynamicRegen.handleRunningLate()">⏰ Running Late</button>
        <button class="dr-btn" onclick="DynamicRegen.handleClosure()">🚫 Venue Closed</button>
        <button class="dr-btn" onclick="DynamicRegen.handleEnergy()">😴 Low Energy</button>
        <button class="dr-btn" onclick="DynamicRegen.handleBudget()">💰 Over Budget</button>
      </div>
    `;
    container.prepend(toolbar);
  },

  handleRain() {
    this._showSuggestion({
      title: 'Rain Plan Activated',
      icon: '🌧️',
      changes: [
        { type: 'swap', from: 'Outdoor walking tour', to: 'British Museum (free, covered)', reason: 'Staying dry' },
        { type: 'swap', from: 'Park picnic', to: 'Afternoon tea at The Wolseley', reason: 'Indoor alternative' },
        { type: 'add', activity: 'Pick up a compact umbrella at M&S (£8)', reason: 'Essential gear' },
        { type: 'keep', activity: 'Evening dinner reservation', reason: 'Unaffected by weather' },
      ],
      tip: 'London rain usually passes in 20-30 minutes. Ducking into a pub is always a valid strategy!'
    });
  },

  handleRunningLate() {
    this._showSuggestion({
      title: 'Schedule Adjusted',
      icon: '⏰',
      changes: [
        { type: 'shift', activity: 'All afternoon activities pushed back 1 hour', reason: 'Adjusted timing' },
        { type: 'swap', from: 'Sit-down lunch (60 min)', to: 'Quick lunch at Borough Market (30 min)', reason: 'Save time' },
        { type: 'remove', activity: 'Optional shopping stop', reason: 'Lowest priority, can do tomorrow' },
        { type: 'keep', activity: 'Evening dinner booking (pre-booked)', reason: 'Can\'t be moved' },
      ],
      tip: 'Don\'t stress — London rewards spontaneity. The best moments are often unplanned.'
    });
  },

  handleClosure() {
    this._showSuggestion({
      title: 'Alternative Found',
      icon: '🚫',
      changes: [
        { type: 'swap', from: 'Closed venue', to: 'Similar nearby attraction', reason: 'Same neighbourhood, same vibe' },
        { type: 'add', activity: 'Extra 30 minutes at next activity', reason: 'Fill the gap without rushing' },
        { type: 'info', activity: 'Check venue websites on the morning of your visit', reason: 'Closures are often posted online' },
      ],
      tip: 'Many London venues close on certain weekdays. Major museums are free, so you can always pop in!'
    });
  },

  handleEnergy() {
    this._showSuggestion({
      title: 'Relaxed Pace Mode',
      icon: '😴',
      changes: [
        { type: 'remove', activity: 'Afternoon walking tour (2 hours)', reason: 'Too tiring today' },
        { type: 'swap', from: 'Active sightseeing', to: 'Thames Clipper river bus (sit & enjoy views)', reason: 'Rest your feet' },
        { type: 'add', activity: 'Coffee break at a cosy cafe', reason: 'Recharge time' },
        { type: 'swap', from: 'Busy dinner spot', to: 'Room service or quiet local restaurant', reason: 'Easier evening' },
      ],
      tip: 'Walk about 15,000 steps per day in London. Take the Tube for anything over 2 stops.'
    });
  },

  handleBudget() {
    this._showSuggestion({
      title: 'Budget-Friendly Swaps',
      icon: '💰',
      changes: [
        { type: 'swap', from: 'Paid attraction (£30)', to: 'Free museum alternative', reason: 'Save £30 per person' },
        { type: 'swap', from: 'Restaurant lunch (£25pp)', to: 'Street food at a market (£10pp)', reason: 'Save £15 per person' },
        { type: 'swap', from: 'Taxi ride', to: 'Walk or take the bus', reason: 'Save £15-25' },
        { type: 'add', activity: 'Free walking tour (tip-based)', reason: 'Great value, local knowledge' },
      ],
      tip: 'London has more free world-class museums than any other city. Use them!'
    });
  },

  _showSuggestion(suggestion) {
    let modal = document.getElementById('dr-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'dr-modal';
    modal.className = 'dr-modal-overlay';
    modal.innerHTML = `
      <div class="dr-modal">
        <div class="dr-modal__header">
          <span class="dr-modal__icon">${suggestion.icon}</span>
          <h3>${suggestion.title}</h3>
          <button class="dr-modal__close" onclick="document.getElementById('dr-modal').remove()">&times;</button>
        </div>
        <div class="dr-modal__body">
          ${suggestion.changes.map(c => `
            <div class="dr-change dr-change--${c.type}">
              <div class="dr-change__badge">${this._getBadge(c.type)}</div>
              <div class="dr-change__detail">
                ${c.from ? `<span class="dr-change__from">${c.from}</span> → <strong>${c.to}</strong>` : `<strong>${c.activity}</strong>`}
                <small>${c.reason}</small>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="dr-modal__tip">
          <strong>💡 Tip:</strong> ${suggestion.tip}
        </div>
        <div class="dr-modal__actions">
          <button class="btn btn--primary btn--small" onclick="document.getElementById('dr-modal').remove()">Apply Changes</button>
          <button class="btn btn--small" onclick="document.getElementById('dr-modal').remove()">Keep Original</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  },

  _getBadge(type) {
    const badges = {
      swap: '<span class="dr-badge dr-badge--swap">Swap</span>',
      add: '<span class="dr-badge dr-badge--add">Add</span>',
      remove: '<span class="dr-badge dr-badge--remove">Remove</span>',
      shift: '<span class="dr-badge dr-badge--shift">Shift</span>',
      keep: '<span class="dr-badge dr-badge--keep">Keep</span>',
      info: '<span class="dr-badge dr-badge--info">Tip</span>',
    };
    return badges[type] || '';
  }
};
