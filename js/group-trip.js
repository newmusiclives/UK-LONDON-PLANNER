// ============================================================
// GROUP TRIP COLLABORATION
// Real-time collaborative trip planning. Vote on venues,
// set budgets together, split costs, share live itinerary.
// ============================================================
const GroupTrip = {
  STORAGE_KEY: 'groupTripData',

  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('group-trip')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const data = this._getData();
    container.innerHTML = this._render(data);
    this._bindEvents(container);
  },

  _render(data) {
    return `
      <div class="gt-widget">
        <div class="gt-hero">
          <div class="gt-hero__icon">👥</div>
          <h3>Group Trip Planner</h3>
          <p class="gt-hero__desc">Plan together, vote on venues, and split costs — all in one place.</p>
        </div>

        ${data.tripId ? this._renderActiveTrip(data) : this._renderSetup()}
      </div>
    `;
  },

  _renderSetup() {
    return `
      <div class="gt-setup">
        <h4>Create a Group Trip</h4>
        <form id="gt-create-form" class="gt-form">
          <input type="text" id="gt-trip-name" placeholder="Trip name (e.g. Sarah's 30th in London)" required class="gt-input">
          <input type="text" id="gt-creator-name" placeholder="Your name" required class="gt-input">
          <input type="email" id="gt-creator-email" placeholder="Your email" required class="gt-input">
          <button type="submit" class="btn btn--primary">Create Group Trip</button>
        </form>
      </div>
    `;
  },

  _renderActiveTrip(data) {
    return `
      <div class="gt-active">
        <div class="gt-trip-header">
          <h4>${data.tripName}</h4>
          <span class="gt-trip-code">Code: <strong>${data.tripId}</strong></span>
        </div>

        <!-- Members -->
        <div class="gt-section">
          <h4>Members (${data.members.length})</h4>
          <div class="gt-members">
            ${data.members.map(m => `
              <div class="gt-member">
                <div class="gt-member__avatar">${m.name.charAt(0).toUpperCase()}</div>
                <div class="gt-member__info">
                  <strong>${m.name}</strong>
                  <small>${m.role}</small>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="gt-invite">
            <input type="text" class="gt-input gt-input--sm" value="${window.location.origin}/?group=${data.tripId}" readonly id="gt-invite-url">
            <button class="btn btn--small" onclick="GroupTrip._copyInvite()">Copy Invite</button>
          </div>
        </div>

        <!-- Voting -->
        <div class="gt-section">
          <h4>Vote on Venues</h4>
          <div class="gt-votes">
            ${data.proposals.map((p, i) => `
              <div class="gt-vote-card">
                <div class="gt-vote-card__info">
                  <strong>${p.name}</strong>
                  <small>${p.type} · ${p.neighbourhood}</small>
                </div>
                <div class="gt-vote-card__actions">
                  <button class="gt-vote-btn gt-vote-btn--up" onclick="GroupTrip._vote(${i}, 'up')">👍 ${p.votesUp}</button>
                  <button class="gt-vote-btn gt-vote-btn--down" onclick="GroupTrip._vote(${i}, 'down')">👎 ${p.votesDown}</button>
                </div>
              </div>
            `).join('')}
          </div>
          <form id="gt-propose-form" class="gt-propose" onsubmit="GroupTrip._addProposal(event)">
            <input type="text" id="gt-propose-name" placeholder="Suggest a venue..." class="gt-input gt-input--sm">
            <button type="submit" class="btn btn--small btn--primary">Propose</button>
          </form>
        </div>

        <!-- Budget Split -->
        <div class="gt-section">
          <h4>Budget Split</h4>
          <div class="gt-budget">
            <div class="gt-budget-row">
              <span>Accommodation</span>
              <span>£${data.budget.accommodation} total</span>
              <span class="gt-budget-pp">£${Math.round(data.budget.accommodation / data.members.length)} pp</span>
            </div>
            <div class="gt-budget-row">
              <span>Activities</span>
              <span>£${data.budget.activities} total</span>
              <span class="gt-budget-pp">£${Math.round(data.budget.activities / data.members.length)} pp</span>
            </div>
            <div class="gt-budget-row">
              <span>Food & Drink</span>
              <span>£${data.budget.food} total</span>
              <span class="gt-budget-pp">£${Math.round(data.budget.food / data.members.length)} pp</span>
            </div>
            <div class="gt-budget-row gt-budget-row--total">
              <span>Total</span>
              <span>£${data.budget.accommodation + data.budget.activities + data.budget.food}</span>
              <span class="gt-budget-pp">£${Math.round((data.budget.accommodation + data.budget.activities + data.budget.food) / data.members.length)} pp</span>
            </div>
          </div>
        </div>

        <!-- Shared Notes -->
        <div class="gt-section">
          <h4>Group Notes</h4>
          <textarea class="gt-notes" id="gt-notes" rows="4" placeholder="Add shared notes, ideas, or reminders..."
            onchange="GroupTrip._saveNotes(this.value)">${data.notes || ''}</textarea>
        </div>
      </div>
    `;
  },

  _bindEvents(container) {
    const form = container.querySelector('#gt-create-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('gt-trip-name').value;
        const creatorName = document.getElementById('gt-creator-name').value;
        const email = document.getElementById('gt-creator-email').value;
        this._createTrip(name, creatorName, email);
        container.innerHTML = this._render(this._getData());
        this._bindEvents(container);
      });
    }
  },

  _createTrip(tripName, creatorName, email) {
    const tripId = 'GT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const data = {
      tripId, tripName,
      members: [{ name: creatorName, email, role: 'Organiser', joinedAt: new Date().toISOString() }],
      proposals: [
        { name: 'Borough Market', type: 'Food', neighbourhood: 'Bankside', votesUp: 1, votesDown: 0 },
        { name: 'Tower of London', type: 'Attraction', neighbourhood: 'Tower Hill', votesUp: 1, votesDown: 0 },
        { name: 'Ronnie Scott\'s Jazz Club', type: 'Nightlife', neighbourhood: 'Soho', votesUp: 0, votesDown: 0 },
      ],
      budget: { accommodation: 800, activities: 400, food: 500 },
      notes: '',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  _getData() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}'); }
    catch (e) { return {}; }
  },

  _vote(index, direction) {
    const data = this._getData();
    if (!data.proposals || !data.proposals[index]) return;
    if (direction === 'up') data.proposals[index].votesUp++;
    else data.proposals[index].votesDown++;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    const container = document.querySelector('.gt-widget')?.parentElement;
    if (container) this.init(container);
  },

  _addProposal(e) {
    e.preventDefault();
    const name = document.getElementById('gt-propose-name')?.value;
    if (!name) return;
    const data = this._getData();
    data.proposals = data.proposals || [];
    data.proposals.push({ name, type: 'Venue', neighbourhood: 'TBD', votesUp: 0, votesDown: 0 });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    const container = document.querySelector('.gt-widget')?.parentElement;
    if (container) this.init(container);
  },

  _copyInvite() {
    const url = document.getElementById('gt-invite-url')?.value;
    if (url) navigator.clipboard.writeText(url);
  },

  _saveNotes(text) {
    const data = this._getData();
    data.notes = text;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
};
