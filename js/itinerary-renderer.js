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
  const interestLabels = itinerary.interests.map(id => {
    const found = CONFIG.interests.find(i => i.id === id);
    return found ? found.icon + ' ' + found.label : id;
  }).join(', ');

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
          <button class="btn btn--outline" onclick="window.print()">🖨️ Print Itinerary</button>
          <a href="wizard.html" class="btn btn--secondary">🔄 Create New</a>
        </div>
      ` : ''}

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

    <div id="pdf-container"></div>
  `;

  // PDF download handler
  if (isPaid) {
    const pdfBtn = document.getElementById('btn-download-pdf');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', () => generatePDF(itinerary));
    }
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
          <a href="${hotel.affiliateUrl}" target="_blank" rel="noopener" class="affiliate-cta">
            ${hotel.affiliateLabel || 'Check Availability'} →
          </a>
        </div>
      ` : ''}
    </div>
  `;
}

function renderDayCard(day, locked) {
  return `
    <div class="day-card ${locked ? 'day-card--locked' : ''}">
      <div class="day-card__header">
        <div>
          <div class="day-card__day-num">Day ${day.dayNumber}</div>
          <div class="day-card__theme">${day.theme}</div>
        </div>
        <div class="day-card__neighbourhoods">
          ${day.neighbourhoods.slice(0, 3).map(n =>
            `<span class="badge badge--accent">${n}</span>`
          ).join('')}
        </div>
      </div>
      <div class="day-card__body">
        <div class="timeline">
          ${day.activities.map(activity => renderActivity(activity)).join('')}
        </div>
      </div>
      ${locked ? `
        <div class="lock-banner">
          <div class="lock-banner__icon">🔒</div>
          <div class="lock-banner__text">Unlock to see Day ${day.dayNumber}</div>
          <button class="btn btn--primary btn--small" onclick="document.getElementById('purchase-section')?.scrollIntoView({behavior:'smooth'})">
            Unlock Full Itinerary
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

function renderActivity(activity) {
  return `
    <div class="activity activity--${activity.period}">
      <div class="activity__time">
        ${activity.timeSlot}
        <span class="activity__period activity__period--${activity.period}">${activity.period}</span>
      </div>
      <div class="activity__name">${activity.name}</div>
      <p class="activity__description">${activity.description}</p>
      <div class="activity__details">
        ${activity.neighbourhood ? `<span class="activity__detail">📍 ${activity.neighbourhood}</span>` : ''}
        <span class="activity__detail">💰 ${activity.estimatedCost}</span>
        ${activity.address ? `<span class="activity__detail">🗺️ ${activity.address}</span>` : ''}
      </div>
      ${activity.tips ? `<div class="activity__tip">${activity.tips}</div>` : ''}
      ${activity.affiliateUrl ? `
        <div class="activity__cta">
          <a href="${activity.affiliateUrl}" target="_blank" rel="noopener" class="affiliate-cta">
            ${activity.affiliateLabel || 'Book Now'} →
          </a>
        </div>
      ` : ''}
    </div>
  `;
}

function renderPurchaseBanner(price, tripDays) {
  const tier = State.getPriceTier(tripDays);
  const tierInfo = CONFIG.pricing[tier];

  return `
    <div class="purchase-banner" id="purchase-section">
      <h3>Unlock Your Complete Itinerary</h3>
      <p>Get the full ${tripDays}-day personalised itinerary with all recommendations, tips, and booking links</p>
      <div class="purchase-banner__price">$${price}</div>
      <ul class="purchase-banner__features">
        <li>All ${tripDays} days unlocked</li>
        <li>Downloadable PDF guide</li>
        <li>Booking links & insider tips</li>
        <li>Money-saving local secrets</li>
      </ul>
      <button class="btn btn--primary btn--large" id="btn-purchase" onclick="handlePurchase()">
        Unlock Now — $${price}
      </button>
      <p style="font-size: 0.8rem; margin-top: 1rem; color: rgba(255,255,255,0.6);">
        Secure payment via Stripe. Instant access after purchase.
      </p>
    </div>
  `;
}

function handlePurchase() {
  const state = State.get();
  const tier = State.getPriceTier(state.tripDays);
  const link = CONFIG.stripe.links[tier];
  const sessionId = State.getSessionId();

  if (link && !link.includes('YOUR_')) {
    window.location.href = `${link}?client_reference_id=${sessionId}`;
  } else {
    // Demo mode - unlock directly
    State.save({ paid: true, paymentTier: tier });
    UI.showToast('Demo mode: Itinerary unlocked!');
    setTimeout(() => window.location.reload(), 1000);
  }
}

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
      // Fallback: print
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
      <p style="color:#1B2A4A; font-family:Georgia,serif; font-size:12pt;">London Journey Planner</p>
      <p style="color:#888; font-size:9pt;">Enjoy your trip!</p>
    </div>
  `;
}
