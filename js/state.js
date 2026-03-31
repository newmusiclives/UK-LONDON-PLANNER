const State = {
  STORAGE_KEY: 'londonPlanner',
  ITINERARY_KEY: 'londonPlannerItinerary',

  _defaults: {
    tripDays: 5,
    budget: {
      accommodation: 'mid-range',
      food: 'mid-range',
      entertainment: 'mid-range'
    },
    interests: [],
    generatedAt: null,
    paid: false,
    paymentTier: null,
    sessionId: null
  },

  get() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...this._defaults, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to read state:', e);
    }
    return { ...this._defaults };
  },

  save(data) {
    try {
      const current = this.get();
      const merged = { ...current, ...data };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
      return merged;
    } catch (e) {
      console.warn('Failed to save state:', e);
      return data;
    }
  },

  getItinerary() {
    try {
      const stored = localStorage.getItem(this.ITINERARY_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('Failed to read itinerary:', e);
      return null;
    }
  },

  saveItinerary(itinerary) {
    try {
      localStorage.setItem(this.ITINERARY_KEY, JSON.stringify(itinerary));
    } catch (e) {
      console.warn('Failed to save itinerary:', e);
    }
  },

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.ITINERARY_KEY);
  },

  getSessionId() {
    let state = this.get();
    if (!state.sessionId) {
      state.sessionId = 'lp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      this.save(state);
    }
    return state.sessionId;
  },

  isPaid() {
    return this.get().paid === true;
  },

  getPriceTier(days) {
    if (days <= 5) return 'tier1';
    if (days <= 10) return 'tier2';
    return 'tier3';
  },

  getPrice(days) {
    const tier = this.getPriceTier(days);
    return CONFIG.pricing[tier].price;
  }
};
