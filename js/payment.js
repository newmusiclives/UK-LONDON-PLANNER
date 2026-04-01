const Payment = {
  getTier(days) {
    return State.getPriceTier(days);
  },

  getPrice(days) {
    return State.getPrice(days);
  },

  getManifestLink(tier) {
    return CONFIG.manifest.links[tier] || null;
  },

  initiatePurchase(days, contactInfo) {
    const tier = this.getTier(days);
    const link = this.getManifestLink(tier);
    const sessionId = State.getSessionId();

    // Send to GoHighLevel CRM
    if (contactInfo) {
      GHL.trackItineraryPurchase({
        email: contactInfo.email,
        name: contactInfo.name,
        phone: contactInfo.phone || '',
        tier,
        days,
        price: this.getPrice(days),
        sessionId
      });
    }

    if (link && !link.includes('YOUR_')) {
      const separator = link.includes('?') ? '&' : '?';
      window.location.href = `${link}${separator}client_reference_id=${sessionId}`;
    } else {
      // Demo mode
      this.unlockDemo(tier);
    }
  },

  initiateConcierge(contactInfo) {
    const link = CONFIG.manifest.links.concierge;
    const sessionId = State.getSessionId();

    if (contactInfo) {
      GHL.trackConciergeBooking({
        email: contactInfo.email,
        name: contactInfo.name,
        phone: contactInfo.phone || '',
        sessionId
      });
    }

    if (link && !link.includes('YOUR_')) {
      const separator = link.includes('?') ? '&' : '?';
      window.location.href = `${link}${separator}client_reference_id=${sessionId}`;
    } else {
      UI.showToast('Demo mode: In production, this would redirect to Manifest Financial for $50 concierge payment');
    }
  },

  initiateConsultation(contactInfo) {
    const link = CONFIG.manifest.links.consultation;
    const sessionId = State.getSessionId();

    if (contactInfo) {
      GHL.trackConsultationBooking({
        email: contactInfo.email,
        name: contactInfo.name,
        phone: contactInfo.phone || '',
        datetime: contactInfo.datetime || '',
        travelDates: contactInfo.travelDates || '',
        details: contactInfo.details || '',
        sessionId
      });
    }

    if (link && !link.includes('YOUR_')) {
      const separator = link.includes('?') ? '&' : '?';
      window.location.href = `${link}${separator}client_reference_id=${sessionId}`;
    } else {
      UI.showToast('Demo mode: In production, this would redirect to Manifest Financial for $75 payment');
    }
  },

  unlockDemo(tier) {
    State.save({ paid: true, paymentTier: tier });
    UI.showToast('Demo mode: Itinerary unlocked! Configure Manifest Financial links in config.js for real payments.');
    setTimeout(() => {
      window.location.href = 'itinerary.html';
    }, 1500);
  },

  handleSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const state = State.get();
    const tier = State.getPriceTier(state.tripDays);

    State.save({ paid: true, paymentTier: tier });

    return {
      tier,
      price: State.getPrice(state.tripDays),
      tripDays: state.tripDays
    };
  }
};
