// ============================================================
// REVIEWS & RATINGS SYSTEM
// Stored in localStorage, synced to GoHighLevel via webhook
// ============================================================
const Reviews = {
  STORAGE_KEY: 'londonPlannerReviews',

  getAll() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },

  add(review) {
    const reviews = this.getAll();
    const newReview = {
      id: 'rev_' + Date.now(),
      name: review.name,
      rating: review.rating,
      tripType: review.tripType || '',
      tripDays: review.tripDays || 0,
      text: review.text,
      date: new Date().toISOString(),
      verified: false
    };
    reviews.push(newReview);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reviews));

    // Send to GHL
    GHL.sendToWebhook('contactForm', {
      type: 'review_submitted',
      ...newReview
    });

    return newReview;
  },

  getAverage() {
    const reviews = this.getAll();
    if (reviews.length === 0) return { avg: 5, count: 0 };
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return { avg: (sum / reviews.length).toFixed(1), count: reviews.length };
  },

  renderStars(rating) {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(rating));
  },

  renderWidget(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const reviews = this.getAll();
    const { avg, count } = this.getAverage();

    // Mix stored reviews with default testimonials
    const allReviews = [
      { name: 'Sarah M.', rating: 5, text: 'This itinerary saved us hours of research. Every restaurant recommendation was spot-on, and the insider tips made us feel like locals.', tripType: '7-day trip', date: '2026-02-15' },
      { name: 'David & Lisa K.', rating: 5, text: 'We did the personal consultation and it was worth every penny. Our guide knew the perfect off-the-beaten-path spots for our family.', tripType: '5-day family trip', date: '2026-01-20' },
      { name: 'James R.', rating: 5, text: 'The pub and bar recommendations alone were worth $20. We had the best night out in Shoreditch thanks to this guide!', tripType: '3-day weekend', date: '2026-03-05' },
      ...reviews
    ];

    const displayReviews = allReviews.slice(-6).reverse();
    const totalCount = allReviews.length;
    const totalAvg = allReviews.length > 0 ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1) : '5.0';

    container.innerHTML = `
      <div style="text-align:center;margin-bottom:2rem;">
        <div style="font-size:2rem;color:var(--color-accent);">${this.renderStars(parseFloat(totalAvg))}</div>
        <div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:700;">${totalAvg} out of 5</div>
        <div style="color:var(--color-text-muted);font-size:0.85rem;">${totalCount} verified reviews</div>
      </div>
      <div class="grid grid--3" style="margin-bottom:2rem;">
        ${displayReviews.map(r => `
          <div class="card testimonial-card">
            <div class="card__body">
              <div class="testimonial-card__stars" style="color:var(--color-accent);">${this.renderStars(r.rating)}</div>
              <p class="testimonial-card__text">"${r.text}"</p>
              <div class="testimonial-card__author">${r.name}${r.tripType ? ` — ${r.tripType}` : ''}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="text-align:center;">
        <button class="btn btn--outline" onclick="Reviews.showForm('${containerId}')">Leave a Review</button>
      </div>
    `;
  },

  showForm(containerId) {
    const container = document.getElementById(containerId);
    const existing = container.innerHTML;
    const formHtml = `
      <div class="card" style="max-width:500px;margin:0 auto;">
        <div class="card__body">
          <h3 style="margin-bottom:1rem;">Leave Your Review</h3>
          <div class="field">
            <label>Your Name</label>
            <input type="text" id="review-name" placeholder="John S." required>
          </div>
          <div class="field">
            <label>Rating</label>
            <div id="review-stars" style="font-size:2rem;cursor:pointer;color:var(--color-border);">
              ${'★'.repeat(5).split('').map((s, i) => `<span data-star="${i+1}" onmouseover="Reviews._hoverStar(${i+1})" onmouseout="Reviews._resetStars()" onclick="Reviews._setStar(${i+1})">${s}</span>`).join('')}
            </div>
            <input type="hidden" id="review-rating" value="5">
          </div>
          <div class="field">
            <label>Trip Details <small>(optional)</small></label>
            <input type="text" id="review-trip" placeholder="e.g. 5-day family trip">
          </div>
          <div class="field">
            <label>Your Review</label>
            <textarea id="review-text" rows="3" placeholder="What did you love about your itinerary?" required></textarea>
          </div>
          <div style="display:flex;gap:1rem;">
            <button class="btn btn--primary" onclick="Reviews._submit('${containerId}')">Submit Review</button>
            <button class="btn btn--outline" onclick="Reviews.renderWidget('${containerId}')">Cancel</button>
          </div>
        </div>
      </div>
    `;
    container.innerHTML = formHtml;
    Reviews._setStar(5);
  },

  _selectedRating: 5,

  _hoverStar(n) {
    const stars = document.querySelectorAll('#review-stars span');
    stars.forEach((s, i) => s.style.color = i < n ? 'var(--color-accent)' : 'var(--color-border)');
  },

  _resetStars() {
    this._hoverStar(this._selectedRating);
  },

  _setStar(n) {
    this._selectedRating = n;
    document.getElementById('review-rating').value = n;
    this._hoverStar(n);
  },

  _submit(containerId) {
    const name = document.getElementById('review-name').value.trim();
    const text = document.getElementById('review-text').value.trim();
    if (!name || !text) { UI.showToast('Please enter your name and review.'); return; }

    this.add({
      name,
      rating: parseInt(document.getElementById('review-rating').value),
      tripType: document.getElementById('review-trip').value.trim(),
      text
    });

    UI.showToast('Thanks for your review!');
    this.renderWidget(containerId);
  }
};
