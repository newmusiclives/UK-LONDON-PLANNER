// ============================================================
// EXIT-INTENT POPUP
// Shows offer when user moves cursor to close tab
// ============================================================
const ExitIntent = {
  triggered: false,

  init() {
    if (sessionStorage.getItem('exitIntentShown')) return;
    if (localStorage.getItem('subscriberEmail')) return;
    if (window.innerWidth < 768) return; // No exit intent on mobile

    // Delay activation by 10 seconds
    setTimeout(() => {
      document.addEventListener('mouseout', (e) => {
        if (this.triggered) return;
        if (e.clientY < 0 || e.relatedTarget === null) {
          this.triggered = true;
          sessionStorage.setItem('exitIntentShown', 'true');
          this.show();
        }
      });
    }, 10000);
  },

  show() {
    const isWizard = window.location.pathname.includes('wizard');
    const overlay = document.createElement('div');
    overlay.id = 'exit-intent-overlay';
    overlay.innerHTML = `
      <style>
        #exit-intent-overlay { position:fixed;inset:0;background:rgba(27,42,74,0.85);z-index:9998;display:flex;align-items:center;justify-content:center;animation:eiFadeIn 0.3s; }
        @keyframes eiFadeIn { from{opacity:0} to{opacity:1} }
        .ei-popup { background:white;border-radius:16px;max-width:480px;width:90%;padding:2.5rem;text-align:center;position:relative;animation:eiSlideUp 0.4s ease; }
        @keyframes eiSlideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .ei-popup::before { content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--color-accent,#C9A84C),var(--color-accent-hover,#B8912E));border-radius:16px 16px 0 0; }
        .ei-close { position:absolute;top:12px;right:16px;background:none;border:none;font-size:1.5rem;color:#9CA3AF;cursor:pointer; }
        .ei-close:hover { color:#2C2C2C; }
        .ei-emoji { font-size:3rem;margin-bottom:1rem; }
        .ei-popup h3 { font-family:var(--font-heading,serif);color:var(--color-primary,#1B2A4A);font-size:1.5rem;margin-bottom:0.5rem; }
        .ei-popup p { color:#6B7280;margin-bottom:1.5rem;font-size:0.95rem;line-height:1.6; }
        .ei-form { display:flex;gap:8px;margin-bottom:1rem; }
        .ei-form input { flex:1;padding:12px 16px;border:2px solid #e5e1d8;border-radius:8px;font-size:0.95rem;outline:none; }
        .ei-form input:focus { border-color:var(--color-accent,#C9A84C); }
        .ei-form button { background:var(--color-accent,#C9A84C);color:var(--color-primary,#1B2A4A);border:none;border-radius:8px;padding:12px 20px;font-weight:700;cursor:pointer;font-size:0.95rem;white-space:nowrap; }
        .ei-form button:hover { background:var(--color-accent-hover,#B8912E); }
        .ei-dismiss { color:#9CA3AF;font-size:0.8rem;cursor:pointer;border:none;background:none;text-decoration:underline; }
        .ei-dismiss:hover { color:#6B7280; }
      </style>
      <div class="ei-popup">
        <button class="ei-close" onclick="ExitIntent.close()" aria-label="Close popup">&times;</button>
        ${isWizard ? `
          <div class="ei-emoji">✨</div>
          <h3>Your Itinerary Is Almost Ready!</h3>
          <p>Don't leave now — complete your plan and get a free 2-day preview of your personalised London itinerary.</p>
          <button class="btn btn--primary btn--large" style="width:100%;padding:14px;font-size:1rem;" onclick="ExitIntent.close()">Continue Planning</button>
          <br><br>
          <button class="ei-dismiss" onclick="ExitIntent.close()">Maybe later</button>
        ` : `
          <div class="ei-emoji">🇬🇧</div>
          <h3>Wait! Don't Miss Your Free London Insider Tips</h3>
          <p>Get our top 3 hidden gems, money-saving secrets, and local tips that most tourists never discover — completely free.</p>
          <form class="ei-form" id="ei-form" onsubmit="ExitIntent.submit(event)">
            <input type="email" placeholder="Your email address" required id="ei-email" aria-label="Email address">
            <button type="submit">Get Free Tips</button>
          </form>
          <button class="ei-dismiss" onclick="ExitIntent.close()">No thanks, I'll figure it out myself</button>
        `}
      </div>
    `;
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) ExitIntent.close();
    });

    // Close on Escape
    document.addEventListener('keydown', function handler(e) {
      if (e.key === 'Escape') { ExitIntent.close(); document.removeEventListener('keydown', handler); }
    });
  },

  async submit(e) {
    e.preventDefault();
    const email = document.getElementById('ei-email').value;
    const btn = document.querySelector('#ei-form button');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    localStorage.setItem('subscriberEmail', email);
    if (typeof GHL !== 'undefined') {
      await GHL.captureContact({ email, source: 'exit_intent_popup' });
    }
    if (typeof Analytics !== 'undefined') Analytics.emailCapture('exit_intent');

    btn.textContent = 'Sent!';
    setTimeout(() => {
      this.close();
      window.location.href = 'newsletter-welcome.html';
    }, 1000);
  },

  close() {
    const overlay = document.getElementById('exit-intent-overlay');
    if (overlay) overlay.remove();
  }
};
