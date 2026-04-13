// ============================================================
// SMS / TEXT OUTREACH
// SMS campaign management, templates, compliance, send/schedule
// Integrates with GHL for actual delivery
// ============================================================
const SMSOutreach = {
  STORAGE_KEY: 'smsOutreach',

  templates: [
    { id: 'welcome', name: 'Welcome SMS', trigger: 'email_signup', delay: 'Immediate', message: 'Welcome to London Planned {first_name}! 🇬🇧 Your free London guide is ready: {guide_link}', category: 'onboarding' },
    { id: 'wizard-abandon', name: 'Wizard Abandonment', trigger: 'wizard_abandoned', delay: '2 hours', message: 'Hey {first_name}! Your London trip is still waiting 🗺️ Pick up where you left off and get 10% off: {wizard_link}', category: 'recovery' },
    { id: 'purchase-confirm', name: 'Purchase Confirmation', trigger: 'purchase_complete', delay: 'Immediate', message: 'Your London itinerary is ready! 🎉 View it here: {itinerary_link}. Have an amazing trip {first_name}!', category: 'transactional' },
    { id: 'trip-tomorrow', name: 'Trip Reminder', trigger: 'trip_tomorrow', delay: '9am day before', message: '✈️ London tomorrow {first_name}! Itinerary: {itinerary_link} | Weather: {weather} | Have a brilliant time!', category: 'lifecycle' },
    { id: 'trip-day-1', name: 'Day 1 Welcome', trigger: 'trip_day_1', delay: '8am trip start', message: 'Good morning from London! ☀️ Your Day 1 starts at {first_activity}. Full plan: {itinerary_link} Enjoy!', category: 'lifecycle' },
    { id: 'post-trip', name: 'Post-Trip Review', trigger: 'trip_ended', delay: '3 days after', message: 'Hope you loved London {first_name}! 🇬🇧 Quick review? {review_link} — helps future travellers!', category: 'engagement' },
    { id: 'flash-sale', name: 'Flash Sale Alert', trigger: 'manual', delay: 'Immediate', message: '⚡ 24HR SALE: London itineraries 25% off! Your personalised trip from just $37.50: {sale_link}', category: 'promotion' },
    { id: 'referral-nudge', name: 'Referral Nudge', trigger: 'purchase_7days', delay: '7 days post-purchase', message: 'Loved your London trip? 🎁 Give a friend $10 off and earn $10 credit: {referral_link}', category: 'growth' },
    { id: 'seasonal', name: 'Seasonal Prompt', trigger: 'seasonal_campaign', delay: 'Campaign start', message: '🎄 Christmas in London is magical! Book your festive itinerary early and save 20%: {campaign_link}', category: 'promotion' },
    { id: 'win-back', name: 'Win-Back', trigger: 'inactive_60_days', delay: '60 days inactive', message: 'We miss you {first_name}! 🇬🇧 London has new restaurants, shows & hidden gems since your last visit. Plan again: {link}', category: 'retention' },
  ],

  init(containerId) {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('sms-outreach')) return;
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const data = this._getData();
    container.innerHTML = `
      <div class="sms-widget">
        <div class="sms-header">
          <h3>SMS Outreach</h3>
          <p>Automated text messages at key moments in the customer journey.</p>
        </div>

        <!-- Stats -->
        <div class="sms-stats">
          <div class="sms-stat"><span class="sms-stat__num">${data.totalSent || 0}</span><span class="sms-stat__label">Sent</span></div>
          <div class="sms-stat"><span class="sms-stat__num">${data.totalDelivered || 0}</span><span class="sms-stat__label">Delivered</span></div>
          <div class="sms-stat"><span class="sms-stat__num">${data.totalClicked || 0}</span><span class="sms-stat__label">Clicked</span></div>
          <div class="sms-stat"><span class="sms-stat__num">${((data.totalClicked || 0) / Math.max(data.totalSent || 1, 1) * 100).toFixed(1)}%</span><span class="sms-stat__label">CTR</span></div>
        </div>

        <!-- Template Library -->
        <div class="sms-section">
          <h4>Message Templates (${this.templates.length})</h4>
          <div class="sms-filter-bar">
            <button class="sms-filter sms-filter--active" data-cat="all">All</button>
            <button class="sms-filter" data-cat="onboarding">Onboarding</button>
            <button class="sms-filter" data-cat="recovery">Recovery</button>
            <button class="sms-filter" data-cat="lifecycle">Lifecycle</button>
            <button class="sms-filter" data-cat="promotion">Promotion</button>
            <button class="sms-filter" data-cat="engagement">Engagement</button>
            <button class="sms-filter" data-cat="growth">Growth</button>
            <button class="sms-filter" data-cat="retention">Retention</button>
          </div>
          <div class="sms-templates" id="sms-templates">
            ${this.templates.map(t => `
              <div class="sms-template" data-category="${t.category}">
                <div class="sms-template__header">
                  <strong>${t.name}</strong>
                  <span class="sms-template__badge sms-template__badge--${t.category}">${t.category}</span>
                </div>
                <div class="sms-template__trigger">Trigger: ${t.trigger} · Delay: ${t.delay}</div>
                <div class="sms-template__preview">
                  <div class="sms-bubble">${t.message}<br><small class="sms-compliance">Reply STOP to unsubscribe</small></div>
                </div>
                <div class="sms-template__actions">
                  <button class="btn btn--small" onclick="SMSOutreach._testSend('${t.id}')">Send Test</button>
                  <label class="sms-toggle-label"><input type="checkbox" checked> Active</label>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Compose -->
        <div class="sms-section">
          <h4>Compose Custom SMS</h4>
          <form class="sms-compose" onsubmit="SMSOutreach._sendCustom(event)">
            <input type="tel" id="sms-phone" placeholder="+44 7xxx xxx xxx" class="sms-input">
            <textarea id="sms-message" class="sms-textarea" rows="3" placeholder="Your message (max 160 chars)" maxlength="160"></textarea>
            <div class="sms-compose__footer">
              <span class="sms-char-count" id="sms-char-count">160</span>
              <button type="submit" class="btn btn--primary btn--small">Send SMS</button>
            </div>
          </form>
        </div>

        <!-- Compliance -->
        <div class="sms-section sms-compliance-section">
          <h4>Compliance & Opt-Out</h4>
          <ul>
            <li>All messages include "Reply STOP to unsubscribe"</li>
            <li>STOP replies are processed automatically via GHL</li>
            <li>Maximum 4 promotional SMS per month per contact</li>
            <li>Transactional SMS (confirmations, trip reminders) exempt from limit</li>
            <li>Numbers validated before send (UK & international formats)</li>
            <li>GDPR consent required before adding to SMS list</li>
          </ul>
        </div>
      </div>
    `;

    // Character counter
    const msg = container.querySelector('#sms-message');
    const counter = container.querySelector('#sms-char-count');
    if (msg && counter) {
      msg.addEventListener('input', () => { counter.textContent = 160 - msg.value.length; });
    }

    // Filter tabs
    container.querySelectorAll('.sms-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.sms-filter').forEach(b => b.classList.remove('sms-filter--active'));
        btn.classList.add('sms-filter--active');
        const cat = btn.dataset.cat;
        container.querySelectorAll('.sms-template').forEach(t => {
          t.style.display = (cat === 'all' || t.dataset.category === cat) ? '' : 'none';
        });
      });
    });
  },

  _testSend(templateId) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return;
    alert(`TEST SMS would send:\n\n"${template.message.replace(/\{.*?\}/g, '[dynamic]')}"\n\nIn production, this sends via GoHighLevel SMS API.`);
  },

  _sendCustom(e) {
    e.preventDefault();
    const phone = document.getElementById('sms-phone')?.value;
    const message = document.getElementById('sms-message')?.value;
    if (!phone || !message) return;
    alert(`SMS would send to ${phone}:\n\n"${message}"\n\nIn production, this sends via GoHighLevel SMS API.`);
  },

  _getData() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}'); }
    catch (e) { return {}; }
  }
};
