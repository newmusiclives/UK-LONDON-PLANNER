document.addEventListener('DOMContentLoaded', () => {
  UI.init();

  const state = State.get();
  const itinerary = State.getItinerary();

  if (!itinerary) {
    document.querySelector('.main').innerHTML = `
      <div class="section" style="text-align: center; padding: 100px 20px;">
        <h2>No Itinerary Found</h2>
        <p style="margin: 1rem 0 2rem; color: var(--color-text-muted);">
          Create your personalised London itinerary first.
        </p>
        <a href="wizard.html" class="btn btn--primary btn--large">Start Planning</a>
      </div>
    `;
    return;
  }

  const isPaid = State.isPaid();
  const price = State.getPrice(itinerary.tripDays);

  renderItinerary(itinerary, isPaid, price);
});

function renderItinerary(itinerary, isPaid, price) {
  const main = document.querySelector('.main');
  try {
  const interestLabels = (itinerary.interests||[]).map(id => {
    const found = CONFIG.interests.find(i => i.id === id);
    return found ? found.icon + ' ' + found.label : id;
  }).join(', ');

  const totalCost = itinerary.days.reduce((sum, d) => sum + (d.dailyCost || 0), 0);

  main.innerHTML = `
    <div class="itinerary-page">
      <div class="itinerary-header">
        <h1>Your London Itinerary</h1>
        <div class="divider"></div>
        <div class="itinerary-header__meta">
          <span>📅 ${itinerary.tripDays} ${itinerary.tripDays === 1 ? 'Day' : 'Days'}</span>
          <span>🎯 ${interestLabels}</span>
        </div>
      </div>

      ${isPaid ? `
        <div class="itinerary-toolbar">
          <button class="btn btn--primary" id="btn-download-pdf">📄 Download PDF</button>
          <button class="btn btn--outline" onclick="window.print()">🖨️ Print</button>
          <button class="btn btn--secondary" id="btn-share">📤 Share Itinerary</button>
          <button class="btn btn--outline" id="btn-packing-list">🧳 Packing List</button>
          <button class="btn btn--outline" id="btn-pocket-cards">🃏 Pocket Cards</button>
          <a href="wizard.html" class="btn btn--outline">🔄 Create New</a>
        </div>
      ` : `
        <div style="background:linear-gradient(135deg, #059669 0%, #047857 100%);border-radius:var(--radius-lg);padding:1.5rem 2rem;margin-bottom:2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
          <div>
            <h4 style="color:white;margin:0 0 0.25rem;">🎉 Free Preview — First 2 Days Unlocked</h4>
            <p style="color:rgba(255,255,255,0.85);font-size:0.9rem;margin:0;">Browse your personalised itinerary below. Love it? Unlock all ${itinerary.tripDays} days for just $${price}.</p>
          </div>
          <button class="btn btn--primary" onclick="document.getElementById('purchase-section')?.scrollIntoView({behavior:'smooth'})">
            Unlock All ${itinerary.tripDays} Days — $${price}
          </button>
        </div>
      `}

      <!-- Budget Tracker -->
      <div class="budget-tracker" style="background:var(--color-surface);border-radius:var(--radius-lg);padding:1.5rem;margin-bottom:2rem;box-shadow:var(--shadow-sm);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
          <div>
            <h4 style="margin-bottom:0.25rem;">Estimated Trip Budget</h4>
            <p style="color:var(--color-text-muted);font-size:0.85rem;">Based on activities, dining, and entertainment</p>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-heading);font-size:2rem;font-weight:700;color:var(--color-accent);">£${totalCost.toFixed(0)}</div>
            <div style="font-size:0.8rem;color:var(--color-text-muted);">~£${(totalCost / itinerary.tripDays).toFixed(0)}/day (activities only)</div>
          </div>
        </div>
        <div style="margin-top:1rem;background:var(--color-border);border-radius:var(--radius-full);height:8px;overflow:hidden;">
          <div style="background:linear-gradient(90deg, var(--color-success), var(--color-accent));height:100%;border-radius:var(--radius-full);width:100%;"></div>
        </div>
      </div>

      <!-- Interactive Map -->
      <div id="itinerary-map" style="height:400px;border-radius:var(--radius-lg);margin-bottom:2rem;background:var(--color-surface-alt);display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:var(--shadow-sm);">
        <div id="map-container" style="width:100%;height:100%;"></div>
      </div>
      <div id="map-day-selector" style="display:flex;gap:0.5rem;margin-bottom:2rem;flex-wrap:wrap;justify-content:center;">
        <button class="btn btn--small btn--primary map-day-btn active" data-day="all">All Days</button>
        ${itinerary.days.map(d => `
          <button class="btn btn--small btn--outline map-day-btn" data-day="${d.dayNumber}">Day ${d.dayNumber}</button>
        `).join('')}
      </div>

      <!-- Hotel Recommendation -->
      ${itinerary.hotel ? renderHotelCard(itinerary.hotel) : ''}

      <!-- Day Cards -->
      <div id="days-container">
        ${itinerary.days.map((day, index) => {
          const locked = !isPaid && index >= 2;
          return renderDayCard(day, locked);
        }).join('')}
      </div>

      ${!isPaid ? renderPurchaseBanner(price, itinerary.tripDays) : ''}

      <!-- Countdown Timer (if trip dates set) -->
      <div id="countdown-section"></div>

      <!-- Concierge Add-on -->
      <div style="background:var(--color-surface);border:2px solid var(--color-accent);border-radius:var(--radius-xl);padding:2.5rem;text-align:center;margin-top:2rem;">
        <div style="font-size:2rem;margin-bottom:0.5rem;">🛎️</div>
        <h3 style="margin-bottom:0.5rem;">Add Booking Concierge — $150</h3>
        <p style="color:var(--color-text-muted);max-width:500px;margin:0 auto 1rem;font-size:0.95rem;">
          We'll handle as many of your bookings and reservations as possible — restaurants, attractions, theatre tickets, tours, and more.
        </p>
        <ul style="list-style:none;max-width:400px;margin:0 auto 1.5rem;text-align:left;">
          ${CONFIG.concierge.features.map(f => '<li style="padding:0.3rem 0;font-size:0.85rem;"><span style="color:var(--color-success);font-weight:700;margin-right:0.5rem;">✓</span>' + f + '</li>').join('')}
        </ul>
        <button class="btn btn--primary btn--large" onclick="handleConcierge()">Add Concierge — $150</button>
      </div>

      <!-- Consultation Upsell -->
      <div class="purchase-banner" style="background: linear-gradient(135deg, #2A3F6B 0%, #1B2A4A 100%); margin-top: 2rem;">
        <h3>Want a Truly Bespoke Experience?</h3>
        <p>Book a 1-on-1 consultation with a London expert who'll customise every detail of your trip</p>
        <div class="purchase-banner__price">$75</div>
        <p style="color: var(--color-accent); font-size: 0.9rem; margin-bottom: 1.5rem;">1 Hour Private Video Consultation</p>
        <a href="consultation.html" class="btn btn--primary btn--large">Book Consultation</a>
      </div>

      <p class="affiliate-disclosure" style="text-align: center; margin-top: 2rem;">
        ${CONFIG.affiliate.disclosureText}
      </p>
    </div>

    <!-- Packing List Modal -->
    <div class="modal-overlay" id="packing-modal">
      <div class="modal" style="max-width:600px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <h3 style="margin:0;">🧳 Your Packing List</h3>
          <button onclick="document.getElementById('packing-modal').classList.remove('active')" style="font-size:1.5rem;background:none;border:none;cursor:pointer;">✕</button>
        </div>
        <div id="packing-list-content"></div>
      </div>
    </div>

    <!-- Share Modal -->
    <div class="modal-overlay" id="share-modal">
      <div class="modal" style="max-width:500px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <h3 style="margin:0;">📤 Share Your Itinerary</h3>
          <button onclick="document.getElementById('share-modal').classList.remove('active')" style="font-size:1.5rem;background:none;border:none;cursor:pointer;">✕</button>
        </div>
        <div id="share-content">
          <p style="color:var(--color-text-muted);margin-bottom:1rem;">Share your ${itinerary.tripDays}-day London itinerary with your travel companions:</p>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            <button class="btn btn--primary btn--full" onclick="shareVia('whatsapp')">💬 Share via WhatsApp</button>
            <button class="btn btn--secondary btn--full" onclick="shareVia('email')">📧 Share via Email</button>
            <button class="btn btn--outline btn--full" onclick="shareVia('copy')">📋 Copy Share Link</button>
          </div>
        </div>
      </div>
    </div>

    <div id="pdf-container"></div>
  `;

  // Initialize map
  initMap(itinerary);

  // Map day selector
  document.querySelectorAll('.map-day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-day-btn').forEach(b => {
        b.classList.remove('active', 'btn--primary');
        b.classList.add('btn--outline');
      });
      btn.classList.add('active', 'btn--primary');
      btn.classList.remove('btn--outline');
      filterMapDay(btn.dataset.day, itinerary);
    });
  });

  // PDF download handler
  if (isPaid) {
    const pdfBtn = document.getElementById('btn-download-pdf');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', () => generatePDF(itinerary));
    }

    // Share button
    const shareBtn = document.getElementById('btn-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        document.getElementById('share-modal').classList.add('active');
      });
    }

    // Packing list button
    const packingBtn = document.getElementById('btn-packing-list');
    if (packingBtn) {
      packingBtn.addEventListener('click', () => {
        renderPackingList(itinerary);
        document.getElementById('packing-modal').classList.add('active');
      });
    }

    // Pocket cards button
    const pocketBtn = document.getElementById('btn-pocket-cards');
    if (pocketBtn) {
      pocketBtn.addEventListener('click', () => generatePocketCards(itinerary));
    }

    // Drag-and-drop reordering (paid users only)
    if (typeof Sortable !== 'undefined') {
      const container = document.getElementById('days-container');
      if (container) {
        Sortable.create(container, {
          animation: 200,
          handle: '.day-card__header',
          ghostClass: 'day-card--dragging',
          onEnd: (evt) => {
            // Renumber days after reorder
            const dayCards = container.querySelectorAll('.day-card');
            dayCards.forEach((card, i) => {
              const numEl = card.querySelector('.day-card__day-num');
              if (numEl) numEl.textContent = `Day ${i + 1}`;
            });
            UI.showToast('Days reordered! Drag headers to rearrange.');
          }
        });
      }
    }
  }

  // Countdown timer
  renderCountdown(itinerary);

  } catch (e) {
    console.error('Itinerary render error:', e);
    main.innerHTML = `
      <div class="section" style="text-align:center;padding:60px 20px;">
        <h2>Something went wrong</h2>
        <p style="color:var(--color-text-muted);margin:1rem 0;">There was an error displaying your itinerary. This can happen if your browser data is outdated.</p>
        <p style="color:var(--color-error);font-size:0.85rem;margin-bottom:2rem;">${e.message}</p>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
          <a href="wizard.html" class="btn btn--primary btn--large">Generate New Itinerary</a>
          <button class="btn btn--outline btn--large" onclick="localStorage.clear();location.reload();">Clear Data & Retry</button>
        </div>
      </div>
    `;
  }
}

