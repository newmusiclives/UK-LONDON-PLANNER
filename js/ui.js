const UI = {
  init() {
    this.renderHeader();
    this.renderFooter();
    this.initMobileNav();
  },

  renderHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    header.innerHTML = `
      <div class="header__inner">
        <a href="index.html" class="header__logo">
          <span class="header__logo-icon">🇬🇧</span>
          London Journey Planner
        </a>
        <nav class="header__nav" id="main-nav">
          <a href="index.html">Home</a>
          <a href="demo.html">Demo Itinerary</a>
          <a href="wizard.html">Plan My Trip</a>
          <a href="consultation.html">Expert Consultation</a>
          <a href="wizard.html" class="btn btn--primary btn--small header__cta">Start Planning</a>
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
            <div class="footer__brand">🇬🇧 London Journey Planner</div>
            <p class="footer__desc">
              Expertly curated London itineraries tailored to your interests, budget, and travel style.
              Your perfect London adventure starts here.
            </p>
          </div>
          <div>
            <div class="footer__title">Plan</div>
            <ul class="footer__links">
              <li><a href="wizard.html">Create Itinerary</a></li>
              <li><a href="consultation.html">Expert Consultation</a></li>
              <li><a href="index.html#pricing">Pricing</a></li>
              <li><a href="index.html#how-it-works">How It Works</a></li>
            </ul>
          </div>
          <div>
            <div class="footer__title">Explore</div>
            <ul class="footer__links">
              <li><a href="index.html#sample">Sample Itinerary</a></li>
              <li><a href="#">London Travel Tips</a></li>
              <li><a href="#">Getting Around</a></li>
              <li><a href="#">Best Time to Visit</a></li>
            </ul>
          </div>
          <div>
            <div class="footer__title">Support</div>
            <ul class="footer__links">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__bottom">
          <span>&copy; ${new Date().getFullYear()} London Journey Planner. All rights reserved.</span>
          <p class="footer__disclosure">${CONFIG.affiliate.disclosureText}</p>
        </div>
      </div>
    `;
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
    const symbols = { GBP: '£', USD: '$', EUR: '€' };
    return `${symbols[currency] || currency}${amount.toFixed(2)}`;
  }
};
