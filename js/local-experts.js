// ============================================================
// LOCAL EXPERT MARKETPLACE
// Connect travellers with verified local Londoners for guided
// walks, secret spots, home-cooked meals. Review system + booking.
// ============================================================
const LocalExperts = {
  experts: [
    { id: 'ex1', name: 'James Whitfield', avatar: '👨‍🍳', tagline: 'Food & Market Guide', neighbourhood: 'Borough & Bermondsey', rating: 4.9, reviews: 127, price: 45, duration: '3 hours', description: 'Former chef turned food guide. I\'ll take you through Borough Market, Maltby Street Market, and my favourite hidden restaurants. Tastings included.', specialties: ['food', 'markets', 'wine'], languages: ['English', 'French'] },
    { id: 'ex2', name: 'Priya Sharma', avatar: '👩‍🎨', tagline: 'Street Art & Creative East End', neighbourhood: 'Shoreditch & Brick Lane', rating: 4.8, reviews: 89, price: 35, duration: '2.5 hours', description: 'Street artist and curator. Discover Banksy, Stik, and the next generation of London street artists. I know every wall, every story.', specialties: ['art', 'culture', 'photography'], languages: ['English', 'Hindi'] },
    { id: 'ex3', name: 'Tom Richardson', avatar: '🎸', tagline: 'Music History & Live Venue Tour', neighbourhood: 'Soho & Camden', rating: 4.9, reviews: 156, price: 40, duration: '3 hours', description: 'Music journalist for 15 years. From the Rolling Stones\' Denmark Street to Amy Winehouse\'s Camden. Finish at a live music venue.', specialties: ['music', 'nightlife', 'history'], languages: ['English'] },
    { id: 'ex4', name: 'Sarah Chen', avatar: '🏰', tagline: 'Royal London & Hidden History', neighbourhood: 'Westminster & Mayfair', rating: 5.0, reviews: 203, price: 50, duration: '3 hours', description: 'Blue Badge guide and history PhD. The stories behind Buckingham Palace, Westminster Abbey, and the secret passages most tourists walk straight past.', specialties: ['history', 'royalty', 'architecture'], languages: ['English', 'Mandarin'] },
    { id: 'ex5', name: 'Marcus Johnson', avatar: '🍺', tagline: 'Historic Pub Crawl Expert', neighbourhood: 'City of London & Bankside', rating: 4.7, reviews: 94, price: 30, duration: '2.5 hours', description: 'CAMRA member and beer writer. Visit 5 pubs dating back to the 1600s. Stories of plague, fire, and the characters who drank here.', specialties: ['pubs', 'history', 'beer'], languages: ['English', 'German'] },
    { id: 'ex6', name: 'Amara Okafor', avatar: '👩‍🍳', tagline: 'Home-Cooked Supper Club', neighbourhood: 'Peckham', rating: 4.9, reviews: 67, price: 55, duration: '3 hours', description: 'Nigerian-British chef hosting intimate supper clubs in my Peckham home. 5-course meal with wine pairing. Max 8 guests per evening.', specialties: ['food', 'cooking', 'culture'], languages: ['English', 'Yoruba'] },
  ],

  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('local-experts')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    container.innerHTML = `
      <div class="le-widget">
        <div class="le-header">
          <h3>Meet Local Experts</h3>
          <p>Verified Londoners offering unique experiences you won't find in any guidebook.</p>
        </div>
        <div class="le-filters">
          <button class="le-filter le-filter--active" data-filter="all">All</button>
          <button class="le-filter" data-filter="food">Food & Drink</button>
          <button class="le-filter" data-filter="history">History</button>
          <button class="le-filter" data-filter="art">Art & Culture</button>
          <button class="le-filter" data-filter="music">Music</button>
        </div>
        <div class="le-grid" id="le-grid">
          ${this.experts.map(e => this._renderCard(e)).join('')}
        </div>
        <div class="le-cta">
          <h4>Are you a local expert?</h4>
          <p>Share your knowledge of London and earn money doing what you love.</p>
          <button class="btn btn--primary btn--small" onclick="alert('Applications opening soon! Email hello@londonplanner.com')">Apply to Be an Expert</button>
        </div>
      </div>
    `;

    container.querySelectorAll('.le-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.le-filter').forEach(b => b.classList.remove('le-filter--active'));
        btn.classList.add('le-filter--active');
        const filter = btn.dataset.filter;
        container.querySelectorAll('.le-card').forEach(card => {
          const specs = card.dataset.specialties || '';
          card.style.display = (filter === 'all' || specs.includes(filter)) ? '' : 'none';
        });
      });
    });
  },

  _renderCard(expert) {
    return `
      <div class="le-card" data-specialties="${expert.specialties.join(',')}">
        <div class="le-card__avatar">${expert.avatar}</div>
        <div class="le-card__body">
          <h4 class="le-card__name">${expert.name}</h4>
          <div class="le-card__tagline">${expert.tagline}</div>
          <div class="le-card__meta">
            <span>⭐ ${expert.rating} (${expert.reviews})</span>
            <span>📍 ${expert.neighbourhood}</span>
          </div>
          <p class="le-card__desc">${expert.description}</p>
          <div class="le-card__footer">
            <span class="le-card__price">From £${expert.price} · ${expert.duration}</span>
            <button class="btn btn--primary btn--small" onclick="LocalExperts._book('${expert.id}')">Book</button>
          </div>
        </div>
      </div>
    `;
  },

  _book(expertId) {
    const expert = this.experts.find(e => e.id === expertId);
    if (!expert) return;
    alert(`Booking for ${expert.name} (${expert.tagline}) will be available soon!\n\nPrice: £${expert.price} for ${expert.duration}\nLocation: ${expert.neighbourhood}`);
  }
};
