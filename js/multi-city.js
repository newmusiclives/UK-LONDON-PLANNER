// ============================================================
// MULTI-CITY EXPANSION
// Paris, Rome, Barcelona, New York, Tokyo — same engine, different data.
// City selector, cross-city itineraries, Eurostar integration.
// ============================================================
const MultiCity = {
  cities: [
    { id: 'london', name: 'London', flag: '🇬🇧', tagline: 'The Original', status: 'live', venues: 900, colour: '#1B2A4A' },
    { id: 'paris', name: 'Paris', flag: '🇫🇷', tagline: 'City of Light', status: 'coming-soon', venues: 0, colour: '#002654' },
    { id: 'rome', name: 'Rome', flag: '🇮🇹', tagline: 'Eternal City', status: 'coming-soon', venues: 0, colour: '#006341' },
    { id: 'barcelona', name: 'Barcelona', flag: '🇪🇸', tagline: 'Mediterranean Magic', status: 'coming-soon', venues: 0, colour: '#AA151B' },
    { id: 'new-york', name: 'New York', flag: '🇺🇸', tagline: 'The Big Apple', status: 'coming-soon', venues: 0, colour: '#002868' },
    { id: 'tokyo', name: 'Tokyo', flag: '🇯🇵', tagline: 'Where Tradition Meets Future', status: 'planned', venues: 0, colour: '#BC002D' },
    { id: 'amsterdam', name: 'Amsterdam', flag: '🇳🇱', tagline: 'Canal City', status: 'planned', venues: 0, colour: '#003DA5' },
    { id: 'lisbon', name: 'Lisbon', flag: '🇵🇹', tagline: 'City of Seven Hills', status: 'planned', venues: 0, colour: '#006847' },
  ],

  crossCity: [
    { from: 'london', to: 'paris', transport: 'Eurostar', duration: '2h 15min', price: 'From £39', description: 'Direct train from St Pancras to Gare du Nord. Perfect for a London + Paris combo trip.' },
    { from: 'london', to: 'amsterdam', transport: 'Eurostar', duration: '3h 55min', price: 'From £35', description: 'Direct train from St Pancras. No flights needed — city centre to city centre.' },
    { from: 'london', to: 'barcelona', transport: 'Flight', duration: '2h 10min', price: 'From £25', description: 'Multiple daily flights from all London airports. Budget airlines make this incredibly affordable.' },
    { from: 'london', to: 'rome', transport: 'Flight', duration: '2h 30min', price: 'From £30', description: 'Direct flights from Gatwick, Heathrow, Stansted, and Luton.' },
  ],

  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('multi-city')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    container.innerHTML = `
      <div class="mc-widget">
        <div class="mc-header">
          <h3>Explore More Cities</h3>
          <p>The London & UK Planner engine is expanding. Same smart itinerary planning, new destinations.</p>
        </div>

        <div class="mc-grid">
          ${this.cities.map(c => this._renderCityCard(c)).join('')}
        </div>

        <div class="mc-cross-city">
          <h4>Combine Your Trip</h4>
          <p class="mc-cross-city__desc">Add another European city to your London trip — we'll plan the connection too.</p>
          <div class="mc-routes">
            ${this.crossCity.map(r => this._renderRoute(r)).join('')}
          </div>
        </div>

        <div class="mc-notify">
          <h4>Get Notified When New Cities Launch</h4>
          <form class="mc-notify-form" onsubmit="MultiCity._subscribe(event)">
            <input type="email" id="mc-email" placeholder="Your email" required class="mc-input">
            <select id="mc-city-pref" class="mc-select">
              <option value="">Most interested in...</option>
              ${this.cities.filter(c => c.status !== 'live').map(c => `<option value="${c.id}">${c.flag} ${c.name}</option>`).join('')}
            </select>
            <button type="submit" class="btn btn--primary btn--small">Notify Me</button>
          </form>
        </div>
      </div>
    `;
  },

  _renderCityCard(city) {
    const statusBadge = {
      'live': '<span class="mc-badge mc-badge--live">Live Now</span>',
      'coming-soon': '<span class="mc-badge mc-badge--soon">Coming Soon</span>',
      'planned': '<span class="mc-badge mc-badge--planned">Planned</span>',
    }[city.status];

    return `
      <div class="mc-card ${city.status === 'live' ? 'mc-card--live' : 'mc-card--upcoming'}" style="--city-colour:${city.colour}">
        <div class="mc-card__flag">${city.flag}</div>
        <h4 class="mc-card__name">${city.name}</h4>
        <p class="mc-card__tagline">${city.tagline}</p>
        ${statusBadge}
        ${city.venues > 0 ? `<small class="mc-card__venues">${city.venues}+ venues</small>` : ''}
        ${city.status === 'live' ? '<a href="wizard.html" class="btn btn--primary btn--small mc-card__btn">Plan Trip</a>' : ''}
      </div>
    `;
  },

  _renderRoute(route) {
    const fromCity = this.cities.find(c => c.id === route.from);
    const toCity = this.cities.find(c => c.id === route.to);
    return `
      <div class="mc-route">
        <div class="mc-route__cities">
          <span>${fromCity.flag} ${fromCity.name}</span>
          <span class="mc-route__arrow">→</span>
          <span>${toCity.flag} ${toCity.name}</span>
        </div>
        <div class="mc-route__details">
          <span>${route.transport} · ${route.duration}</span>
          <span class="mc-route__price">${route.price}</span>
        </div>
        <p class="mc-route__desc">${route.description}</p>
      </div>
    `;
  },

  _subscribe(e) {
    e.preventDefault();
    const email = document.getElementById('mc-email')?.value;
    const pref = document.getElementById('mc-city-pref')?.value;
    if (!email) return;
    localStorage.setItem('multiCityNotify', JSON.stringify({ email, preference: pref, subscribedAt: new Date().toISOString() }));
    e.target.innerHTML = '<p style="color:var(--color-accent);font-weight:600;">Thanks! We\'ll notify you when new cities launch.</p>';
  }
};
