const UI = {
  init() {
    this.renderHeader();
    this.renderFooter();
    this.initMobileNav();
    this.initCurrencySelector();
  },

  renderHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const curr = CurrencyConverter.get();
    header.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <div class="header__inner">
        <a href="index.html" class="header__logo" aria-label="London & UK Planner - Home">
          <span class="header__logo-icon" aria-hidden="true">🇬🇧</span>
          London & UK Planner
        </a>
        <nav class="header__nav" id="main-nav">
          <a href="demo.html">Demo</a>
          <a href="blog.html">Guide</a>
          <a href="airport-transfers.html">Transfers</a>
          <a href="consultation.html">Consultation</a>
          <div class="currency-selector">
            <select id="currency-select" aria-label="Select currency">
              ${Object.keys(CONFIG.currencies).map(c =>
                `<option value="${c}" ${c === curr ? 'selected' : ''}>${CONFIG.currencies[c].symbol} ${c}</option>`
              ).join('')}
            </select>
          </div>
          <a href="wizard.html" class="btn btn--primary btn--small header__cta">Plan My Trip</a>
        </nav>
        <button class="header__mobile-toggle" id="nav-toggle" aria-label="Toggle menu">☰</button>
      </div>
    `;
  },

  renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    footer.innerHTML = `
      <div class="container">
        <div class="footer__grid">
          <div>
            <div class="footer__brand">🇬🇧 London & UK Planner</div>
            <p class="footer__desc">
              Expertly curated London itineraries tailored to your interests, budget, and travel style.
              Your perfect London adventure starts here.
            </p>
            <div class="footer__social" style="margin-top:1rem;display:flex;gap:0.75rem;">
              <a href="#" aria-label="Instagram" style="font-size:1.25rem;">📷</a>
              <a href="#" aria-label="TikTok" style="font-size:1.25rem;">🎵</a>
              <a href="#" aria-label="Facebook" style="font-size:1.25rem;">📘</a>
              <a href="#" aria-label="Twitter" style="font-size:1.25rem;">🐦</a>
            </div>
          </div>
          <div>
            <div class="footer__title">Plan</div>
            <ul class="footer__links">
              <li><a href="wizard.html">Create Itinerary</a></li>
              <li><a href="consultation.html">Expert Consultation</a></li>
              <li><a href="airport-transfers.html">Airport Transfers</a></li>
              <li><a href="index.html#pricing">Pricing</a></li>
              <li><a href="index.html#how-it-works">How It Works</a></li>
            </ul>
          </div>
          <div>
            <div class="footer__title">Explore</div>
            <ul class="footer__links">
              <li><a href="demo.html">Sample Itinerary</a></li>
              <li><a href="travel-tips.html">London Travel Tips</a></li>
              <li><a href="getting-around.html">Getting Around</a></li>
              <li><a href="best-time-to-visit.html">Best Time to Visit</a></li>
              <li><a href="blog.html">Travel Guide</a></li>
            </ul>
          </div>
          <div>
            <div class="footer__title">Support</div>
            <ul class="footer__links">
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="faq.html">FAQ</a></li>
              <li><a href="privacy.html">Privacy Policy</a></li>
              <li><a href="terms.html">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <!-- Email Capture -->
        <div class="footer__email-capture" style="background:var(--color-primary-light);border-radius:var(--radius-lg);padding:2rem;margin-bottom:2rem;text-align:center;">
          <h4 style="color:white;margin-bottom:0.5rem;">Get 3 Free London Insider Tips</h4>
          <p style="color:rgba(255,255,255,0.7);font-size:0.9rem;margin-bottom:1rem;">Join 5,000+ travellers who get our best London secrets</p>
          <form class="email-capture-form" id="footer-email-form" style="display:flex;gap:0.5rem;max-width:450px;margin:0 auto;flex-wrap:wrap;justify-content:center;">
            <input type="email" placeholder="Enter your email" required
              style="flex:1;min-width:200px;padding:0.75rem 1rem;border:2px solid rgba(255,255,255,0.2);border-radius:var(--radius-md);font-size:0.95rem;background:rgba(255,255,255,0.1);color:white;">
            <button type="submit" class="btn btn--primary">Get Free Tips</button>
          </form>
          <p style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-top:0.5rem;">No spam. Unsubscribe anytime.</p>
        </div>

        <div class="footer__bottom">
          <span>&copy; ${new Date().getFullYear()} London & UK Planner. All rights reserved.</span>
          <p class="footer__disclosure">${CONFIG.affiliate.disclosureText}</p>
        </div>
      </div>
    `;

    // Email capture form handler
    const emailForm = document.getElementById('footer-email-form');
    if (emailForm) {
      emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailForm.querySelector('input[type="email"]').value;
        const btn = emailForm.querySelector('button');
        btn.disabled = true;
        btn.textContent = 'Sending...';

        await GHL.captureContact({ email, source: 'footer_email_capture' });

        btn.textContent = 'Sent!';
        emailForm.querySelector('input').value = '';
        UI.showToast('Thanks! Check your inbox for London insider tips.');
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = 'Get Free Tips';
        }, 3000);
      });
    }
  },

  initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header__inner')) {
        nav.classList.remove('open');
        toggle.textContent = '☰';
      }
    });
  },

  initCurrencySelector() {
    document.addEventListener('change', (e) => {
      if (e.target.id === 'currency-select') {
        CurrencyConverter.set(e.target.value);
      }
    });
  },

  showToast(message, duration = 3000) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  },

  formatCurrency(amount, currency = 'GBP') {
    const symbols = { GBP: '£', USD: '$', EUR: '€', AUD: 'A$', CAD: 'C$' };
    return `${symbols[currency] || currency}${amount.toFixed(2)}`;
  }
};
