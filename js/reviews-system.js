// ============================================================
// USER REVIEWS & RATINGS SYSTEM
// localStorage-based venue review system
// ============================================================
const ReviewSystem = {
  STORAGE_KEY: 'londonplannedReviews',

  // Pre-seeded reviews for popular venues
  seedReviews: [
    { id: 's1', venueId: 'tower-of-london', venueName: 'Tower of London', rating: 5, comment: 'Absolutely fascinating. The Crown Jewels alone are worth the visit. Book early morning to avoid queues.', author: 'Michael T.', visitDate: '2024-09' },
    { id: 's2', venueId: 'borough-market', venueName: 'Borough Market', rating: 5, comment: 'The best food market in London. Go hungry! The raclette and the scotch eggs from Ginger Pig are incredible.', author: 'Sophie L.', visitDate: '2024-10' },
    { id: 's3', venueId: 'sky-garden', venueName: 'Sky Garden', rating: 4, comment: 'Great free views of London. Book well in advance. The bar is pricey but the views make up for it.', author: 'David R.', visitDate: '2024-08' },
    { id: 's4', venueId: 'british-museum', venueName: 'British Museum', rating: 5, comment: 'You could spend days here. The Egyptian collection is mind-blowing. And it\'s FREE!', author: 'Emma W.', visitDate: '2024-11' },
    { id: 's5', venueId: 'camden-market', venueName: 'Camden Market', rating: 4, comment: 'Vibrant and eclectic. Great street food, vintage finds, and people-watching. Can get very crowded on weekends.', author: 'James K.', visitDate: '2024-07' },
    { id: 's6', venueId: 'gordons-wine-bar', venueName: "Gordon's Wine Bar", rating: 5, comment: 'The most atmospheric bar in London. Candlelit caves, great wines, arrive early or you won\'t get a seat.', author: 'Charlotte M.', visitDate: '2024-09' },
    { id: 's7', venueId: 'padella', venueName: 'Padella', rating: 5, comment: 'Best pasta in London, hands down. The pappardelle with beef ragu is extraordinary. Expect to queue 30+ mins.', author: 'Oliver B.', visitDate: '2024-10' },
    { id: 's8', venueId: 'tate-modern', venueName: 'Tate Modern', rating: 4, comment: 'Brilliant free gallery. The Turbine Hall installations are always impressive. Don\'t miss the view from Level 10.', author: 'Grace H.', visitDate: '2024-06' },
    { id: 's9', venueId: 'tower-bridge', venueName: 'Tower Bridge', rating: 4, comment: 'The glass floor walkway is thrilling. Worth paying for the exhibition if you like engineering and history.', author: 'Harry P.', visitDate: '2024-08' },
    { id: 's10', venueId: 'columbia-road', venueName: 'Columbia Road Flower Market', rating: 5, comment: 'Sunday morning heaven. Beautiful flowers, lovely independent shops, and the best atmosphere in East London.', author: 'Lily A.', visitDate: '2024-05' },
    { id: 's11', venueId: 'westminster-abbey', venueName: 'Westminster Abbey', rating: 5, comment: 'Awe-inspiring. The architecture, the history, the tombs of kings and queens. An absolute must-visit.', author: 'Thomas G.', visitDate: '2024-09' },
    { id: 's12', venueId: 'dishoom', venueName: 'Dishoom', rating: 5, comment: 'The bacon naan roll at breakfast is life-changing. Every dish is outstanding. Go to Shoreditch for shorter queues.', author: 'Amelia C.', visitDate: '2024-07' },
    { id: 's13', venueId: 'natural-history-museum', venueName: 'Natural History Museum', rating: 5, comment: 'Perfect for families. The dinosaur gallery is amazing. Free entry and the building itself is stunning.', author: 'Ryan F.', visitDate: '2024-10' },
    { id: 's14', venueId: 'brick-lane', venueName: 'Brick Lane', rating: 4, comment: 'Great for curry, vintage shopping, and street art. Sunday market is the best time to visit.', author: 'Mia J.', visitDate: '2024-06' },
    { id: 's15', venueId: 'hampstead-heath', venueName: 'Hampstead Heath', rating: 5, comment: 'The views from Parliament Hill are spectacular. Feels like countryside in the city. Swim in the ponds if you dare!', author: 'Daniel S.', visitDate: '2024-08' },
    { id: 's16', venueId: 'st-pauls', venueName: "St Paul's Cathedral", rating: 5, comment: 'Climb to the dome for unforgettable views. The Whispering Gallery is magical. One of Wren\'s masterpieces.', author: 'Isabella N.', visitDate: '2024-09' },
    { id: 's17', venueId: 'kew-gardens', venueName: 'Kew Gardens', rating: 4, comment: 'Beautiful in every season. The Palm House and Temperate House are spectacular. Allow a full day.', author: 'Jack W.', visitDate: '2024-04' },
    { id: 's18', venueId: 'ye-olde-cheshire-cheese', venueName: 'Ye Olde Cheshire Cheese', rating: 4, comment: 'Historic pub from 1667. Dark, atmospheric, full of character. The pie is hearty. Samuel Johnson\'s local!', author: 'Noah L.', visitDate: '2024-11' },
    { id: 's19', venueId: 'south-bank', venueName: 'South Bank Walk', rating: 5, comment: 'The best free walk in London. From Westminster Bridge to Tower Bridge. Street performers, food stalls, amazing views.', author: 'Chloe D.', visitDate: '2024-07' },
    { id: 's20', venueId: 'rules-restaurant', venueName: 'Rules Restaurant', rating: 4, comment: 'London\'s oldest restaurant. Opulent Edwardian interior. The game pie is legendary. Not cheap but worth the splurge.', author: 'Ben M.', visitDate: '2024-10' }
  ],

  getAll() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const userReviews = stored ? JSON.parse(stored) : [];
      return [...this.seedReviews, ...userReviews];
    } catch { return [...this.seedReviews]; }
  },

  getReviews(venueId) {
    return this.getAll().filter(r => r.venueId === venueId);
  },

  getAverageRating(venueId) {
    const reviews = this.getReviews(venueId);
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  },

  submitReview({ venueId, venueName, rating, comment, author, visitDate }) {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const reviews = stored ? JSON.parse(stored) : [];
      reviews.push({
        id: 'u_' + Date.now(),
        venueId, venueName, rating, comment, author,
        visitDate: visitDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reviews));
      return true;
    } catch { return false; }
  },

  deleteReview(reviewId) {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const reviews = stored ? JSON.parse(stored) : [];
      const filtered = reviews.filter(r => r.id !== reviewId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch {}
  },

  renderStars(rating) {
    const full = Math.round(rating);
    return Array.from({ length: 5 }, (_, i) =>
      `<span style="color:${i < full ? 'var(--color-accent,#C9A84C)' : '#E5E1D8'};font-size:1rem;">★</span>`
    ).join('');
  },

  renderWidget(containerId, venueId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const reviews = this.getReviews(venueId);
    const avg = this.getAverageRating(venueId);

    container.innerHTML = `
      <div style="margin-top:1rem;">
        ${reviews.length ? `
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
            ${this.renderStars(avg)}
            <span style="font-weight:600;font-size:0.9rem;">${avg.toFixed(1)}</span>
            <span style="color:var(--color-text-muted);font-size:0.8rem;">(${reviews.length} reviews)</span>
          </div>
          ${reviews.slice(0, 3).map(r => `
            <div style="border-bottom:1px solid var(--color-border);padding:0.75rem 0;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <strong style="font-size:0.85rem;">${r.author}</strong>
                <span style="font-size:0.8rem;">${this.renderStars(r.rating)}</span>
              </div>
              <p style="font-size:0.85rem;color:var(--color-text-muted);margin-top:0.25rem;">${r.comment}</p>
            </div>
          `).join('')}
        ` : '<p style="color:var(--color-text-muted);font-size:0.85rem;">No reviews yet. Be the first!</p>'}
        <button class="btn btn--outline btn--small" style="margin-top:0.75rem;" onclick="ReviewSystem.showModal('${venueId}','${(reviews[0]?.venueName||'').replace(/'/g,"\\'")}')">Write a Review</button>
      </div>
    `;
  },

  showModal(venueId, venueName) {
    let modal = document.getElementById('review-modal');
    if (modal) modal.remove();

    modal = document.createElement('div');
    modal.id = 'review-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(27,42,74,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;';
    modal.innerHTML = `
      <div style="background:white;border-radius:16px;max-width:450px;width:90%;padding:2rem;position:relative;">
        <button onclick="document.getElementById('review-modal').remove()" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:1.5rem;cursor:pointer;color:#9CA3AF;">&times;</button>
        <h3 style="margin-bottom:1rem;">Write a Review</h3>
        <p style="font-size:0.85rem;color:var(--color-text-muted);margin-bottom:1rem;">${venueName || 'This venue'}</p>
        <div id="review-stars" style="display:flex;gap:4px;margin-bottom:1rem;cursor:pointer;">
          ${[1,2,3,4,5].map(n => `<span data-rating="${n}" style="font-size:2rem;color:#E5E1D8;transition:color 0.2s;" onmouseover="ReviewSystem.hoverStar(${n})" onclick="ReviewSystem.selectStar(${n})">★</span>`).join('')}
        </div>
        <input type="hidden" id="review-rating" value="0">
        <textarea id="review-comment" placeholder="Share your experience..." rows="3" style="width:100%;border:2px solid var(--color-border);border-radius:8px;padding:10px;font-size:0.9rem;resize:vertical;margin-bottom:0.75rem;font-family:inherit;"></textarea>
        <input id="review-author" placeholder="Your name" style="width:100%;border:2px solid var(--color-border);border-radius:8px;padding:10px;font-size:0.9rem;margin-bottom:1rem;font-family:inherit;">
        <button class="btn btn--primary btn--full" onclick="ReviewSystem.submitFromModal('${venueId}','${(venueName||'').replace(/'/g,"\\'")}')">Submit Review</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  },

  hoverStar(n) {
    document.querySelectorAll('#review-stars span').forEach((star, i) => {
      star.style.color = i < n ? 'var(--color-accent,#C9A84C)' : '#E5E1D8';
    });
  },

  selectStar(n) {
    document.getElementById('review-rating').value = n;
    this.hoverStar(n);
  },

  submitFromModal(venueId, venueName) {
    const rating = parseInt(document.getElementById('review-rating').value);
    const comment = document.getElementById('review-comment').value.trim();
    const author = document.getElementById('review-author').value.trim() || 'Anonymous';

    if (!rating) { alert('Please select a star rating'); return; }
    if (!comment) { alert('Please write a comment'); return; }

    this.submitReview({ venueId, venueName, rating, comment, author });
    document.getElementById('review-modal').remove();
    if (typeof UI !== 'undefined') UI.showToast('Review submitted! Thanks for sharing.');
  }
};
