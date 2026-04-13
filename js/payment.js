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

  initiatePurchase(days, contactInfo) {
    const tier = this.getTier(days);
    const link = this.getStripeLink(tier);
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

  unlockDemo(tier) {
    State.save({ paid: true, paymentTier: tier });
    UI.showToast('Demo mode: Itinerary unlocked! Configure Stripe Payment Links in config.js for real payments.');
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
