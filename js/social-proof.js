// ============================================================
// SOCIAL PROOF NOTIFICATIONS
// Shows simulated recent activity toasts
// ============================================================
const SocialProof = {
  timer: null,
  firstNames: ['Sarah','James','Emma','David','Sophie','Michael','Olivia','Daniel','Charlotte','Ryan','Amelia','Thomas','Mia','Jack','Isabella','Oliver','Grace','Harry','Lily','Alex','Maya','Liam','Zoe','Ben','Chloe','Noah','Hannah','Lucas','Lucy','Ethan'],
  cities: ['Melbourne','Toronto','New York','Sydney','Auckland','Singapore','Dubai','Los Angeles','Chicago','San Francisco','Vancouver','Brisbane','Perth','Dublin','Cape Town','Mumbai','Hong Kong','Seoul','Tokyo','Berlin','Amsterdam','Stockholm','Paris','Madrid','Rome'],
  tripTypes: ['a 3-day London trip','a 5-day London adventure','a 7-day UK itinerary','a weekend in London','a 4-day cultural tour','a 10-day extended stay','a 6-day family trip'],
  actions: [
    (n,c) => `${n} from ${c} just planned ${SocialProof.tripTypes[Math.floor(Math.random()*SocialProof.tripTypes.length)]}`,
    (n,c) => `${n} from ${c} downloaded their London itinerary`,
    (n,c) => `${n} & partner booked a romantic 4-day getaway`,
    (n,c) => `A group of ${Math.floor(Math.random()*5)+3} friends just planned a London trip`,
    (n,c) => `${n} from ${c} just started planning their trip`,
    (n,c) => `Couple from ${c} created a 5-day honeymoon itinerary`,
    (n,c) => `Family from ${c} planned a week-long London adventure`,
    (n,c) => `${n} from ${c} unlocked their full itinerary`
  ],

  init() {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('social-proof')) return;
    // Only show on key pages
    const path = window.location.pathname;
    const showPages = ['index.html', 'wizard.html', 'demo.html', 'book-services.html', '/'];
    if (!showPages.some(p => path.endsWith(p))) return;
    if (localStorage.getItem('hideSocialProof')) return;

    this.createContainer();
    // First notification after 15 seconds
    setTimeout(() => this.showRandom(), 15000);
  },

  createContainer() {
    const el = document.createElement('div');
    el.id = 'social-proof-container';
    el.innerHTML = `<style>
      #social-proof-toast { position:fixed;bottom:24px;left:24px;background:white;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.12);padding:14px 16px;display:flex;align-items:center;gap:12px;max-width:360px;z-index:450;transform:translateX(-120%);transition:transform 0.4s cubic-bezier(0.4,0,0.2,1);font-family:var(--font-body,'Inter',sans-serif); }
      #social-proof-toast.show { transform:translateX(0); }
      .sp-avatar { width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;color:white;flex-shrink:0; }
      .sp-text { font-size:0.82rem;color:#2C2C2C;line-height:1.4; }
      .sp-time { font-size:0.7rem;color:#9CA3AF;margin-top:2px; }
      .sp-close { position:absolute;top:6px;right:8px;background:none;border:none;color:#9CA3AF;cursor:pointer;font-size:0.85rem;padding:2px; }
      .sp-close:hover { color:#2C2C2C; }
      .sp-hide { font-size:0.7rem;color:#9CA3AF;text-decoration:underline;cursor:pointer;margin-top:4px;display:block; }
      @media(max-width:480px) { #social-proof-toast { left:12px;right:12px;max-width:none; } }
    </style>
    <div id="social-proof-toast">
      <div class="sp-avatar" id="sp-avatar">S</div>
      <div>
        <div class="sp-text" id="sp-text"></div>
        <div class="sp-time" id="sp-time">Just now</div>
        <span class="sp-hide" onclick="SocialProof.hide()">Don't show these</span>
      </div>
      <button class="sp-close" onclick="SocialProof.dismiss()" aria-label="Dismiss">&times;</button>
    </div>`;
    document.body.appendChild(el);
  },

  showRandom() {
    const name = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const city = this.cities[Math.floor(Math.random() * this.cities.length)];
    const action = this.actions[Math.floor(Math.random() * this.actions.length)];
    const message = action(name, city);
    const colors = ['#E74C3C','#3498DB','#2ECC71','#9B59B6','#F39C12','#1ABC9C','#E67E22','#34495E'];

    const toast = document.getElementById('social-proof-toast');
    const avatar = document.getElementById('sp-avatar');
    const text = document.getElementById('sp-text');
    const time = document.getElementById('sp-time');

    avatar.textContent = name.charAt(0);
    avatar.style.background = colors[Math.floor(Math.random() * colors.length)];
    text.textContent = message;
    const mins = Math.floor(Math.random() * 5);
    time.textContent = mins === 0 ? 'Just now' : `${mins + 1} minutes ago`;

    toast.classList.add('show');

    // Auto dismiss after 5 seconds
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      toast.classList.remove('show');
      // Schedule next one 30-45 seconds later
      setTimeout(() => this.showRandom(), 30000 + Math.random() * 15000);
    }, 5000);
  },

  dismiss() {
    const toast = document.getElementById('social-proof-toast');
    toast.classList.remove('show');
    clearTimeout(this.timer);
    // Show next one later
    setTimeout(() => this.showRandom(), 45000 + Math.random() * 15000);
  },

  hide() {
    localStorage.setItem('hideSocialProof', 'true');
    const toast = document.getElementById('social-proof-toast');
    toast.classList.remove('show');
    clearTimeout(this.timer);
  }
};