function renderHotelCard(hotel) {
  return `
    <div class="hotel-card" style="margin: 0 0 2rem 0;">
      <div class="hotel-card__title">🏨 Recommended Accommodation</div>
      <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem;">${hotel.name}</h3>
      <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-bottom: 0.75rem;">${hotel.description}</p>
      <div class="activity__details" style="margin-bottom: 0.75rem;">
        <span class="activity__detail">📍 ${hotel.neighbourhood}</span>
        <span class="activity__detail">⭐ ${hotel.starRating}-star</span>
        <span class="activity__detail">💰 ${hotel.priceRange}</span>
      </div>
      ${hotel.tips ? `<div class="activity__tip">${hotel.tips}</div>` : ''}
      ${hotel.affiliateUrl ? `
        <div style="margin-top: 1rem;">
          <a href="${AffiliateLinks.auto(hotel.affiliateUrl)}" target="_blank" rel="noopener" class="affiliate-cta">
            ${hotel.affiliateLabel || 'Check Availability'} →
          </a>
        </div>
      ` : ''}
    </div>
  `;
}

function renderDayCard(day, locked) {
  const activities = day.activities || [];
  const dailyCost = day.dailyCost || activities.reduce((sum, a) => sum + (a.estimatedCostValue || 0), 0);
  return `
    <div class="day-card ${locked ? 'day-card--locked' : ''}" id="day-${day.dayNumber}">
      <div class="day-card__header">
        <div>
          <div class="day-card__day-num">Day ${day.dayNumber}</div>
          <div class="day-card__theme">${day.theme}</div>
        </div>
        <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
          <div class="day-card__neighbourhoods">
            ${(day.neighbourhoods||[]).slice(0, 3).map(n =>
              `<span class="badge badge--accent">${n}</span>`
            ).join('')}
          </div>
          <div style="font-size:0.85rem;font-weight:600;color:var(--color-accent);">£${dailyCost.toFixed(0)} est.</div>
        </div>
      </div>
      ${day.travelWarning ? `<div style="background:#FEF3C7;padding:0.6rem 1rem;font-size:0.8rem;color:#92400E;display:flex;align-items:center;gap:0.5rem;"><span>🚇</span> ${day.travelWarning}</div>` : ''}
      <div class="day-card__body">
        <div class="timeline">
          ${activities.map(activity => renderActivity(activity)).join('')}
        </div>
      </div>
      ${locked ? `
        <div class="lock-banner">
          <div class="lock-banner__icon">🔒</div>
          <div class="lock-banner__text">Day ${day.dayNumber}: ${day.theme}</div>
          <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:0.75rem;">${activities.length} activities planned across ${(day.neighbourhoods||[]).slice(0,2).join(' & ')}</p>
          <button class="btn btn--primary btn--small" onclick="document.getElementById('purchase-section')?.scrollIntoView({behavior:'smooth'})">
            Unlock All Days
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function renderActivity(activity) {
  const travelInfo = activity.travelFromPrev && activity.travelFromPrev > 0
    ? `<div style="font-size:0.7rem;color:var(--color-text-muted);margin-bottom:0.5rem;display:flex;align-items:center;gap:0.35rem;">🚶 ~${activity.travelFromPrev} min travel from previous</div>`
    : '';
  return `
    <div class="activity activity--${activity.period}">
      ${travelInfo}
      <div class="activity__time">
        ${activity.timeSlot}
        <span class="activity__period activity__period--${activity.period}">${activity.period}</span>
      </div>
      <div class="activity__name">${activity.name}</div>
      <p class="activity__description">${activity.description}</p>
      <div class="activity__details">
        ${activity.neighbourhood ? `<span class="activity__detail">📍 ${activity.neighbourhood}</span>` : ''}
        <span class="activity__detail">💰 ${activity.estimatedCost}</span>
        ${activity.duration ? `<span class="activity__detail">⏱️ ${activity.duration}</span>` : ''}
        ${activity.address ? `<span class="activity__detail">🗺️ ${activity.address}</span>` : ''}
      </div>
      ${activity.tips ? `<div class="activity__tip">${activity.tips}</div>` : ''}
      ${activity.affiliateUrl ? `
        <div class="activity__cta">
          <a href="${AffiliateLinks.auto(activity.affiliateUrl)}" target="_blank" rel="noopener" class="affiliate-cta">
            ${activity.affiliateLabel || 'Book Now'} →
          </a>
        </div>
      ` : ''}
    </div>
  `;
}

function renderPurchaseBanner(price, tripDays) {
  const tier = State.getPriceTier(tripDays);

  return `
    <div class="purchase-banner" id="purchase-section">
      <h3>Unlock Your Complete Itinerary</h3>
      <p>Get the full ${tripDays}-day personalised itinerary with all recommendations, tips, and booking links</p>
      <div class="purchase-banner__price">$${price}</div>
      <ul class="purchase-banner__features">
        <li>All ${tripDays} days unlocked</li>
        <li>Downloadable PDF guide</li>
        <li>Interactive map with all locations</li>
        <li>Booking links & insider tips</li>
        <li>Smart packing list</li>
        <li>Money-saving local secrets</li>
      </ul>
      <button class="btn btn--primary btn--large" id="btn-purchase" onclick="handlePurchase()">
        Unlock Now — $${price}
      </button>
      <p style="font-size: 0.8rem; margin-top: 1rem; color: rgba(255,255,255,0.6);">
        Secure payment via Manifest Financial. Instant access after purchase.
      </p>
    </div>
  `;
}

// ============================================================
// INTERACTIVE MAP (Leaflet.js)
// ============================================================
let map = null;
let mapMarkers = [];

function initMap(itinerary) {
  const container = document.getElementById('map-container');
  if (!container) return;

  // Check if Leaflet is available
  if (typeof L === 'undefined') {
    container.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--color-text-muted);">
        <div style="font-size:2rem;margin-bottom:0.5rem;">🗺️</div>
        <p>Interactive map showing all your activities</p>
        <p style="font-size:0.8rem;">Map loads with your itinerary locations</p>
      </div>
    `;
    // Load Leaflet dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setupMap(itinerary);
    document.head.appendChild(script);
    return;
  }

  setupMap(itinerary);
}

// London neighbourhood approximate coordinates
const NEIGHBOURHOOD_COORDS = {
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
};

function setupMap(itinerary) {
  const container = document.getElementById('map-container');
  container.innerHTML = '';

  map = L.map(container).setView([51.5074, -0.1278], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
  }).addTo(map);

  addMarkersForAllDays(itinerary);
}

function addMarkersForAllDays(itinerary) {
  clearMarkers();

  const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#34495E',
    '#E91E63', '#00BCD4', '#8BC34A', '#FF9800', '#673AB7', '#009688', '#FF5722', '#607D8B',
    '#CDDC39', '#795548', '#03A9F4', '#4CAF50', '#FFC107'];

  itinerary.days.forEach((day, dayIdx) => {
    const color = colors[dayIdx % colors.length];
    day.activities.forEach(activity => {
      const coords = NEIGHBOURHOOD_COORDS[activity.neighbourhood] || NEIGHBOURHOOD_COORDS['Various'];
      if (coords) {
        const jitter = [(Math.random() - 0.5) * 0.005, (Math.random() - 0.5) * 0.005];
        const marker = L.circleMarker([coords[0] + jitter[0], coords[1] + jitter[1]], {
          radius: 8, fillColor: color, color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.8
        }).addTo(map);

        marker.bindPopup(`
          <strong>Day ${day.dayNumber}: ${activity.name}</strong><br>
          <em>${activity.period}</em> · ${activity.neighbourhood}<br>
          ${activity.estimatedCost}
        `);
        marker._dayNumber = day.dayNumber;
        mapMarkers.push(marker);
      }
    });
  });
}

function clearMarkers() {
  mapMarkers.forEach(m => map.removeLayer(m));
  mapMarkers = [];
}

function filterMapDay(dayFilter, itinerary) {
  if (dayFilter === 'all') {
    addMarkersForAllDays(itinerary);
  } else {
    clearMarkers();
    const dayNum = parseInt(dayFilter);
    const day = itinerary.days.find(d => d.dayNumber === dayNum);
    if (!day) return;

    const colors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22'];
    const color = colors[(dayNum - 1) % colors.length];
    const coords = [];

    day.activities.forEach(activity => {
      const c = NEIGHBOURHOOD_COORDS[activity.neighbourhood] || NEIGHBOURHOOD_COORDS['Various'];
      if (c) {
        const jitter = [(Math.random() - 0.5) * 0.003, (Math.random() - 0.5) * 0.003];
        const pos = [c[0] + jitter[0], c[1] + jitter[1]];
        const marker = L.circleMarker(pos, {
          radius: 10, fillColor: color, color: '#fff', weight: 2, opacity: 1, fillOpacity: 0.9
        }).addTo(map);

        marker.bindPopup(`
          <strong>${activity.name}</strong><br>
          <em>${activity.period}</em> · ${activity.neighbourhood}<br>
          ${activity.estimatedCost}
        `);
        mapMarkers.push(marker);
        coords.push(pos);
      }
    });

    // Draw walking route line
    if (coords.length > 1) {
      const polyline = L.polyline(coords, { color, weight: 3, dashArray: '8 4', opacity: 0.7 }).addTo(map);
      mapMarkers.push(polyline);
      map.fitBounds(polyline.getBounds().pad(0.2));
    }

    // Scroll to day card
    const dayCard = document.getElementById(`day-${dayNum}`);
    if (dayCard) dayCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ============================================================
// SHARING
// ============================================================
function shareVia(method) {
  const itinerary = State.getItinerary();
  if (!itinerary) return;

  const shareData = btoa(JSON.stringify({
    d: itinerary.tripDays,
    i: itinerary.interests,
    t: itinerary.days.map(d => d.theme)
  }));

  const shareUrl = `${window.location.origin}/itinerary.html?ref=share`;
  const shareText = `Check out my ${itinerary.tripDays}-day London itinerary! ${itinerary.days.map(d => d.theme).join(', ')}`;

  switch (method) {
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank');
      break;
    case 'email':
      window.location.href = `mailto:?subject=My London Itinerary&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
      break;
    case 'copy':
      navigator.clipboard.writeText(shareUrl).then(() => {
        UI.showToast('Link copied to clipboard!');
      }).catch(() => {
        UI.showToast('Could not copy — try manually');
      });
      break;
  }

  document.getElementById('share-modal').classList.remove('active');
}

