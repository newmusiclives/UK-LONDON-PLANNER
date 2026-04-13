const UI = {
  init() {
    if (typeof I18N !== 'undefined') I18N.init();
    this.renderHeader();
    this.renderFooter();
    this.initMobileNav();
    this.initCurrencySelector();
    this.initLanguageSelector();
    this.initCookieConsent();
    this.initAffiliateDisclosure();
  },

  renderHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const curr = CurrencyConverter.get();
    const _t = (key, fallback) => typeof I18N !== 'undefined' ? I18N.t(key) : fallback;
    const langSelector = '';
    header.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <div class="header__inner">
        <a href="index.html" class="header__logo" aria-label="London & UK Planner - Home">
          <span class="header__logo-icon" aria-hidden="true">🇬🇧</span>
          London & UK Planner
        </a>
        <nav class="header__nav" id="main-nav" aria-label="Main navigation" role="navigation">
          <a href="demo.html">${_t('nav.demo', 'Demo')}</a>
          <a href="blog.html">${_t('nav.guide', 'Guide')}</a>
          <a href="neighbourhoods.html">${_t('nav.neighbourhoods', 'Neighbourhoods')}</a>
          <a href="whats-on.html">${_t('nav.whatsOn', "What's On")}</a>
          <a href="quiz.html">${_t('nav.quiz', 'Quiz')}</a>
          <a href="free-guide.html">${_t('nav.freeGuide', 'Free Guide')}</a>
          <a href="book-services.html">${_t('nav.bookServices', 'Book Services')}</a>
          <a href="my-trips.html">${_t('nav.myTrips', 'My Trips')}</a>
          <div class="currency-selector">
            <select id="currency-select" aria-label="${_t('currency.selectLabel', 'Select currency')}">
              ${Object.keys(CONFIG.currencies).map(c =>
                `<option value="${c}" ${c === curr ? 'selected' : ''}>${CONFIG.currencies[c].symbol} ${c}</option>`
              ).join('')}
            </select>
          </div>
          <a href="wizard.html" class="btn btn--primary btn--small header__cta" role="button">${_t('nav.planMyTrip', 'Plan My Trip')}</a>
        </nav>
        <button class="header__mobile-toggle" id="nav-toggle" aria-label="${_t('nav.toggleMenu', 'Toggle navigation menu')}" aria-expanded="false" aria-controls="main-nav">☰</button>
      </div>
    `;
  },

  renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const _t = (key, fallback) => typeof I18N !== 'undefined' ? I18N.t(key) : fallback;
    footer.innerHTML = `
      <div class="container">
        <div class="footer__grid">
          <div>
            <div class="footer__brand">🇬🇧 London & UK Planner</div>
            <p class="footer__desc">
              ${_t('footer.desc', 'Expertly curated London itineraries tailored to your interests, budget, and travel style. Your perfect London adventure starts here.')}
            </p>
          </div>
          <div>
            <div class="footer__title">${_t('footer.plan', 'Plan')}</div>
            <ul class="footer__links">
              <li><a href="wizard.html">${_t('footer.createItinerary', 'Create Itinerary')}</a></li>
              <li><a href="quiz.html">${_t('footer.quiz', 'What Type of Traveller?')}</a></li>
              <li><a href="free-guide.html">${_t('footer.freeGuide', 'Free London Guide')}</a></li>
              <li><a href="airport-transfers.html">${_t('footer.airportTransfers', 'Airport Transfers')}</a></li>
              <li><a href="index.html#pricing">${_t('footer.pricing', 'Pricing')}</a></li>
              <li><a href="index.html#how-it-works">${_t('footer.howItWorks', 'How It Works')}</a></li>
            </ul>
          </div>
          <div>
            <div class="footer__title">${_t('footer.explore', 'Explore')}</div>
            <ul class="footer__links">
              <li><a href="demo.html">${_t('footer.sampleItinerary', 'Sample Itinerary')}</a></li>
              <li><a href="blog.html">${_t('footer.travelGuide', 'Travel Guide')}</a></li>
              <li><a href="neighbourhoods.html">${_t('footer.neighbourhoodGuides', 'Neighbourhood Guides')}</a></li>
              <li><a href="whats-on.html">${_t('footer.whatsOnLondon', "What's On in London")}</a></li>
              <li><a href="day-trips.html">${_t('footer.dayTrips', 'Day Trips from London')}</a></li>
              <li><a href="travel-tips.html">${_t('footer.travelTips', 'Travel Tips')}</a></li>
              <li><a href="getting-around.html">${_t('footer.gettingAround', 'Getting Around')}</a></li>
              <li><a href="best-time-to-visit.html">${_t('footer.bestTimeToVisit', 'Best Time to Visit')}</a></li>
              <li><a href="compare-london-paris.html">London vs Paris</a></li>
              <li><a href="compare-oyster-travelcard.html">Oyster vs Travelcard</a></li>
            </ul>
          </div>
          <div>
            <div class="footer__title">${_t('footer.support', 'Support')}</div>
            <ul class="footer__links">
              <li><a href="my-trips.html">${_t('nav.myTrips', 'My Trips')}</a></li>
              <li><a href="testimonials.html">Share Your Experience</a></li>
              <li><a href="contact.html">${_t('footer.contactUs', 'Contact Us')}</a></li>
              <li><a href="faq.html">${_t('footer.faq', 'FAQ')}</a></li>
              <li><a href="privacy.html">${_t('footer.privacyPolicy', 'Privacy Policy')}</a></li>
              <li><a href="terms.html">${_t('footer.termsOfService', 'Terms of Service')}</a></li>
              <li><a href="admin.html">Admin Panel</a></li>
              <li><a href="marketing.html">Marketing</a></li>
              <li><a href="features.html">Feature Flags</a></li>
            </ul>
          </div>
        </div>

        <!-- UGC Gallery -->
        <div style="margin-bottom:2rem;text-align:center;">
          <h4 style="color:white;margin-bottom:0.5rem;">${_t('footer.shareYourMoments', 'Share Your London Moments')}</h4>
          <p style="color:rgba(255,255,255,0.7);font-size:0.9rem;margin-bottom:1rem;">${_t('footer.tagUs', 'Tag <strong style="color:var(--color-accent);">#MyLondonPlanner</strong> on Instagram for a chance to be featured')}</p>
          <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;border-radius:var(--radius-md);overflow:hidden;max-width:600px;margin:0 auto;">
            ${['🌉','🎡','🏰','🌳','🍽️','🎭','🌅','🚕','🎪','☕','🎶','🏛️'].map((emoji, i) =>
              '<div style="aspect-ratio:1;background:' + ['#2A3F6B','#1B2A4A','#3A4F7B','#1B2A4A','#2A3F6B','#3A4F7B'][i%6] + ';display:flex;align-items:center;justify-content:center;font-size:1.5rem;opacity:0.6;">' + emoji + '</div>'
            ).join('')}
          </div>
          <p style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-top:0.5rem;">${_t('footer.galleryComingSoon', "Photo gallery coming soon — share your photos and we'll feature the best ones!")}</p>
        </div>

        <!-- Email Capture -->
        <div class="footer__email-capture" style="background:var(--color-primary-light);border-radius:var(--radius-lg);padding:2rem;margin-bottom:2rem;text-align:center;">
          <h4 style="color:white;margin-bottom:0.5rem;">${_t('email.headline', 'Get 3 Free London Insider Tips')}</h4>
          <p style="color:rgba(255,255,255,0.7);font-size:0.9rem;margin-bottom:1rem;">${_t('email.subheadline', 'Join 5,000+ travellers who get our best London secrets')}</p>
          <form class="email-capture-form" id="footer-email-form" style="display:flex;gap:0.5rem;max-width:450px;margin:0 auto;flex-wrap:wrap;justify-content:center;">
            <input type="email" placeholder="${_t('email.placeholder', 'Enter your email')}" required
              style="flex:1;min-width:200px;padding:0.75rem 1rem;border:2px solid rgba(255,255,255,0.2);border-radius:var(--radius-md);font-size:0.95rem;background:rgba(255,255,255,0.1);color:white;">
            <button type="submit" class="btn btn--primary">${_t('email.cta', 'Get Free Tips')}</button>
          </form>
          <p style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-top:0.5rem;">${_t('email.disclaimer', 'No spam. Unsubscribe anytime.')}</p>
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

        if (typeof Analytics !== 'undefined') Analytics.emailCapture('footer');
        btn.textContent = 'Sent!';
        emailForm.querySelector('input').value = '';
        UI.showToast('Thanks! Redirecting to your free tips...');
        setTimeout(() => {
          window.location.href = 'newsletter-welcome.html';
        }, 1500);
      });
    }
  },

  initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.textContent = isOpen ? '✕' : '☰';
      toggle.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header__inner')) {
        nav.classList.remove('open');
        toggle.textContent = '☰';
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close nav on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.textContent = '☰';
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
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

  initLanguageSelector() {
    document.addEventListener('change', (e) => {
      if (e.target.id === 'lang-select' && typeof I18N !== 'undefined') {
        I18N.setLang(e.target.value);
      }
    });
  },

  initAffiliateDisclosure() {
    // Show affiliate disclosure on blog and booking pages
    const path = window.location.pathname;
    if (!path.includes('blog-') && !path.includes('book-') && !path.includes('compare-') && !path.includes('neighbourhood-')) return;
    const main = document.getElementById('main-content') || document.querySelector('main');
    if (!main) return;
    const notice = document.createElement('div');
    notice.style.cssText = 'background:#fefce8;border-left:4px solid #f59e0b;padding:0.75rem 1rem;font-size:0.8rem;color:#92400e;max-width:800px;margin:1rem auto;border-radius:4px;';
    notice.textContent = CONFIG?.affiliate?.disclosureText || 'We may earn a small commission from bookings made through our links, at no extra cost to you.';
    main.insertBefore(notice, main.firstChild?.nextSibling || main.firstChild);
  },

  initCookieConsent() {
    if (localStorage.getItem('cookieConsent')) return;
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML = `
      <div style="position:fixed;bottom:0;left:0;right:0;background:var(--color-primary);color:white;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;z-index:9999;box-shadow:0 -4px 20px rgba(0,0,0,0.2);">
        <p style="font-size:0.85rem;margin:0;max-width:700px;">We use cookies and localStorage to save your itinerary preferences and improve your experience. By continuing to use this site, you agree to our <a href="privacy.html" style="color:var(--color-accent);text-decoration:underline;">Privacy Policy</a>.</p>
        <div style="display:flex;gap:0.5rem;flex-shrink:0;">
          <button onclick="document.getElementById('cookie-banner').remove();localStorage.setItem('cookieConsent','accepted')" class="btn btn--primary btn--small">Accept</button>
          <button onclick="document.getElementById('cookie-banner').remove();localStorage.setItem('cookieConsent','essential')" class="btn btn--outline btn--small" style="color:white;border-color:rgba(255,255,255,0.3);">Essential Only</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
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
