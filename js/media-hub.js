// ============================================================
// PODCAST & VIDEO CONTENT HUB
// Embeddable media player, curated content, episode listings
// ============================================================
const MediaHub = {
  // Curated content library — add real URLs when available
  episodes: [
    { type: 'podcast', title: 'Hidden London: Secret Spots the Guidebooks Miss', duration: '28 min', description: 'Discover underground rivers, forgotten stations, and hidden gardens that most tourists never find.', embedUrl: '', tags: ['hidden-gems', 'history'] },
    { type: 'podcast', title: 'Borough Market to Bermondsey: The Ultimate Food Walk', duration: '22 min', description: 'A guided audio tour through London\'s best food neighbourhood, with chef interviews and tasting tips.', embedUrl: '', tags: ['food', 'south-bank'] },
    { type: 'podcast', title: 'First-Timer\'s London: Everything You Need to Know', duration: '35 min', description: 'Oyster cards, tipping culture, weather prep, and the mistakes every tourist makes (and how to avoid them).', embedUrl: '', tags: ['tips', 'first-time'] },
    { type: 'podcast', title: 'London\'s Live Music Scene: From Jazz Clubs to Stadium Gigs', duration: '25 min', description: 'Ronnie Scott\'s, the 100 Club, Brixton Academy — a guide to London\'s incredible music venues.', embedUrl: '', tags: ['music', 'nightlife'] },
    { type: 'podcast', title: 'Travelling London with Kids: A Parent\'s Survival Guide', duration: '30 min', description: 'The best museums, parks, restaurants, and attractions for families — tested by actual parents.', embedUrl: '', tags: ['family', 'kids'] },
    { type: 'video', title: '48 Hours in London — The Perfect Weekend', duration: '12 min', description: 'A visual guide to making the most of a short London break, covering Westminster, South Bank, and Soho.', embedUrl: '', thumbnailEmoji: '🎬', tags: ['weekend', 'itinerary'] },
    { type: 'video', title: 'London\'s Best Markets: A Visual Tour', duration: '8 min', description: 'Borough, Camden, Portobello, Columbia Road — see what makes each market special before you visit.', embedUrl: '', thumbnailEmoji: '🛍️', tags: ['markets', 'shopping'] },
    { type: 'video', title: 'How to Use the London Underground Like a Local', duration: '6 min', description: 'Oyster vs contactless, peak hours, which lines to avoid, and the unwritten rules of the Tube.', embedUrl: '', thumbnailEmoji: '🚇', tags: ['transport', 'tips'] },
    { type: 'video', title: 'London Neighbourhood Guide: Shoreditch', duration: '10 min', description: 'Street art, vintage shopping, incredible food, and live music — Shoreditch is London\'s creative heart.', embedUrl: '', thumbnailEmoji: '🎨', tags: ['shoreditch', 'neighbourhood'] },
    { type: 'video', title: '10 Free Things to Do in London', duration: '7 min', description: 'World-class museums, royal parks, street art, and more — all completely free.', embedUrl: '', thumbnailEmoji: '🆓', tags: ['budget', 'free'] },
  ],

  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('media-hub')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const podcasts = this.episodes.filter(e => e.type === 'podcast');
    const videos = this.episodes.filter(e => e.type === 'video');

    container.innerHTML = `
      <div class="mh-widget">
        <div class="mh-tabs">
          <button class="mh-tab mh-tab--active" data-type="all">All</button>
          <button class="mh-tab" data-type="podcast">Podcasts (${podcasts.length})</button>
          <button class="mh-tab" data-type="video">Videos (${videos.length})</button>
        </div>

        <div class="mh-grid" id="mh-grid">
          ${this.episodes.map((ep, i) => this._renderCard(ep, i)).join('')}
        </div>

        <div class="mh-cta">
          <p>New episodes every week. Subscribe to never miss an episode.</p>
          <div class="mh-subscribe">
            <button class="btn btn--small btn--primary" onclick="alert('Coming soon! Subscribe links will be added when the podcast launches.')">Subscribe</button>
          </div>
        </div>
      </div>
    `;

    // Tab filtering
    container.querySelectorAll('.mh-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.mh-tab').forEach(t => t.classList.remove('mh-tab--active'));
        tab.classList.add('mh-tab--active');
        const type = tab.dataset.type;
        container.querySelectorAll('.mh-card').forEach(card => {
          card.style.display = (type === 'all' || card.dataset.type === type) ? '' : 'none';
        });
      });
    });
  },

  _renderCard(ep, index) {
    const icon = ep.type === 'podcast' ? '🎙️' : (ep.thumbnailEmoji || '🎬');
    const badge = ep.type === 'podcast' ? 'Podcast' : 'Video';
    const badgeClass = ep.type === 'podcast' ? 'mh-badge--podcast' : 'mh-badge--video';

    return `
      <div class="mh-card" data-type="${ep.type}" data-index="${index}">
        <div class="mh-card__thumb">${icon}</div>
        <div class="mh-card__info">
          <span class="mh-badge ${badgeClass}">${badge}</span>
          <h4 class="mh-card__title">${ep.title}</h4>
          <p class="mh-card__desc">${ep.description}</p>
          <div class="mh-card__meta">
            <span>${ep.duration}</span>
            ${ep.embedUrl ? '<button class="btn btn--small btn--primary" onclick="MediaHub._play(' + index + ')">Play</button>' : '<span class="mh-card__soon">Coming Soon</span>'}
          </div>
        </div>
      </div>`;
  },

  _play(index) {
    const ep = this.episodes[index];
    if (!ep || !ep.embedUrl) return;
    // For now, open in new tab. In future, embed player inline.
    window.open(ep.embedUrl, '_blank');
  },

  // Render a mini widget for sidebar/neighbourhood pages
  renderMini(containerId, tags) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('media-hub')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const relevant = tags
      ? this.episodes.filter(ep => ep.tags.some(t => tags.includes(t))).slice(0, 3)
      : this.episodes.slice(0, 3);

    if (!relevant.length) return;

    container.innerHTML = `
      <div class="mh-mini">
        <h4 class="mh-mini__title">Related Media</h4>
        ${relevant.map(ep => `
          <div class="mh-mini__item">
            <span>${ep.type === 'podcast' ? '🎙️' : '🎬'}</span>
            <div>
              <strong>${ep.title}</strong>
              <small>${ep.duration}</small>
            </div>
          </div>
        `).join('')}
        <a href="media.html" class="mh-mini__more">See all episodes &rarr;</a>
      </div>
    `;
  }
};
