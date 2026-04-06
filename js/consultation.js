document.addEventListener('DOMContentLoaded', () => {
  UI.init();

  const main = document.querySelector('.main');
  const features = CONFIG.consultation.features;

  main.innerHTML = `
    <!-- Hero -->
    <section class="section section--dark" style="text-align: center; padding: 5rem 0;">
      <div class="container">
        <h1 style="color: var(--color-text-light); font-size: 2.5rem;">Personal London Planning Session</h1>
        <div class="divider"></div>
        <p style="color: rgba(255,255,255,0.8); font-size: 1.15rem; max-width: 600px; margin: 0 auto 2rem;">
          Get a private 1-on-1 video call with a London expert who'll make your trip absolutely perfect.
        </p>
        <div style="font-family: var(--font-heading); font-size: 3.5rem; color: var(--color-accent); font-weight: 700; margin-bottom: 0.5rem;">$75</div>
        <p style="color: var(--color-accent-light); font-size: 1rem; margin-bottom: 2rem;">1 Hour Private Video Consultation</p>
        <button class="btn btn--primary btn--large" id="btn-book-consultation">Book Your Session</button>
      </div>
    </section>

    <!-- What's Included -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>What's Included</h2>
          <div class="divider"></div>
          <p>Everything you need for a flawless London experience</p>
        </div>
        <div class="grid grid--3">
          ${features.map((feature, i) => `
            <div class="card" style="text-align: center;">
              <div class="card__body">
                <div style="font-size: 2rem; margin-bottom: 1rem;">${['📹', '✏️', '🏨', '💎', '📧', '🆘'][i] || '✓'}</div>
                <p style="font-weight: 600; color: var(--color-primary);">${feature}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section section--alt">
      <div class="container">
        <div class="section-header">
          <h2>How It Works</h2>
          <div class="divider"></div>
        </div>
        <div class="grid grid--3" style="max-width: 900px; margin: 0 auto;">
          <div style="text-align: center;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--color-accent); color: var(--color-primary); font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">1</div>
            <h4>Book & Share</h4>
            <p style="color: var(--color-text-muted); font-size: 0.9rem;">Complete payment and tell us about your travel dates, preferences, and questions.</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--color-accent); color: var(--color-primary); font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">2</div>
            <h4>Video Call</h4>
            <p style="color: var(--color-text-muted); font-size: 0.9rem;">1-hour private video session where we plan every detail of your trip together.</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--color-accent); color: var(--color-primary); font-size: 1.5rem; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">3</div>
            <h4>Follow Up</h4>
            <p style="color: var(--color-text-muted); font-size: 0.9rem;">Receive a detailed email with all recommendations, links, and 7 days of priority support.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Booking Form -->
    <section class="section">
      <div class="container container--narrow">
        <div class="section-header">
          <h2>Request Your Session</h2>
          <div class="divider"></div>
          <p>Fill in your details and we'll get back to you within 24 hours to confirm your slot</p>
        </div>
        <div class="card">
          <div class="card__body">
            <form id="consultation-form" style="display: grid; gap: 1.25rem;">
              <div>
                <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Your Name</label>
                <input type="text" id="c-name" required
                  style="width: 100%; padding: 0.75rem 1rem; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: 1rem; transition: border-color 0.2s;"
                  placeholder="John Smith">
              </div>
              <div>
                <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Email Address</label>
                <input type="email" id="c-email" required
                  style="width: 100%; padding: 0.75rem 1rem; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: 1rem;"
                  placeholder="john@example.com">
              </div>
              <div>
                <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Phone Number</label>
                <input type="tel" id="c-phone"
                  style="width: 100%; padding: 0.75rem 1rem; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: 1rem;"
                  placeholder="+1 (555) 000-0000">
              </div>
              <div>
                <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Preferred Date & Time</label>
                <input type="datetime-local" id="c-datetime"
                  style="width: 100%; padding: 0.75rem 1rem; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: 1rem;">
              </div>
              <div>
                <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Travel Dates (if known)</label>
                <input type="text" id="c-travel-dates"
                  style="width: 100%; padding: 0.75rem 1rem; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: 1rem;"
                  placeholder="e.g., June 15-22, 2026">
              </div>
              <div>
                <label style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Tell us about your trip</label>
                <textarea id="c-details" rows="4"
                  style="width: 100%; padding: 0.75rem 1rem; border: 2px solid var(--color-border); border-radius: var(--radius-md); font-size: 1rem; resize: vertical;"
                  placeholder="Who's travelling, special interests, any specific requests..."></textarea>
              </div>
              <button type="submit" class="btn btn--primary btn--large btn--full">
                Book & Pay — $75
              </button>
              <p style="text-align: center; font-size: 0.8rem; color: var(--color-text-muted);">
                Secure payment via Manifest Financial. Full refund if cancelled 48+ hours before your session.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Also Available -->
    <section class="section section--dark">
      <div class="container" style="text-align: center;">
        <h2 style="color: var(--color-text-light);">Prefer to Self-Plan?</h2>
        <div class="divider"></div>
        <p style="color: rgba(255,255,255,0.8); max-width: 500px; margin: 0 auto 2rem;">
          Our itinerary builder creates personalised day-by-day plans starting at just $50.
        </p>
        <a href="wizard.html" class="btn btn--primary btn--large">Create Your Itinerary</a>
      </div>
    </section>
  `;

  // Event handlers
  document.getElementById('btn-book-consultation').addEventListener('click', () => {
    document.getElementById('consultation-form').scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('consultation-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById('c-name').value,
      email: document.getElementById('c-email').value,
      phone: document.getElementById('c-phone').value,
      datetime: document.getElementById('c-datetime').value,
      travelDates: document.getElementById('c-travel-dates').value,
      details: document.getElementById('c-details').value
    };

    // Store form data for reference after payment
    localStorage.setItem('consultationRequest', JSON.stringify(formData));

    // Send to GoHighLevel CRM and redirect to Manifest Financial payment
    Payment.initiateConsultation(formData);
  });
});
