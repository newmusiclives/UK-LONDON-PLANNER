// ============================================================
// DAY MAP — Reusable per-day mini map + travel directions
// Shows activity markers, route lines, and travel suggestions
// ============================================================
const DayMap = {
  // London neighbourhood coordinates (shared reference)
  COORDS: {
    'Westminster': [51.4975, -0.1357], 'St James\'s': [51.5074, -0.1378],
    'West End': [51.5115, -0.1285], 'Soho': [51.5134, -0.1319],
    'Covent Garden': [51.5117, -0.1240], 'Mayfair': [51.5100, -0.1468],
    'Bloomsbury': [51.5205, -0.1275], 'King\'s Cross': [51.5301, -0.1232],
    'City of London': [51.5155, -0.0922], 'Clerkenwell': [51.5239, -0.1050],
    'Farringdon': [51.5204, -0.1048], 'Tower Hill': [51.5101, -0.0763],
    'Bankside': [51.5055, -0.0935], 'South Bank': [51.5033, -0.1144],
    'London Bridge': [51.5074, -0.0877], 'Bermondsey': [51.4986, -0.0639],
    'Shoreditch': [51.5246, -0.0792], 'Spitalfields': [51.5171, -0.0754],
    'Hoxton': [51.5313, -0.0768], 'Islington': [51.5362, -0.1028],
    'South Kensington': [51.4940, -0.1741], 'Kensington': [51.4990, -0.1881],
    'Hyde Park': [51.5073, -0.1657], 'Notting Hill': [51.5093, -0.1963],
    'Chelsea': [51.4875, -0.1687], 'Pimlico': [51.4893, -0.1334],
    'Marylebone': [51.5186, -0.1499], 'St John\'s Wood': [51.5318, -0.1712],
    'Camden': [51.5390, -0.1426], 'Hampstead': [51.5563, -0.1762],
    'Greenwich': [51.4769, -0.0005], 'Wapping': [51.5044, -0.0558],
    'Brixton': [51.4613, -0.1145], 'Peckham': [51.4735, -0.0685],
    'Hackney': [51.5450, -0.0553], 'Battersea': [51.4762, -0.1473],
    'Fulham': [51.4712, -0.1949], 'Chiswick': [51.4922, -0.2624],
    'Bethnal Green': [51.5270, -0.0556], 'Dalston': [51.5459, -0.0754],
    'Clapham': [51.4619, -0.1378], 'Various': [51.5074, -0.1278],
    'Canary Wharf': [51.5054, -0.0235], 'Stratford': [51.5430, -0.0025],
    'Richmond': [51.4613, -0.3037], 'Wimbledon': [51.4214, -0.2064],
    'Wembley': [51.5560, -0.2796], 'Hampton Court': [51.4036, -0.3376],
    'Kew': [51.4780, -0.2957], 'Finsbury Park': [51.5643, -0.1066],
    'Elephant & Castle': [51.4949, -0.1005], 'Deptford': [51.4726, -0.0275]
  },

  // Adjacent neighbourhood pairs (walkable in ~10-15 min)
  ADJACENT: {
    'Westminster': ['St James\'s', 'Pimlico', 'South Bank', 'Mayfair'],
    'St James\'s': ['Westminster', 'Mayfair', 'Soho', 'West End'],
    'Soho': ['West End', 'Covent Garden', 'Mayfair', 'St James\'s', 'Bloomsbury'],
    'West End': ['Soho', 'Covent Garden', 'Mayfair', 'Bloomsbury'],
    'Covent Garden': ['Soho', 'West End', 'South Bank', 'Bankside'],
    'Mayfair': ['Westminster', 'St James\'s', 'Soho', 'Marylebone', 'Hyde Park'],
    'Bloomsbury': ['King\'s Cross', 'Soho', 'West End', 'Clerkenwell'],
    'King\'s Cross': ['Bloomsbury', 'Islington', 'Finsbury Park'],
    'City of London': ['Clerkenwell', 'Farringdon', 'Tower Hill', 'Bankside', 'London Bridge'],
    'Clerkenwell': ['City of London', 'Farringdon', 'Bloomsbury', 'Islington'],
    'Farringdon': ['Clerkenwell', 'City of London', 'Bloomsbury'],
    'Tower Hill': ['City of London', 'Wapping', 'London Bridge'],
    'Bankside': ['South Bank', 'London Bridge', 'Covent Garden', 'City of London'],
    'South Bank': ['Westminster', 'Bankside', 'Elephant & Castle', 'Covent Garden'],
    'London Bridge': ['Bankside', 'Bermondsey', 'Tower Hill', 'City of London'],
    'Bermondsey': ['London Bridge', 'Wapping', 'Peckham'],
    'Shoreditch': ['Spitalfields', 'Hoxton', 'Bethnal Green', 'Hackney'],
    'Spitalfields': ['Shoreditch', 'City of London', 'Tower Hill'],
    'Hoxton': ['Shoreditch', 'Dalston', 'Hackney', 'Islington'],
    'Islington': ['King\'s Cross', 'Clerkenwell', 'Hoxton', 'Finsbury Park'],
    'South Kensington': ['Kensington', 'Chelsea', 'Hyde Park'],
    'Kensington': ['South Kensington', 'Notting Hill', 'Hyde Park'],
    'Hyde Park': ['Kensington', 'Mayfair', 'Marylebone', 'South Kensington'],
    'Notting Hill': ['Kensington', 'Hyde Park'],
    'Chelsea': ['South Kensington', 'Pimlico', 'Battersea'],
    'Pimlico': ['Westminster', 'Chelsea'],
    'Marylebone': ['Mayfair', 'Hyde Park', 'St John\'s Wood', 'Bloomsbury'],
    'Camden': ['King\'s Cross', 'Hampstead'],
    'Elephant & Castle': ['South Bank', 'Bermondsey'],
  },

  // Nearest tube stations for key neighbourhoods
  TUBE_STATIONS: {
    'Westminster': 'Westminster', 'St James\'s': 'Green Park',
    'Soho': 'Tottenham Court Road', 'West End': 'Leicester Square',
    'Covent Garden': 'Covent Garden', 'Mayfair': 'Bond Street',
    'Bloomsbury': 'Russell Square', 'King\'s Cross': 'King\'s Cross St Pancras',
    'City of London': 'Bank', 'Clerkenwell': 'Farringdon',
    'Farringdon': 'Farringdon', 'Tower Hill': 'Tower Hill',
    'Bankside': 'Southwark', 'South Bank': 'Waterloo',
    'London Bridge': 'London Bridge', 'Bermondsey': 'Bermondsey',
    'Shoreditch': 'Shoreditch High Street', 'Spitalfields': 'Liverpool Street',
    'Hoxton': 'Hoxton', 'Islington': 'Angel',
    'South Kensington': 'South Kensington', 'Kensington': 'High Street Kensington',
    'Hyde Park': 'Hyde Park Corner', 'Notting Hill': 'Notting Hill Gate',
    'Chelsea': 'Sloane Square', 'Pimlico': 'Pimlico',
    'Marylebone': 'Baker Street', 'St John\'s Wood': 'St John\'s Wood',
    'Camden': 'Camden Town', 'Hampstead': 'Hampstead',
    'Greenwich': 'Cutty Sark (DLR)', 'Wapping': 'Wapping',
    'Brixton': 'Brixton', 'Peckham': 'Peckham Rye (Overground)',
    'Hackney': 'Hackney Central (Overground)', 'Battersea': 'Battersea Power Station',
    'Bethnal Green': 'Bethnal Green', 'Dalston': 'Dalston Junction (Overground)',
    'Clapham': 'Clapham Common', 'Canary Wharf': 'Canary Wharf',
    'Stratford': 'Stratford', 'Richmond': 'Richmond',
    'Wimbledon': 'Wimbledon', 'Wembley': 'Wembley Park',
    'Hampton Court': 'Hampton Court (Rail)', 'Kew': 'Kew Gardens',
    'Finsbury Park': 'Finsbury Park', 'Elephant & Castle': 'Elephant & Castle',
    'Deptford': 'Deptford Bridge (DLR)', 'Fulham': 'Fulham Broadway',
    'Chiswick': 'Turnham Green'
  },

  _leafletLoaded: false,
  _leafletLoading: false,
  _leafletCallbacks: [],

  /**
   * Ensure Leaflet is loaded, then call cb
   */
  ensureLeaflet(cb) {
    if (typeof L !== 'undefined') { cb(); return; }
    this._leafletCallbacks.push(cb);
    if (this._leafletLoading) return;
    this._leafletLoading = true;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      this._leafletLoaded = true;
      this._leafletCallbacks.forEach(fn => fn());
      this._leafletCallbacks = [];
    };
    document.head.appendChild(script);
  },

  /**
   * Calculate distance in km between two lat/lng pairs
   */
  distanceKm(a, b) {
    const R = 6371;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLon = (b[1] - a[1]) * Math.PI / 180;
    const s = Math.sin(dLat / 2) ** 2 +
      Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  },

  /**
   * Get travel suggestion between two neighbourhoods
   * Returns { method, icon, text, duration }
   */
  getTravelSuggestion(fromNeighbourhood, toNeighbourhood) {
    if (!fromNeighbourhood || !toNeighbourhood || fromNeighbourhood === toNeighbourhood) {
      return { method: 'walk', icon: '🚶', text: 'Walk', duration: '5 min' };
    }

    const fromCoords = this.COORDS[fromNeighbourhood] || this.COORDS['Various'];
    const toCoords = this.COORDS[toNeighbourhood] || this.COORDS['Various'];
    const dist = this.distanceKm(fromCoords, toCoords);

    // Check adjacency
    const adj = this.ADJACENT[fromNeighbourhood];
    const isAdjacent = adj && adj.includes(toNeighbourhood);

    const fromStation = this.TUBE_STATIONS[fromNeighbourhood] || '';
    const toStation = this.TUBE_STATIONS[toNeighbourhood] || '';

    if (dist < 0.8 || isAdjacent) {
      const walkMin = Math.round(dist * 12) || 10;
      return {
        method: 'walk',
        icon: '🚶',
        text: `Walk (${walkMin} min)`,
        duration: `${walkMin} min`,
        detail: `Easy walk between ${fromNeighbourhood} and ${toNeighbourhood}`
      };
    }

    if (dist < 2.5) {
      const walkMin = Math.round(dist * 12);
      return {
        method: 'walk-or-tube',
        icon: '🚇',
        text: `Tube or walk (${Math.round(dist * 5 + 5)} min)`,
        duration: `${Math.round(dist * 5 + 5)} min`,
        detail: `${fromStation} → ${toStation}. Or a ${walkMin}-min walk if you prefer.`
      };
    }

    if (dist < 6) {
      return {
        method: 'tube',
        icon: '🚇',
        text: `Tube (${Math.round(dist * 4 + 5)} min)`,
        duration: `${Math.round(dist * 4 + 5)} min`,
        detail: `Take the Tube from ${fromStation} to ${toStation}`
      };
    }

    // Far — tube or bus
    return {
      method: 'tube',
      icon: '🚇',
      text: `Tube (${Math.round(dist * 3.5 + 10)} min)`,
      duration: `${Math.round(dist * 3.5 + 10)} min`,
      detail: `Take the Tube from ${fromStation} to ${toStation}. Use an Oyster card or contactless.`
    };
  },

  /**
   * Generate HTML for travel directions between activities
   */
  renderTravelDirections(activities) {
    if (!activities || activities.length < 2) return '';

    let html = '<div class="day-travel-directions" style="margin:0.75rem 1.5rem 0.5rem;padding:0.75rem 1rem;background:var(--color-surface-alt, #f8f7f4);border-radius:8px;border-left:3px solid var(--color-accent, #C9A84C);">';
    html += '<div style="font-weight:600;font-size:0.8rem;margin-bottom:0.5rem;color:var(--color-primary, #1B2A4A);">🗺️ Getting Around This Day</div>';

    for (let i = 0; i < activities.length - 1; i++) {
      const from = activities[i];
      const to = activities[i + 1];
      const suggestion = this.getTravelSuggestion(from.neighbourhood, to.neighbourhood);

      html += `
        <div style="display:flex;align-items:center;gap:0.5rem;padding:0.35rem 0;font-size:0.78rem;${i < activities.length - 2 ? 'border-bottom:1px solid var(--color-border, #e5e1d8);' : ''}">
          <span style="min-width:1.2rem;text-align:center;">${suggestion.icon}</span>
          <span style="color:var(--color-text-muted, #6B7280);">
            <strong>${from.name}</strong> → <strong>${to.name}</strong>
          </span>
          <span style="margin-left:auto;white-space:nowrap;font-weight:600;color:var(--color-primary, #1B2A4A);">${suggestion.text}</span>
        </div>`;
    }

    html += '</div>';
    return html;
  },

  /**
   * Render a mini Leaflet map into a container element for a single day's activities
   * @param {HTMLElement|string} container - DOM element or ID
   * @param {Array} activities - array of activity objects with .neighbourhood
   * @param {Object} opts - { color, height }
   */
  renderMap(container, activities, opts = {}) {
    if (typeof container === 'string') container = document.getElementById(container);
    if (!container || !activities || !activities.length) return;

    const color = opts.color || '#E74C3C';
    const height = opts.height || '250px';
    container.style.height = height;
    container.style.borderRadius = '10px';
    container.style.overflow = 'hidden';
    container.style.marginBottom = '0.5rem';

    this.ensureLeaflet(() => {
      const m = L.map(container, { scrollWheelZoom: false, zoomControl: true }).setView([51.5074, -0.1278], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18
      }).addTo(m);

      const coords = [];
      activities.forEach((activity, idx) => {
        const c = this.COORDS[activity.neighbourhood] || this.COORDS['Various'];
        if (!c) return;
        const jitter = [(Math.random() - 0.5) * 0.002, (Math.random() - 0.5) * 0.002];
        const pos = [c[0] + jitter[0], c[1] + jitter[1]];

        // Numbered marker
        const icon = L.divIcon({
          className: 'day-map-marker',
          html: `<div style="background:${color};color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${idx + 1}</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(pos, { icon }).addTo(m);
        marker.bindPopup(`<strong>${idx + 1}. ${activity.name}</strong><br><em>${activity.period || ''}</em><br>📍 ${activity.neighbourhood || ''}`);
        coords.push(pos);
      });

      // Draw route line
      if (coords.length > 1) {
        L.polyline(coords, { color, weight: 3, dashArray: '6 4', opacity: 0.7 }).addTo(m);
        const bounds = L.latLngBounds(coords);
        m.fitBounds(bounds.pad(0.15));
      } else if (coords.length === 1) {
        m.setView(coords[0], 14);
      }

      // Fix map size after render
      setTimeout(() => m.invalidateSize(), 200);
    });
  }
};
