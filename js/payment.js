const Payment = {
  getTier(days) {
    return State.getPriceTier(days);
  },

  getPrice(days) {
    return State.getPrice(days);
  },

  getStripeLink(tier) {
    return CONFIG.stripe.links[tier] || null;
  },

  initiatePurchase(days) {
    const tier = this.getTier(days);
    const link = this.getStripeLink(tier);
    const sessionId = State.getSessionId();

    if (link && !link.includes('YOUR_')) {
      // Redirect to Stripe Payment Link
      const separator = link.includes('?') ? '&' : '?';
      window.location.href = `${link}${separator}client_reference_id=${sessionId}`;
    } else {
      // Demo mode
      this.unlockDemo(tier);
    }
  },

  initiateConsultation() {
    const link = CONFIG.stripe.links.consultation;
    const sessionId = State.getSessionId();

    if (link && !link.includes('YOUR_')) {
      const separator = link.includes('?') ? '&' : '?';
      window.location.href = `${link}${separator}client_reference_id=${sessionId}`;
    } else {
      // Demo mode
      UI.showToast('Demo mode: In production, this would redirect to Stripe for $75 payment');
    }
  },

  unlockDemo(tier) {
    State.save({ paid: true, paymentTier: tier });
    UI.showToast('Demo mode: Itinerary unlocked! Configure Stripe links in config.js for real payments.');
    setTimeout(() => {
      window.location.href = 'itinerary.html';
    }, 1500);
  },

  handleSuccess() {
    // Called on success.html
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
