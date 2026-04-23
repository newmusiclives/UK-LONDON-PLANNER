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

    // Pull saved contact info from State (set by itinerary-renderer when the
    // page loaded via ?token=) so we can prefill the GHL checkout form. Keeps
    // the buyer on the same contact as the wizard submission by email match.
    const state = State.get();
    const email = (contactInfo && contactInfo.email) || state.email || '';
    const firstName = (contactInfo && contactInfo.firstName) ||
                      (contactInfo && contactInfo.name) ||
                      state.firstName || '';
    const urlToken = new URLSearchParams(window.location.search).get('token');

    // Send to GoHighLevel CRM tracking (best-effort, don't block redirect)
    if (contactInfo || email) {
      GHL.trackItineraryPurchase({
        email,
        name: firstName,
        phone: (contactInfo && contactInfo.phone) || '',
        tier,
        days,
        price: this.getPrice(days),
        sessionId,
        itineraryToken: urlToken || null
      });
    }

    if (link && !link.includes('YOUR_')) {
      // GHL hosted payment links (links.lightworkdigital.com / *.msgsndr.com)
      // accept ?email, ?first_name, ?last_name for prefill. Append if we have
      // them. client_reference_id is a Stripe-native param and is ignored by
      // GHL payment pages — omitted.
      const params = new URLSearchParams();
      if (email) params.set('email', email);
      if (firstName) params.set('first_name', firstName);
      const qs = params.toString();
      const separator = link.includes('?') ? '&' : '?';
      window.location.href = qs ? `${link}${separator}${qs}` : link;
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