// ============================================================
// PACKING LIST
// ============================================================
function renderPackingList(itinerary) {
  const list = Engine.generatePackingList(itinerary);
  const container = document.getElementById('packing-list-content');

  const renderCategory = (title, icon, items) => `
    <div style="margin-bottom:1.5rem;">
      <h4 style="margin-bottom:0.75rem;">${icon} ${title}</h4>
      ${items.map(item => `
        <label style="display:flex;align-items:center;gap:0.5rem;padding:0.3rem 0;cursor:pointer;">
          <input type="checkbox" style="width:18px;height:18px;">
          <span style="font-size:0.9rem;">${item}</span>
        </label>
      `).join('')}
    </div>
  `;

  container.innerHTML = `
    ${renderCategory('Essentials', '📋', list.essentials)}
    ${renderCategory('Clothing', '👕', list.clothing)}
    ${renderCategory('Tech & Gadgets', '📱', list.tech)}
    ${renderCategory('Documents', '📄', list.documents)}
    <button class="btn btn--primary btn--full" onclick="window.print()" style="margin-top:1rem;">🖨️ Print Packing List</button>
  `;
}

// ============================================================
// PAYMENT HANDLERS
// ============================================================
function handleConcierge() {
  Payment.initiateConcierge();
}

function handlePurchase() {
  const state = State.get();
  Payment.initiatePurchase(state.tripDays);
}

