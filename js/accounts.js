// ============================================================
// USER ACCOUNTS — Magic Link Auth via GoHighLevel
// ============================================================
const Accounts = {
  STORAGE_KEY: 'londonplannedUser',

  isLoggedIn() {
    return !!this.getUser();
  },

  getUser() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY)); } catch { return null; }
  },

  async requestMagicLink(email) {
    // Send magic link request to GoHighLevel
    const result = await GHL.sendToWebhook('emailCapture', {
      type: 'magic_link_request',
      email,
      returnUrl: window.location.origin + '/account.html',
      tags: ['london-planned', 'user-account']
    });

    // Store email for verification
    localStorage.setItem('pending_auth_email', email);
    return result;
  },

  login(email, name) {
    const user = {
      email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
      itineraries: this.getUser()?.itineraries || []
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
  },

  saveItinerary(itinerary) {
    const user = this.getUser();
    if (!user) return false;
    const saved = {
      id: 'itin_' + Date.now(),
      name: `${itinerary.tripDays}-Day ${itinerary.ukExtension?.enabled ? 'London + UK' : 'London'} Trip`,
      createdAt: new Date().toISOString(),
      tripDays: itinerary.tripDays,
      interests: itinerary.interests,
      data: itinerary
    };
    user.itineraries = user.itineraries || [];
    user.itineraries.push(saved);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    return saved;
  },

  getSavedItineraries() {
    const user = this.getUser();
    return user?.itineraries || [];
  },

  renderAuthButton() {
    const user = this.getUser();
    if (user) {
      return `<span style="font-size:0.8rem;color:rgba(255,255,255,0.7);">Hi, ${user.name}</span>`;
    }
    return '';
  }
};

// Check for magic link return
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const authEmail = params.get('auth_email');
  const authToken = params.get('auth_token');
  if (authEmail && authToken) {
    Accounts.login(authEmail);
    UI.showToast('Welcome back!');
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  }
});
