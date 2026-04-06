// ============================================================
// AI CHAT ASSISTANT — Knowledge-based London venue chat widget
// Uses local venue data for smart recommendations
// ============================================================
const ChatAssistant = {
  data: null,
  isOpen: false,
  messages: [],
  _initialized: false,
  _leadCaptured: false,
  _pendingResponse: null,
  _collectingLead: false,
  _leadStep: null, // 'name' or 'email'
  _leadName: '',

  async init() {
    if (this._initialized) return;
    this._initialized = true;
    // Check if lead was previously captured
    try {
      const stored = localStorage.getItem('chatAssistantLead');
      if (stored) this._leadCaptured = true;
    } catch {}
    await this.loadData();
    this.render();
    this.bindEvents();
  },

  async loadData() {
    try {
      const files = ['attractions', 'restaurants', 'nightlife', 'cafes', 'entertainment', 'hotels'];
      const results = await Promise.all(
        files.map(f => fetch(`data/${f}.json`).then(r => r.json()).catch(() => []))
      );
      this.data = {
        attractions: results[0] || [],
        restaurants: results[1] || [],
        nightlife: results[2] || [],
        cafes: results[3] || [],
        entertainment: results[4] || [],
        hotels: results[5] || []
      };
    } catch (e) {
      this.data = { attractions: [], restaurants: [], nightlife: [], cafes: [], entertainment: [], hotels: [] };
    }
  },

  render() {
    const widget = document.createElement('div');
    widget.id = 'chat-widget';
    widget.innerHTML = `
      <style>
        #chat-widget { position: fixed; bottom: 24px; right: 24px; z-index: 500; font-family: var(--font-body, 'Inter', sans-serif); }
        #chat-toggle { width: 60px; height: 60px; border-radius: 50%; background: var(--color-accent, #C9A84C); color: var(--color-primary, #1B2A4A); border: none; font-size: 1.5rem; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.2); transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
        #chat-toggle:hover { transform: scale(1.1); }
        #chat-panel { display: none; width: 350px; height: 500px; background: white; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.15); overflow: hidden; flex-direction: column; position: absolute; bottom: 70px; right: 0; }
        #chat-panel.open { display: flex; animation: chatSlideIn 0.3s ease; }
        @keyframes chatSlideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .chat-header { background: var(--color-primary, #1B2A4A); color: white; padding: 16px; display: flex; justify-content: space-between; align-items: center; }
        .chat-header h4 { margin: 0; font-size: 0.95rem; font-family: var(--font-heading, serif); }
        .chat-close { background: none; border: none; color: rgba(255,255,255,0.7); font-size: 1.25rem; cursor: pointer; padding: 4px; }
        .chat-close:hover { color: white; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .chat-msg { max-width: 85%; padding: 10px 14px; border-radius: 12px; font-size: 0.88rem; line-height: 1.5; }
        .chat-msg--bot { background: #f3f1ec; color: #2C2C2C; align-self: flex-start; border-bottom-left-radius: 4px; }
        .chat-msg--user { background: var(--color-primary, #1B2A4A); color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
        .chat-msg a { color: var(--color-accent, #C9A84C); font-weight: 600; text-decoration: underline; }
        .chat-venue { background: white; border: 1px solid #e5e1d8; border-radius: 8px; padding: 10px; margin-top: 6px; }
        .chat-venue strong { color: var(--color-primary, #1B2A4A); display: block; margin-bottom: 2px; }
        .chat-venue small { color: #6B7280; }
        .chat-chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 16px; border-top: 1px solid #e5e1d8; }
        .chat-chip { background: #f3f1ec; border: 1px solid #e5e1d8; border-radius: 20px; padding: 6px 12px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .chat-chip:hover { background: var(--color-accent, #C9A84C); color: var(--color-primary, #1B2A4A); border-color: var(--color-accent, #C9A84C); }
        .chat-input-row { display: flex; padding: 12px; gap: 8px; border-top: 1px solid #e5e1d8; }
        .chat-input-row input { flex: 1; border: 1px solid #e5e1d8; border-radius: 8px; padding: 8px 12px; font-size: 0.88rem; outline: none; }
        .chat-input-row input:focus { border-color: var(--color-accent, #C9A84C); }
        .chat-input-row button { background: var(--color-accent, #C9A84C); color: var(--color-primary, #1B2A4A); border: none; border-radius: 8px; padding: 8px 14px; font-weight: 600; cursor: pointer; font-size: 0.88rem; }
        .chat-typing { display: flex; gap: 4px; padding: 10px 14px; align-self: flex-start; }
        .chat-typing span { width: 8px; height: 8px; background: #ccc; border-radius: 50%; animation: typingBounce 1.4s infinite; }
        .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
        .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        @media (max-width: 480px) { #chat-panel { width: calc(100vw - 32px); right: -8px; bottom: 70px; height: 60vh; } }
      </style>
      <div id="chat-panel">
        <div class="chat-header">
          <h4>UK & London Assistant</h4>
          <button class="chat-close" onclick="ChatAssistant.toggle()" aria-label="Close chat">✕</button>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-chips" id="chat-chips">
          <span class="chat-chip" data-q="Best restaurants">Best restaurants</span>
          <span class="chat-chip" data-q="Free things to do">Free things to do</span>
          <span class="chat-chip" data-q="Nightlife spots">Nightlife spots</span>
          <span class="chat-chip" data-q="Family activities">Family activities</span>
          <span class="chat-chip" data-q="Hidden gems">Hidden gems</span>
        </div>
        <div class="chat-input-row">
          <input type="text" id="chat-input" placeholder="Ask about London..." aria-label="Chat message">
          <button onclick="ChatAssistant.send()">Send</button>
        </div>
      </div>
      <button id="chat-toggle" onclick="ChatAssistant.toggle()" aria-label="Open London assistant chat">💬</button>
    `;
    document.body.appendChild(widget);

    // Welcome message
    this.addBotMessage("Hi! I'm your London assistant. Ask me about restaurants, attractions, nightlife, or anything else about London. What are you looking for?");
  },

  bindEvents() {
    const input = document.getElementById('chat-input');
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.send();
      });
    }
    document.querySelectorAll('.chat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.dataset.q;
        document.getElementById('chat-input').value = q;
        this.send();
      });
    });
  },

  toggle() {
    this.isOpen = !this.isOpen;
    const panel = document.getElementById('chat-panel');
    const toggle = document.getElementById('chat-toggle');
    if (this.isOpen) {
      panel.classList.add('open');
      toggle.style.display = 'none';
      document.getElementById('chat-input').focus();
    } else {
      panel.classList.remove('open');
      toggle.style.display = 'flex';
    }
  },

  send() {
    const input = document.getElementById('chat-input');
    const query = input.value.trim();
    if (!query) return;

    this.addUserMessage(query);
    input.value = '';

    // Handle lead capture flow
    if (this._collectingLead) {
      this.handleLeadCapture(query);
      return;
    }

    // Generate response
    const response = this.getResponse(query);

    // If lead not yet captured, collect name/email before showing the answer
    if (!this._leadCaptured) {
      this._pendingResponse = response;
      this._collectingLead = true;
      this._leadStep = 'name';
      this.showTypingThen("I'd love to share that with you! Could you tell me your <strong>name</strong> first?");
      return;
    }

    // Lead already captured — respond directly
    this.showTypingThen(response);

    if (typeof Analytics !== 'undefined' && Analytics.chatInteraction) Analytics.chatInteraction(query);
  },

  handleLeadCapture(input) {
    if (this._leadStep === 'name') {
      this._leadName = input;
      this._leadStep = 'email';
      this.showTypingThen(`Thanks, ${input}! And what's your <strong>email address</strong> so we can send you more London tips?`);
    } else if (this._leadStep === 'email') {
      const email = input;
      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.showTypingThen("That doesn't look like a valid email. Could you try again?");
        return;
      }
      // Save lead
      this._leadCaptured = true;
      this._collectingLead = false;
      this._leadStep = null;
      try {
        localStorage.setItem('chatAssistantLead', JSON.stringify({ name: this._leadName, email }));
      } catch {}
      // Track in GHL if available
      if (typeof GHL !== 'undefined' && GHL.createContact) {
        GHL.createContact({ name: this._leadName, email, source: 'chat-assistant' });
      }
      // Now deliver the pending response
      this.showTypingThen(`Great, thanks ${this._leadName}! Here's what I found:<br><br>${this._pendingResponse}`);
      this._pendingResponse = null;

      if (typeof Analytics !== 'undefined' && Analytics.chatInteraction) Analytics.chatInteraction('lead_captured');
    }
  },

  showTypingThen(html) {
    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    document.getElementById('chat-messages').appendChild(typing);
    const container = document.getElementById('chat-messages');
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      typing.remove();
      this.addBotMessage(html);
    }, 600 + Math.random() * 400);
  },

  addBotMessage(html) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg--bot';
    msg.innerHTML = html;
    const container = document.getElementById('chat-messages');
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  },

  addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg--user';
    msg.textContent = text;
    const container = document.getElementById('chat-messages');
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  },

  getResponse(query) {
    const q = query.toLowerCase();

    // Greetings
    if (/^(hi|hello|hey|hiya|yo)[\s!.]*$/i.test(q)) {
      return "Hello! Welcome to UK & London Planner. I can help you find restaurants, pubs, attractions, and hidden gems. What are you interested in?";
    }

    // Page redirects
    if (/airport|heathrow|gatwick|transfer/.test(q)) return 'Great question! Check our <a href="airport-transfers.html">Airport Transfer Guide</a> for all options from every London airport.';
    if (/neighbourhood|area|where to stay|district/.test(q)) return 'We have detailed guides for 15 London neighbourhoods! Browse them all at <a href="neighbourhoods.html">Neighbourhood Guides</a>.';
    if (/price|cost|how much/.test(q)) return 'Our itineraries start from just $20 for 1-5 days. <a href="index.html#pricing">See all pricing</a>. The 2-day preview is completely free!';
    if (/weather|rain|temperature/.test(q)) return 'London weather varies! Check our <a href="best-time-to-visit.html">Best Time to Visit</a> guide for monthly breakdowns.';
    if (/tube|transport|oyster|bus/.test(q)) return 'Our <a href="getting-around.html">Getting Around London</a> guide covers the Tube, buses, Oyster cards, and more. Also see <a href="compare-oyster-travelcard.html">Oyster vs Travelcard</a>.';
    if (/tip|advice|first time/.test(q)) return 'Check our <a href="travel-tips.html">Essential Travel Tips</a> — covers everything from tipping to safety to packing.';
    if (/what.?s on|event|festival/.test(q)) return 'See our <a href="whats-on.html">What\'s On</a> page for events, festivals, and shows happening in London.';

    // Venue searches
    if (/restaurant|eat|food|dining|dinner|lunch/.test(q)) return this.searchVenues('restaurants', q, 'Here are some great dining options:');
    if (/pub|bar|drink|beer|nightlife|cocktail|speakeasy/.test(q)) return this.searchVenues('nightlife', q, 'Here are some brilliant spots for a drink:');
    if (/cafe|coffee|brunch/.test(q)) return this.searchVenues('cafes', q, 'Here are some lovely cafes:');
    if (/hotel|stay|accommodation|sleep/.test(q)) return this.searchVenues('hotels', q, 'Here are some recommended places to stay:');
    if (/museum|gallery|theatre|show|entertainment/.test(q)) return this.searchVenues('entertainment', q, 'Here are some great entertainment options:');
    if (/attract|see|visit|landmark|sight|tower|palace|free|family|kid|child|hidden|gem|secret|romantic/.test(q)) return this.searchVenues('attractions', q, 'Here are some top picks:');

    // Default
    return "I can help with restaurants, pubs, attractions, cafes, hotels, transport, and general London tips. Try asking something like \"best restaurants in Soho\" or \"free things to do\". Or <a href='wizard.html'>plan your full trip</a>!";
  },

  searchVenues(type, query, intro) {
    const q = query.toLowerCase();
    const venues = this.data?.[type] || [];
    if (!venues.length) return `${intro} Check our <a href="wizard.html">trip planner</a> for personalised recommendations!`;

    // Score venues by relevance
    const scored = venues.map(v => {
      let score = 0;
      const text = `${v.name} ${v.description} ${v.neighbourhood} ${(v.tags||[]).join(' ')}`.toLowerCase();
      const words = q.split(/\s+/).filter(w => w.length > 2);
      words.forEach(w => { if (text.includes(w)) score += 2; });
      if (/free|budget|cheap/.test(q) && (v.estimatedCost?.amount === 0 || /free/i.test(v.description))) score += 5;
      if (/family|kid|child/.test(q) && (v.tags||[]).some(t => /family|kid|child/.test(t))) score += 5;
      if (/romantic|date|couple/.test(q) && (v.tags||[]).some(t => /roman|date/.test(t))) score += 5;
      if (/hidden|secret|gem/.test(q) && (v.tags||[]).some(t => /hidden|secret|gem/.test(t))) score += 5;
      // Neighbourhood match
      const nbhoods = ['soho','shoreditch','camden','south bank','covent garden','bermondsey','brixton','hampstead','islington','kensington','notting hill','mayfair','peckham','greenwich','kings cross'];
      nbhoods.forEach(n => { if (q.includes(n) && (v.neighbourhood||'').toLowerCase().includes(n)) score += 10; });
      return { ...v, score };
    }).filter(v => v.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);

    if (!scored.length) {
      // Random picks
      const random = venues.sort(() => 0.5 - Math.random()).slice(0, 3);
      return `${intro}` + random.map(v => this.venueCard(v)).join('');
    }

    return `${intro}` + scored.map(v => this.venueCard(v)).join('');
  },

  venueCard(v) {
    const cost = v.estimatedCost ? (v.estimatedCost.amount === 0 ? 'Free' : `£${v.estimatedCost.amount}`) : '';
    const link = v.affiliateUrl ? ` <a href="${v.affiliateUrl}" target="_blank">View →</a>` : '';
    return `<div class="chat-venue"><strong>${v.name}</strong><small>${v.neighbourhood || ''}${cost ? ' · ' + cost : ''}${link}</small><br><small>${(v.description || '').substring(0, 100)}${(v.description||'').length > 100 ? '...' : ''}</small></div>`;
  }
};

// Auto-initialize on DOM ready (only if not already initialized by the page)
document.addEventListener('DOMContentLoaded', () => {
  if (typeof ChatAssistant !== 'undefined' && !ChatAssistant._initialized) ChatAssistant.init();
});

// Add analytics stub
if (typeof Analytics !== 'undefined' && !Analytics.chatInteraction) {
  Analytics.chatInteraction = function(query) {
    if (!window.gtag) return;
    gtag('event', 'chat_interaction', { event_category: 'chat', query: query.substring(0, 100) });
  };
}
