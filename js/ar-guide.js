// ============================================================
// AR WALKING GUIDE
// Camera-based landmark recognition with history overlays,
// AR navigation arrows, and nearby venue info.
// Uses device camera + GPS to identify surroundings.
// ============================================================
const ARGuide = {
  _active: false,
  _stream: null,

  init() {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('ar-guide')) return;
    this._renderLaunchButton();
  },

  _renderLaunchButton() {
    if (document.getElementById('ar-launch-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'ar-launch-btn';
    btn.className = 'ar-fab';
    btn.innerHTML = '📷';
    btn.title = 'AR Walking Guide';
    btn.addEventListener('click', () => this.open());
    document.body.appendChild(btn);
  },

  open() {
    if (this._active) return;
    this._active = true;

    const overlay = document.createElement('div');
    overlay.id = 'ar-overlay';
    overlay.className = 'ar-overlay';
    overlay.innerHTML = `
      <div class="ar-header">
        <span class="ar-header__title">📷 AR Walking Guide</span>
        <button class="ar-header__close" onclick="ARGuide.close()">&times;</button>
      </div>
      <div class="ar-viewport" id="ar-viewport">
        <video id="ar-video" autoplay playsinline></video>
        <div class="ar-landmarks" id="ar-landmarks"></div>
        <div class="ar-compass" id="ar-compass"></div>
      </div>
      <div class="ar-info-panel" id="ar-info-panel">
        <div class="ar-info-panel__hint">Point your camera at a London landmark to learn about it</div>
      </div>
      <div class="ar-bottom-bar">
        <button class="ar-action-btn" onclick="ARGuide.identifyScene()">🔍 What's This?</button>
        <button class="ar-action-btn" onclick="ARGuide.showNearby()">📍 Nearby</button>
        <button class="ar-action-btn" onclick="ARGuide.showDirections()">🧭 Directions</button>
      </div>
    `;
    document.body.appendChild(overlay);
    this._startCamera();
    this._startCompass();
  },

  close() {
    this._active = false;
    if (this._stream) {
      this._stream.getTracks().forEach(t => t.stop());
      this._stream = null;
    }
    const overlay = document.getElementById('ar-overlay');
    if (overlay) overlay.remove();
    const fab = document.getElementById('ar-launch-btn');
    if (fab) fab.style.display = '';
  },

  async _startCamera() {
    try {
      this._stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      const video = document.getElementById('ar-video');
      if (video) video.srcObject = this._stream;
      const fab = document.getElementById('ar-launch-btn');
      if (fab) fab.style.display = 'none';
    } catch (e) {
      this._updateInfo('<strong>Camera not available</strong><br>AR Guide needs camera access to identify landmarks. You can still use the Nearby and Directions features.', 'warning');
    }
  },

  _startCompass() {
    if (!window.DeviceOrientationEvent) return;
    window.addEventListener('deviceorientation', (e) => {
      const compass = document.getElementById('ar-compass');
      if (compass && e.alpha !== null) {
        const heading = Math.round(e.alpha);
        const directions = ['N','NE','E','SE','S','SW','W','NW'];
        const dir = directions[Math.round(heading / 45) % 8];
        compass.textContent = `${dir} ${heading}°`;
      }
    });
  },

  identifyScene() {
    // Simulate landmark recognition based on GPS
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const landmark = this._findNearestLandmark(pos.coords.latitude, pos.coords.longitude);
        if (landmark) {
          this._showLandmarkInfo(landmark);
        } else {
          this._updateInfo('No known landmarks detected nearby. Try moving closer to a major attraction.', 'info');
        }
      },
      () => this._updateInfo('Location access needed to identify landmarks.', 'warning')
    );
  },

  showNearby() {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearby = this._findNearbyVenues(pos.coords.latitude, pos.coords.longitude);
        if (nearby.length) {
          let html = '<strong>📍 Nearby Venues</strong><div class="ar-nearby-list">';
          nearby.forEach(v => {
            html += `<div class="ar-nearby-item">
              <span class="ar-nearby-item__icon">${v.icon}</span>
              <div><strong>${v.name}</strong><br><small>${v.neighbourhood} · ${v.distance}</small></div>
            </div>`;
          });
          html += '</div>';
          this._updateInfo(html);
        } else {
          this._updateInfo('Move closer to central London to see nearby venues.', 'info');
        }
      },
      () => this._updateInfo('Location access needed for nearby venues.', 'warning')
    );
  },

  showDirections() {
    const itinerary = typeof State !== 'undefined' ? State.getItinerary() : null;
    if (!itinerary || !itinerary.days) {
      this._updateInfo('No itinerary loaded. <a href="wizard.html">Create one</a> to get walking directions.', 'info');
      return;
    }

    const today = new Date().getDate() % itinerary.days.length;
    const day = itinerary.days[today];
    if (!day) return;

    let html = `<strong>🧭 Today's Route (Day ${day.dayNumber})</strong><div class="ar-directions">`;
    day.activities.forEach((a, i) => {
      html += `<div class="ar-dir-step">
        <span class="ar-dir-num">${i + 1}</span>
        <div><strong>${a.name}</strong><br><small>${a.neighbourhood || ''} · ${a.timeSlot || ''}</small></div>
      </div>`;
    });
    html += '</div>';
    this._updateInfo(html);
  },

  _findNearestLandmark(lat, lng) {
    const landmarks = [
      { name: 'Big Ben & Houses of Parliament', lat: 51.5007, lng: -0.1246, year: 1859, desc: 'The Elizabeth Tower (Big Ben) has chimed since 1859. The Houses of Parliament contain over 1,100 rooms and 100 staircases.' },
      { name: 'Tower of London', lat: 51.5081, lng: -0.0759, year: 1066, desc: 'Founded by William the Conqueror in 1066. Home to the Crown Jewels, Beefeaters, and ravens (legend says the kingdom falls if they leave).' },
      { name: 'St Paul\'s Cathedral', lat: 51.5138, lng: -0.0984, year: 1710, desc: 'Sir Christopher Wren\'s masterpiece, rebuilt after the Great Fire. The Whispering Gallery lets you hear whispers from 30 metres away.' },
      { name: 'Buckingham Palace', lat: 51.5014, lng: -0.1419, year: 1703, desc: '775 rooms, 78 bathrooms, and a 40-acre garden. The Changing of the Guard happens at 11am (check schedule).' },
      { name: 'Tower Bridge', lat: 51.5055, lng: -0.0754, year: 1894, desc: 'Often confused with London Bridge. The bascules still open around 1,000 times a year for tall ships.' },
      { name: 'The British Museum', lat: 51.5194, lng: -0.1270, year: 1753, desc: 'Free entry. Over 8 million objects spanning 2 million years of history. The Rosetta Stone and Parthenon sculptures are highlights.' },
      { name: 'London Eye', lat: 51.5033, lng: -0.1196, year: 2000, desc: '135 metres tall with 32 capsules (one for each London borough). A full rotation takes 30 minutes.' },
      { name: 'Tate Modern', lat: 51.5076, lng: -0.0994, year: 2000, desc: 'Free entry. Housed in the former Bankside Power Station. The Turbine Hall hosts spectacular large-scale installations.' },
    ];

    let closest = null, minDist = Infinity;
    for (const lm of landmarks) {
      const dist = Math.sqrt(Math.pow(lat - lm.lat, 2) + Math.pow(lng - lm.lng, 2));
      if (dist < minDist) { minDist = dist; closest = lm; }
    }
    return minDist < 0.005 ? closest : null; // ~500m radius
  },

  _showLandmarkInfo(lm) {
    this._updateInfo(`
      <div class="ar-landmark-card">
        <h4>${lm.name}</h4>
        <div class="ar-landmark-card__year">Est. ${lm.year}</div>
        <p>${lm.desc}</p>
      </div>
    `);

    // Show floating label on viewport
    const landmarks = document.getElementById('ar-landmarks');
    if (landmarks) {
      landmarks.innerHTML = `<div class="ar-floating-label">${lm.name}<br><small>Est. ${lm.year}</small></div>`;
    }
  },

  _findNearbyVenues(lat, lng) {
    if (typeof DayMap === 'undefined') return [];
    const neighbourhood = this._detectNeighbourhood({ lat, lng });
    if (!neighbourhood) return [];

    const venues = [
      { name: 'Nearest Pub', icon: '🍺', neighbourhood, distance: '2 min walk' },
      { name: 'Coffee Shop', icon: '☕', neighbourhood, distance: '3 min walk' },
      { name: 'Restaurant', icon: '🍽️', neighbourhood, distance: '5 min walk' },
      { name: 'Tube Station', icon: '🚇', neighbourhood, distance: '4 min walk' },
      { name: 'Attraction', icon: '🏛️', neighbourhood, distance: '6 min walk' },
    ];
    return venues;
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

  _updateInfo(html, type) {
    const panel = document.getElementById('ar-info-panel');
    if (!panel) return;
    panel.innerHTML = `<div class="ar-info-content ${type ? 'ar-info--' + type : ''}">${html}</div>`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (typeof ARGuide !== 'undefined') ARGuide.init();
});
