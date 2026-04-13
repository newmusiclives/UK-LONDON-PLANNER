// ============================================================
// AI CONCIERGE — Live Trip Companion
// Real-time AI assistant during the trip. GPS-aware, context-aware,
// knows your itinerary and preferences.
// ============================================================
const AIConcierge = {
  _open: false,
  _position: null,
  _watching: false,
  _itinerary: null,

  init() {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('ai-concierge')) return;
    this._itinerary = typeof State !== 'undefined' ? State.getItinerary() : null;
    this._renderButton();
  },

  _renderButton() {
    if (document.getElementById('concierge-fab')) return;
    const fab = document.createElement('button');
    fab.id = 'concierge-fab';
    fab.className = 'con-fab';
    fab.innerHTML = '🧭';
    fab.title = 'AI Concierge';
    fab.addEventListener('click', () => this.toggle());
    document.body.appendChild(fab);
  },

  toggle() {
    this._open ? this.close() : this.open();
  },

  open() {
    if (document.getElementById('concierge-panel')) return;
    this._open = true;

    const panel = document.createElement('div');
    panel.id = 'concierge-panel';
    panel.className = 'con-panel';
    panel.innerHTML = `
      <div class="con-header">
        <span class="con-header__title">🧭 AI Concierge</span>
        <button class="con-header__close" onclick="AIConcierge.close()">&times;</button>
      </div>
      <div class="con-body" id="con-body">
        <div class="con-welcome">
          <p class="con-welcome__greeting">Hello! I'm your London travel companion.</p>
          <p class="con-welcome__hint">Ask me anything — nearby pubs, rainy day plans, what's open now, or help navigating the Tube.</p>
        </div>
        <div class="con-location" id="con-location">
          <button class="btn btn--small btn--primary" onclick="AIConcierge.startTracking()">📍 Share My Location</button>
        </div>
        <div class="con-suggestions">
          ${this._renderSuggestions()}
        </div>
      </div>
      <div class="con-input-area">
        <form id="con-form" onsubmit="AIConcierge._handleSubmit(event)">
          <input type="text" id="con-input" class="con-input" placeholder="What do you need help with?" autocomplete="off">
          <button type="submit" class="con-send">→</button>
        </form>
      </div>
    `;
    document.body.appendChild(panel);

    const fab = document.getElementById('concierge-fab');
    if (fab) fab.style.display = 'none';
  },

  close() {
    const panel = document.getElementById('concierge-panel');
    if (panel) panel.remove();
    this._open = false;
    const fab = document.getElementById('concierge-fab');
    if (fab) fab.style.display = '';
  },

  _renderSuggestions() {
    const now = new Date();
    const hour = now.getHours();
    let contextual = [];

    if (hour < 10) {
      contextual = ['Best breakfast near me', 'What opens early?', 'Morning walk route'];
    } else if (hour < 13) {
      contextual = ['Lunch recommendations', 'Free attractions nearby', 'Coffee shops'];
    } else if (hour < 17) {
      contextual = ['Afternoon tea spots', 'Museums still open', 'Shopping nearby'];
    } else if (hour < 20) {
      contextual = ['Dinner reservations', 'Pre-theatre drinks', 'Sunset viewpoints'];
    } else {
      contextual = ['Best pubs nearby', 'Late-night food', 'Night bus home'];
    }

    // Weather-based
    contextual.push('Rainy day backup plan');

    return contextual.map(s =>
      `<button class="con-suggestion" onclick="AIConcierge._askQuestion('${s}')">${s}</button>`
    ).join('');
  },

  startTracking() {
    if (!navigator.geolocation) {
      this._updateLocation('Location not available in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this._position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const neighbourhood = this._detectNeighbourhood(this._position);
        this._updateLocation(neighbourhood
          ? `📍 You're near <strong>${neighbourhood}</strong>`
          : `📍 Location detected (${this._position.lat.toFixed(4)}, ${this._position.lng.toFixed(4)})`
        );
      },
      () => this._updateLocation('📍 Location access denied. You can still ask questions!'),
      { enableHighAccuracy: true }
    );
  },

  _detectNeighbourhood(pos) {
    if (typeof DayMap === 'undefined') return null;
    let closest = null, closestDist = Infinity;
    for (const [name, coords] of Object.entries(DayMap.COORDS)) {
      const dist = Math.sqrt(Math.pow(pos.lat - coords[0], 2) + Math.pow(pos.lng - coords[1], 2));
      if (dist < closestDist) { closestDist = dist; closest = name; }
    }
    return closestDist < 0.02 ? closest : null;
  },

  _updateLocation(html) {
    const el = document.getElementById('con-location');
    if (el) el.innerHTML = `<div class="con-location-status">${html}</div>`;
  },

  _askQuestion(q) {
    const input = document.getElementById('con-input');
    if (input) { input.value = q; }
    this._handleSubmit(null, q);
  },

  _handleSubmit(e, directQ) {
    if (e) e.preventDefault();
    const input = document.getElementById('con-input');
    const query = directQ || (input ? input.value.trim() : '');
    if (!query) return;
    if (input) input.value = '';

    const body = document.getElementById('con-body');
    if (!body) return;

    // Add user message
    body.innerHTML += `<div class="con-msg con-msg--user">${this._escapeHtml(query)}</div>`;

    // Generate response
    const response = this._generateResponse(query);
    body.innerHTML += `<div class="con-msg con-msg--ai">${response}</div>`;

    body.scrollTop = body.scrollHeight;
  },

  _generateResponse(query) {
    const q = query.toLowerCase();
    const neighbourhood = this._position ? this._detectNeighbourhood(this._position) : null;
    const nearText = neighbourhood ? ` near ${neighbourhood}` : '';

    if (q.includes('rain') || q.includes('weather') || q.includes('wet')) {
      return `<strong>Rainy day options${nearText}:</strong><br>
        • British Museum (free, Bloomsbury)<br>
        • Natural History Museum (free, South Kensington)<br>
        • Afternoon tea at The Wolseley<br>
        • Borough Market (covered sections)<br>
        • Cinema at BFI Southbank<br>
        <small>London rain usually passes quickly — grab a coffee and wait 20 minutes!</small>`;
    }

    if (q.includes('pub') || q.includes('beer') || q.includes('drink')) {
      return `<strong>Great pubs${nearText}:</strong><br>
        • The Lamb & Flag (Covent Garden) — historic, cosy<br>
        • Ye Olde Cheshire Cheese (Fleet Street) — since 1667<br>
        • The Churchill Arms (Kensington) — flower-covered exterior<br>
        • Gordon's Wine Bar (Embankment) — candlelit cave<br>
        <small>Tip: Most pubs serve food until 9pm. A pint costs £6-7.</small>`;
    }

    if (q.includes('breakfast') || q.includes('brunch') || q.includes('morning')) {
      return `<strong>Breakfast spots${nearText}:</strong><br>
        • Dishoom (King's Cross) — bacon naan roll, legendary<br>
        • The Wolseley (Piccadilly) — grand European cafe<br>
        • Regency Cafe (Westminster) — proper Full English<br>
        • Granger & Co (various) — Australian brunch<br>
        <small>Arrive before 9am to beat weekend queues.</small>`;
    }

    if (q.includes('lunch') || q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dinner')) {
      return `<strong>Eating recommendations${nearText}:</strong><br>
        • Padella (Borough) — fresh pasta, queue-worthy<br>
        • BAO (Soho) — Taiwanese buns, cult favourite<br>
        • Flat Iron (various) — £16 steak, brilliant value<br>
        • Hawksmoor (Seven Dials) — best steak in London<br>
        <small>Book ahead for dinner. Lunch walk-ins are usually easier.</small>`;
    }

    if (q.includes('tube') || q.includes('underground') || q.includes('transport') || q.includes('bus')) {
      return `<strong>Getting around:</strong><br>
        • Use contactless payment (no Oyster needed)<br>
        • Avoid Zone 1 during 8-9am and 5-6:30pm<br>
        • Night Tube runs Fri & Sat on Central, Victoria, Jubilee, Northern, Piccadilly lines<br>
        • Bus 11 is a great sightseeing route (Chelsea → St Paul's)<br>
        <small>TfL Journey Planner: tfl.gov.uk/plan-a-journey</small>`;
    }

    if (q.includes('free') || q.includes('budget') || q.includes('cheap')) {
      return `<strong>Free things to do${nearText}:</strong><br>
        • British Museum, Tate Modern, National Gallery, V&A, Science Museum<br>
        • Walk along the South Bank (Westminster Bridge → Tower Bridge)<br>
        • Changing of the Guard at Buckingham Palace (11am)<br>
        • Sky Garden (book free slot online)<br>
        • Street performers in Covent Garden<br>
        <small>Many of London's best experiences are completely free!</small>`;
    }

    if (q.includes('coffee') || q.includes('cafe') || q.includes('wifi')) {
      return `<strong>Coffee & WiFi spots${nearText}:</strong><br>
        • Monmouth Coffee (Borough Market) — legendary single-origin<br>
        • Ozone Coffee Roasters (Shoreditch) — great for working<br>
        • Workshop Coffee (various) — excellent flat whites<br>
        • The British Library cafe — free WiFi, iconic building<br>
        <small>Most London cafes have free WiFi. Ask for the password at the counter.</small>`;
    }

    if (q.includes('help') || q.includes('emergency') || q.includes('hospital') || q.includes('police')) {
      return `<strong>Emergency info:</strong><br>
        • Emergency: call 999 (police, ambulance, fire)<br>
        • Non-emergency police: call 101<br>
        • NHS 111: non-emergency medical advice<br>
        • Nearest A&E: search "A&E near me" on Google Maps<br>
        • Embassy contacts: gov.uk/world/embassies<br>
        <small>London is very safe for tourists. Stay aware in crowded areas.</small>`;
    }

    return `I'd be happy to help with that${nearText}! Here are some general tips:<br><br>
      • For attractions: book online to save money and skip queues<br>
      • For restaurants: lunchtime is easier for walk-ins than dinner<br>
      • For transport: contactless is the easiest way to pay<br>
      • For weather: always carry a light layer — London weather changes fast<br><br>
      <small>Try asking about specific topics: pubs, restaurants, free things, transport, rainy day plans, coffee shops, or emergencies.</small>`;
  },

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof AIConcierge !== 'undefined') AIConcierge.init();
});
