// ============================================================
// SOCIAL MEDIA SCHEDULER
// Create, preview, schedule, and track social posts across
// Instagram, TikTok, X, Facebook, Pinterest, Threads
// ============================================================
const SocialScheduler = {
  STORAGE_KEY: 'socialScheduler',
  platforms: ['instagram', 'tiktok', 'x', 'facebook', 'pinterest', 'threads'],

  platformMeta: {
    instagram: { icon: '📸', name: 'Instagram', color: '#E1306C', charLimit: 2200, bestTimes: ['9am', '12pm', '5pm'] },
    tiktok: { icon: '🎵', name: 'TikTok', color: '#000000', charLimit: 300, bestTimes: ['7am', '12pm', '7pm'] },
    x: { icon: '𝕏', name: 'X / Twitter', color: '#000000', charLimit: 280, bestTimes: ['8am', '1pm', '6pm'] },
    facebook: { icon: '📘', name: 'Facebook', color: '#1877F2', charLimit: 63206, bestTimes: ['9am', '1pm', '4pm'] },
    pinterest: { icon: '📌', name: 'Pinterest', color: '#BD081C', charLimit: 500, bestTimes: ['2pm', '9pm'] },
    threads: { icon: '🧵', name: 'Threads', color: '#000000', charLimit: 500, bestTimes: ['10am', '3pm', '8pm'] },
  },

  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('social-scheduler')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const data = this._getData();
    container.innerHTML = this._render(data);
    this._bindEvents(container);
  },

  _render(data) {
    const scheduled = data.posts?.filter(p => p.status === 'scheduled') || [];
    const published = data.posts?.filter(p => p.status === 'published') || [];
    const drafts = data.posts?.filter(p => p.status === 'draft') || [];

    return `
      <div class="ss-widget">
        <!-- Stats Bar -->
        <div class="ss-stats">
          <div class="ss-stat"><span class="ss-stat__num">${scheduled.length}</span><span class="ss-stat__label">Scheduled</span></div>
          <div class="ss-stat"><span class="ss-stat__num">${published.length}</span><span class="ss-stat__label">Published</span></div>
          <div class="ss-stat"><span class="ss-stat__num">${drafts.length}</span><span class="ss-stat__label">Drafts</span></div>
        </div>

        <!-- Create Post -->
        <div class="ss-section">
          <h4>Create Post</h4>
          <form id="ss-create-form" class="ss-form">
            <div class="ss-platform-select">
              ${this.platforms.map(p => `
                <label class="ss-platform-chip">
                  <input type="checkbox" name="platforms" value="${p}" checked>
                  <span style="border-color:${this.platformMeta[p].color}">${this.platformMeta[p].icon} ${this.platformMeta[p].name}</span>
                </label>
              `).join('')}
            </div>
            <textarea id="ss-content" class="ss-textarea" rows="4" placeholder="Write your post... Use {venue} {neighbourhood} {link} for dynamic content"></textarea>
            <div class="ss-form-row">
              <select id="ss-content-type" class="ss-select">
                <option value="post">Standard Post</option>
                <option value="carousel">Carousel / Album</option>
                <option value="reel">Reel / Video</option>
                <option value="story">Story</option>
                <option value="thread">Thread</option>
              </select>
              <input type="datetime-local" id="ss-schedule-time" class="ss-datetime">
              <button type="submit" class="btn btn--primary btn--small">Schedule</button>
              <button type="button" class="btn btn--small" onclick="SocialScheduler._saveDraft()">Save Draft</button>
            </div>
          </form>
        </div>

        <!-- AI Generate -->
        <div class="ss-section">
          <h4>AI Content Generator</h4>
          <div class="ss-ai-gen">
            <select id="ss-ai-topic" class="ss-select">
              <option value="hidden-gems">Hidden gems tourists miss</option>
              <option value="budget-tips">Budget travel tips</option>
              <option value="food-guide">London food recommendations</option>
              <option value="neighbourhood">Neighbourhood spotlight</option>
              <option value="seasonal">Seasonal events & activities</option>
              <option value="pub-guide">Historic pub guide</option>
              <option value="first-timer">First-timer mistakes to avoid</option>
              <option value="day-trip">Day trips from London</option>
            </select>
            <select id="ss-ai-platform" class="ss-select">
              ${this.platforms.map(p => `<option value="${p}">${this.platformMeta[p].icon} ${this.platformMeta[p].name}</option>`).join('')}
            </select>
            <button class="btn btn--primary btn--small" onclick="SocialScheduler._generateAI()">✨ Generate</button>
          </div>
          <div id="ss-ai-output" class="ss-ai-output"></div>
        </div>

        <!-- Weekly Calendar -->
        <div class="ss-section">
          <h4>This Week's Schedule</h4>
          <div class="ss-calendar">
            ${this._renderWeekCalendar(data.posts || [])}
          </div>
        </div>

        <!-- Content Queue -->
        ${scheduled.length ? `
        <div class="ss-section">
          <h4>Scheduled Posts (${scheduled.length})</h4>
          <div class="ss-queue">
            ${scheduled.map((p, i) => this._renderPostCard(p, i)).join('')}
          </div>
        </div>` : ''}

        <!-- Best Times -->
        <div class="ss-section">
          <h4>Best Posting Times</h4>
          <div class="ss-best-times">
            ${this.platforms.map(p => `
              <div class="ss-best-time">
                <span>${this.platformMeta[p].icon} ${this.platformMeta[p].name}</span>
                <span class="ss-best-time__times">${this.platformMeta[p].bestTimes.join(', ')}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  _renderWeekCalendar(posts) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    return `<div class="ss-week">
      ${days.map((day, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayPosts = posts.filter(p => p.scheduledFor?.startsWith(dateStr));
        const isToday = date.toDateString() === today.toDateString();
        return `
          <div class="ss-day ${isToday ? 'ss-day--today' : ''}">
            <div class="ss-day__label">${day}</div>
            <div class="ss-day__date">${date.getDate()}</div>
            <div class="ss-day__posts">
              ${dayPosts.map(p => `<div class="ss-day__dot" style="background:${this.platformMeta[p.platforms?.[0]]?.color || '#999'}" title="${p.platforms?.join(', ')}: ${(p.content || '').substring(0, 50)}"></div>`).join('')}
            </div>
          </div>`;
      }).join('')}
    </div>`;
  },

  _renderPostCard(post, index) {
    const platformIcons = (post.platforms || []).map(p => this.platformMeta[p]?.icon || '').join(' ');
    const preview = (post.content || '').substring(0, 100) + ((post.content || '').length > 100 ? '...' : '');
    return `
      <div class="ss-post-card">
        <div class="ss-post-card__platforms">${platformIcons}</div>
        <div class="ss-post-card__content">${preview}</div>
        <div class="ss-post-card__time">${post.scheduledFor ? new Date(post.scheduledFor).toLocaleString() : 'No time set'}</div>
        <button class="ss-post-card__delete" onclick="SocialScheduler._deletePost(${index})">&times;</button>
      </div>
    `;
  },

  _bindEvents(container) {
    const form = container.querySelector('#ss-create-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this._schedulePost();
      });
    }
  },

  _schedulePost() {
    const content = document.getElementById('ss-content')?.value;
    const type = document.getElementById('ss-content-type')?.value;
    const time = document.getElementById('ss-schedule-time')?.value;
    const platforms = [...document.querySelectorAll('[name="platforms"]:checked')].map(el => el.value);
    if (!content || !platforms.length) return;

    const data = this._getData();
    data.posts = data.posts || [];
    data.posts.push({
      content, type, platforms,
      scheduledFor: time || null,
      status: time ? 'scheduled' : 'draft',
      createdAt: new Date().toISOString()
    });
    this._save(data);

    const container = document.querySelector('.ss-widget')?.parentElement;
    if (container) this.init(container);
  },

  _saveDraft() {
    const content = document.getElementById('ss-content')?.value;
    const platforms = [...document.querySelectorAll('[name="platforms"]:checked')].map(el => el.value);
    if (!content) return;

    const data = this._getData();
    data.posts = data.posts || [];
    data.posts.push({ content, platforms, status: 'draft', createdAt: new Date().toISOString() });
    this._save(data);

    const container = document.querySelector('.ss-widget')?.parentElement;
    if (container) this.init(container);
  },

  _deletePost(index) {
    const data = this._getData();
    if (data.posts) data.posts.splice(index, 1);
    this._save(data);
    const container = document.querySelector('.ss-widget')?.parentElement;
    if (container) this.init(container);
  },

  _generateAI() {
    const topic = document.getElementById('ss-ai-topic')?.value || 'hidden-gems';
    const platform = document.getElementById('ss-ai-platform')?.value || 'instagram';
    const output = document.getElementById('ss-ai-output');
    if (!output) return;

    const templates = {
      'hidden-gems': {
        instagram: '🤫 5 London spots tourists NEVER find:\n\n1. Leadenhall Market — Harry Potter\'s Diagon Alley inspiration\n2. Little Venice — canals, houseboats & waterside cafes\n3. God\'s Own Junkyard — neon sign wonderland in Walthamstow\n4. Postman\'s Park — the most moving memorial in London\n5. Kyoto Garden — a secret Japanese garden in Holland Park\n\nSave this for your trip ✈️\n\n#london #hiddengems #londontravel #visitlondon #traveluk',
        tiktok: '🎬 SCRIPT:\n[Hook - 2s] "London locals will HATE me for this"\n[Cut to Leadenhall Market] "This is the real Diagon Alley"\n[Cut to Little Venice] "Venice but make it London"\n[Cut to God\'s Own Junkyard] "A neon graveyard and it\'s FREE"\n[CTA] "Follow for more London secrets"\n\n🎵 Use trending mystery/reveal audio',
        x: '🧵 London\'s best kept secrets — a thread:\n\n1/ Leadenhall Market is where they filmed Diagon Alley. Most tourists walk right past it. The Victorian architecture is stunning and it\'s in the heart of the City.\n\n2/ Little Venice exists and it\'s gorgeous. Canals, colourful houseboats, waterside cafes. Take the canal boat to Camden for the ultimate hidden route.\n\n[Continue for 10+ tweets]',
      },
      'budget-tips': {
        instagram: '💰 London for UNDER £20/day — yes, really:\n\n☕ Skip Starbucks → Pret filter coffee £1.65\n🏛️ Skip paid attractions → British Museum, Tate Modern, V&A are FREE\n🚇 Skip Zone 1 taxis → Contactless bus cap £5.25/day\n🍽️ Skip restaurants → Borough Market lunch from £5\n🌳 Skip paid entertainment → Hyde Park, Regent\'s Park, South Bank walk FREE\n\nYour personalised budget itinerary → link in bio\n\n#londonbudget #budgettravel #cheaptravel #londonhacks #freetodo',
        tiktok: '🎬 SCRIPT:\n[Hook] "How I spent a WHOLE DAY in London for £18"\n[Breakfast] "Greggs sausage roll: £1.25"\n[Museum] "British Museum: literally free"\n[Lunch] "Borough Market street food: £7"\n[Walk] "South Bank walk: free, and the views are insane"\n[Dinner] "Tesco meal deal: £3.50"\n[Pub] "One pint at Wetherspoons: £4.50"\n[Total] "That\'s £16.25. In LONDON."\n[CTA] "Follow for more budget hacks"',
      },
      'food-guide': {
        instagram: '🍽️ Your London food bucket list:\n\n🥐 Dishoom — best breakfast in London (bacon naan roll)\n🧀 Borough Market — 1000 years of food heaven\n🍝 Padella — fresh pasta, £7 a dish, queue-worthy\n🥩 Flat Iron — £16 steak that rivals £60 restaurants\n🍦 Chin Chin Labs — liquid nitrogen ice cream\n🍺 Ye Olde Cheshire Cheese — pint in a pub from 1667\n\nWant a personalised food-focused itinerary? Link in bio ✨\n\n#londonfood #londonrestaurants #boroughmarket #londoneats #foodie',
        tiktok: '🎬 SCRIPT:\n[Hook] "These 3 meals will change your London trip"\n[Breakfast] "Dishoom\'s bacon naan roll. Trust me."\n[Lunch] "Padella — £7 fresh pasta that\'s better than most Italian restaurants"\n[Dinner] "Flat Iron — they give you a CLEAVER as a steak knife to take home"\n[CTA] "Which one are you trying first? Comment below"',
      },
    };

    const content = templates[topic]?.[platform]
      || `✨ AI-generated ${platform} content about "${topic}" would appear here.\n\nIn production, this calls the Claude API to generate platform-specific content tailored to your audience and brand voice.`;

    output.innerHTML = `
      <div class="ss-ai-result">
        <div class="ss-ai-result__header">
          <strong>${this.platformMeta[platform].icon} ${this.platformMeta[platform].name} — ${topic.replace('-', ' ')}</strong>
          <button class="btn btn--small" onclick="document.getElementById('ss-content').value = document.querySelector('.ss-ai-result__text').textContent">Use This</button>
        </div>
        <pre class="ss-ai-result__text">${content}</pre>
      </div>
    `;
  },

  _getData() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}'); }
    catch (e) { return {}; }
  },
  _save(data) { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data)); }
};
