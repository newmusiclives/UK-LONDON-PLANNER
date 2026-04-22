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

    // Prefer the itinerary token (= GHL contact id) if present in the URL —
    // the Stripe → GHL webhook will pass it through as client_reference_id,
    // letting the purchase-delivery workflow identify the exact contact.
    const urlToken = new URLSearchParams(window.location.search).get('token');
    const clientRef = urlToken || sessionId;

    // Send to GoHighLevel CRM
    if (contactInfo) {
      GHL.trackItineraryPurchase({
        email: contactInfo.email,
        name: contactInfo.name,
        phone: contactInfo.phone || '',
        tier,
        days,
        price: this.getPrice(days),
        sessionId,
        itineraryToken: urlToken || null
      });
    }

    if (link && !link.includes('YOUR_')) {
      const separator = link.includes('?') ? '&' : '?';
      window.location.href = `${link}${separator}client_reference_id=${clientRef}`;
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
