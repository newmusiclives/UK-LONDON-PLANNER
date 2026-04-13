// ============================================================
// TRAVEL MEMORY BOOK
// Post-trip: auto-generated trip diary from itinerary + photos.
// Printable/shareable digital keepsake.
// ============================================================
const MemoryBook = {
  STORAGE_KEY: 'memoryBookData',

  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('memory-book')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const data = this._getData();
    const itinerary = typeof State !== 'undefined' ? State.getItinerary() : null;

    container.innerHTML = `
      <div class="mb-widget">
        <div class="mb-hero">
          <div class="mb-hero__icon">📖</div>
          <h3>Your London Memory Book</h3>
          <p>Turn your trip into a beautiful keepsake. Add photos, ratings, and notes to create a personalised travel diary.</p>
        </div>

        ${itinerary ? this._renderBook(itinerary, data) : this._renderEmpty()}

        <div class="mb-actions">
          <button class="btn btn--primary" onclick="MemoryBook._print()">🖨️ Print Memory Book</button>
          <button class="btn" onclick="MemoryBook._share()">📤 Share as Link</button>
        </div>
      </div>
    `;

    // Wire up photo inputs
    container.querySelectorAll('.mb-photo-input').forEach(input => {
      input.addEventListener('change', (e) => this._handlePhoto(e));
    });
  },

  _renderEmpty() {
    return `
      <div class="mb-empty">
        <p>Complete a trip to start building your memory book!</p>
        <a href="wizard.html" class="btn btn--primary">Plan a Trip</a>
      </div>
    `;
  },

  _renderBook(itinerary, data) {
    const title = itinerary.title || 'My London Adventure';
    const days = itinerary.days || [];

    return `
      <div class="mb-book" id="mb-book">
        <div class="mb-cover">
          <div class="mb-cover__flag">🇬🇧</div>
          <h2 class="mb-cover__title">${title}</h2>
          <p class="mb-cover__subtitle">${days.length} Days in London</p>
          <p class="mb-cover__date">${new Date().getFullYear()}</p>
        </div>

        ${days.map((day, idx) => `
          <div class="mb-page">
            <div class="mb-page__header">
              <h3>Day ${day.dayNumber}: ${day.theme || 'Exploring London'}</h3>
              <div class="mb-page__neighbourhoods">
                ${(day.neighbourhoods || []).map(n => '<span class="badge badge--accent">' + n + '</span>').join('')}
              </div>
            </div>

            <div class="mb-page__photos">
              <div class="mb-photo-slot" id="mb-photo-${idx}">
                ${(data.photos && data.photos[idx]) ? `<img src="${data.photos[idx]}" class="mb-photo-img">` : `
                  <label class="mb-photo-placeholder">
                    📸 Add Photo
                    <input type="file" accept="image/*" class="mb-photo-input" data-day="${idx}" hidden>
                  </label>
                `}
              </div>
            </div>

            <div class="mb-page__activities">
              ${(day.activities || []).map(a => `
                <div class="mb-activity">
                  <span class="mb-activity__time">${a.timeSlot || ''}</span>
                  <strong>${a.name}</strong>
                </div>
              `).join('')}
            </div>

            <div class="mb-page__notes">
              <textarea class="mb-notes" placeholder="Your notes & memories from this day..."
                data-day="${idx}" onchange="MemoryBook._saveNote(${idx}, this.value)"
              >${(data.notes && data.notes[idx]) || ''}</textarea>
            </div>

            <div class="mb-page__rating">
              <span>Rate this day: </span>
              ${[1,2,3,4,5].map(star => `
                <button class="mb-star ${(data.ratings && data.ratings[idx] >= star) ? 'mb-star--active' : ''}"
                  onclick="MemoryBook._rate(${idx}, ${star})">★</button>
              `).join('')}
            </div>
          </div>
        `).join('')}

        <div class="mb-page mb-back-cover">
          <div class="mb-back-cover__text">
            <p>"Every trip to London is a new chapter in your story."</p>
            <small>Created with London & UK Planner</small>
          </div>
        </div>
      </div>
    `;
  },

  _handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const day = e.target.dataset.day;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = this._getData();
      data.photos = data.photos || {};
      data.photos[day] = ev.target.result;
      this._save(data);
      const slot = document.getElementById('mb-photo-' + day);
      if (slot) slot.innerHTML = `<img src="${ev.target.result}" class="mb-photo-img">`;
    };
    reader.readAsDataURL(file);
  },

  _saveNote(dayIndex, text) {
    const data = this._getData();
    data.notes = data.notes || {};
    data.notes[dayIndex] = text;
    this._save(data);
  },

  _rate(dayIndex, stars) {
    const data = this._getData();
    data.ratings = data.ratings || {};
    data.ratings[dayIndex] = stars;
    this._save(data);
    // Re-render stars
    const container = document.querySelector('.mb-widget')?.parentElement;
    if (container) this.init(container);
  },

  _print() {
    window.print();
  },

  _share() {
    const shareUrl = window.location.origin + '/my-trips.html';
    if (navigator.share) {
      navigator.share({ title: 'My London Memory Book', url: shareUrl });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied! Share it with friends and family.');
    }
  },

  _getData() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}'); }
    catch (e) { return {}; }
  },

  _save(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }
};