// ============================================================
// PDF GENERATION
// ============================================================
async function generatePDF(itinerary) {
  const btn = document.getElementById('btn-download-pdf');
  btn.disabled = true;
  btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:8px;"></div> Generating PDF...';

  const container = document.getElementById('pdf-container');
  container.innerHTML = buildPDFContent(itinerary);
  container.classList.add('rendering');

  try {
    if (typeof html2pdf !== 'undefined') {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `London-Itinerary-${itinerary.tripDays}days.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      await html2pdf().set(opt).from(container).save();
    } else {
      window.print();
    }
  } catch (e) {
    console.error('PDF generation failed:', e);
    UI.showToast('PDF generation failed. Try printing instead.');
  }

  container.classList.remove('rendering');
  container.innerHTML = '';
  btn.disabled = false;
  btn.innerHTML = '📄 Download PDF';
}

function buildPDFContent(itinerary) {
  return `
    <div class="pdf-header" style="text-align:center; border-bottom:2px solid #C9A84C; padding-bottom:20px; margin-bottom:30px;">
      <h1 style="font-family:Georgia,serif; color:#1B2A4A; font-size:24pt; margin:0;">Your London Itinerary</h1>
      <p style="color:#666; font-size:11pt; margin:8px 0 0;">${itinerary.tripDays} Days | Created ${new Date(itinerary.generatedAt).toLocaleDateString()}</p>
    </div>

    ${itinerary.hotel ? `
      <div style="background:#f5f3ee; padding:15px; border-radius:8px; margin-bottom:25px;">
        <h3 style="font-family:Georgia,serif; color:#1B2A4A; font-size:13pt; margin:0 0 5px;">Recommended Hotel: ${itinerary.hotel.name}</h3>
        <p style="color:#666; font-size:10pt; margin:0;">${itinerary.hotel.neighbourhood} | ${itinerary.hotel.priceRange} | ${itinerary.hotel.address}</p>
      </div>
    ` : ''}

    ${itinerary.days.map(day => `
      <div class="pdf-day" style="page-break-inside:avoid; margin-bottom:25px;">
        <h2 style="font-family:Georgia,serif; color:#1B2A4A; font-size:15pt; border-bottom:1px solid #C9A84C; padding-bottom:5px; margin:0 0 10px;">
          Day ${day.dayNumber}: ${day.theme}
        </h2>
        <p style="color:#888; font-size:9pt; margin:0 0 10px;">${day.neighbourhoods.join(' • ')}</p>
        ${day.activities.map(a => `
          <div class="pdf-activity" style="padding:8px 0; border-bottom:1px solid #eee;">
            <strong style="color:#1B2A4A; font-size:10pt;">${a.timeSlot} — ${a.name}</strong>
            <span style="color:#C9A84C; font-size:9pt;"> (${a.estimatedCost})</span>
            <p style="color:#555; font-size:9pt; margin:3px 0 0;">${a.description}</p>
            ${a.tips ? `<p style="color:#888; font-size:8pt; margin:3px 0 0; font-style:italic;">Tip: ${a.tips}</p>` : ''}
            ${a.address ? `<p style="color:#999; font-size:8pt; margin:2px 0 0;">📍 ${a.address}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `).join('')}

    <div style="text-align:center; margin-top:30px; padding-top:20px; border-top:2px solid #C9A84C;">
      <p style="color:#1B2A4A; font-family:Georgia,serif; font-size:12pt;">London & UK Planner</p>
      <p style="color:#888; font-size:9pt;">Enjoy your trip!</p>
    </div>
  `;
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================
function renderCountdown(itinerary) {
  const section = document.getElementById('countdown-section');
  if (!section) return;

  const dates = itinerary.travelDates || State.get().travelDates;
  if (!dates || !dates.start) return;

  const tripDate = new Date(dates.start);
  const now = new Date();
  const diff = tripDate - now;

  if (diff <= 0) {
    section.innerHTML = `
      <div style="background:linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));border-radius:var(--radius-lg);padding:2rem;text-align:center;margin-top:2rem;color:var(--color-primary);">
        <div style="font-size:2rem;margin-bottom:0.5rem;">🎉</div>
        <h3 style="color:var(--color-primary);margin-bottom:0.25rem;">Your Trip Is Here!</h3>
        <p style="font-size:0.9rem;">Have an incredible time in London. Refer to this itinerary as you explore!</p>
      </div>
    `;
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);

  section.innerHTML = `
    <div style="background:var(--color-primary);border-radius:var(--radius-lg);padding:2rem;text-align:center;margin-top:2rem;color:white;">
      <p style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--color-accent);margin-bottom:0.5rem;">Your London Trip Starts In</p>
      <div style="display:flex;justify-content:center;gap:2rem;margin-bottom:1rem;">
        <div>
          <div style="font-family:var(--font-heading);font-size:3rem;font-weight:700;color:var(--color-accent);">${days}</div>
          <div style="font-size:0.75rem;color:rgba(255,255,255,0.6);">DAYS</div>
        </div>
        <div>
          <div style="font-family:var(--font-heading);font-size:3rem;font-weight:700;color:var(--color-accent);">${hours}</div>
          <div style="font-size:0.75rem;color:rgba(255,255,255,0.6);">HOURS</div>
        </div>
      </div>
      <p style="font-size:0.85rem;color:rgba(255,255,255,0.7);">${tripDate.toLocaleDateString('en-GB', {weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
      ${days <= 14 ? '<p style="font-size:0.8rem;color:var(--color-accent);margin-top:0.5rem;">Time to book your restaurants and attractions!</p>' : ''}
    </div>
  `;
}

// ============================================================
// POCKET CARDS — Printable wallet-sized cards per day
// ============================================================
function generatePocketCards(itinerary) {
  if (typeof Analytics !== 'undefined') Analytics.pdfDownload();

  const container = document.getElementById('pdf-container');
  container.innerHTML = `
    <div style="font-family:Arial,sans-serif;font-size:9pt;width:210mm;">
      ${itinerary.days.map(day => {
        const acts = (day.activities || []);
        return `
          <div style="border:2px solid #C9A84C;border-radius:8px;padding:12px;margin-bottom:10px;page-break-inside:avoid;max-width:90mm;display:inline-block;vertical-align:top;margin-right:10px;">
            <div style="font-weight:bold;font-size:11pt;color:#1B2A4A;border-bottom:1px solid #C9A84C;padding-bottom:4px;margin-bottom:6px;">
              Day ${day.dayNumber}: ${day.theme}
            </div>
            ${acts.map(a => `
              <div style="margin-bottom:4px;">
                <strong style="font-size:8pt;">${a.timeSlot}</strong>
                <span style="font-size:8.5pt;"> ${a.name}</span>
                ${a.address ? `<br><span style="font-size:7pt;color:#888;">📍 ${a.address}</span>` : ''}
              </div>
            `).join('')}
          </div>
        `;
      }).join('')}
    </div>
  `;
  container.classList.add('rendering');

  if (typeof html2pdf !== 'undefined') {
    html2pdf().set({
      margin: 5,
      filename: `London-Pocket-Cards-${itinerary.tripDays}days.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    }).from(container).save().then(() => {
      container.classList.remove('rendering');
      container.innerHTML = '';
    });
  } else {
    window.print();
    container.classList.remove('rendering');
    container.innerHTML = '';
  }
}
