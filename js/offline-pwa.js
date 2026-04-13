// ============================================================
// OFFLINE PWA MODE
// Service worker registration, install prompt, offline indicator
// ============================================================
const OfflinePWA = {
  _deferredPrompt: null,

  init() {
    if (typeof FeatureFlags !== 'undefined' && !FeatureFlags.isEnabled('offline-pwa')) return;

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('[PWA] Service worker registered, scope:', reg.scope);
      }).catch(err => {
        console.warn('[PWA] Service worker registration failed:', err);
      });
    }

    // Capture install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this._deferredPrompt = e;
      this._showInstallBanner();
    });

    // Online/offline indicator
    window.addEventListener('online', () => this._updateStatus(true));
    window.addEventListener('offline', () => this._updateStatus(false));
  },

  _showInstallBanner() {
    if (sessionStorage.getItem('pwaInstallDismissed')) return;

    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.style.cssText = 'position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);background:var(--color-primary,#1B2A4A);color:white;padding:0.75rem 1.25rem;border-radius:12px;display:flex;align-items:center;gap:1rem;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.3);max-width:90vw;font-size:0.9rem;';
    banner.innerHTML = `
      <span>📱 Install London Planned for offline access</span>
      <button id="pwa-install-btn" style="background:var(--color-accent,#C9A84C);color:var(--color-primary,#1B2A4A);border:none;padding:0.5rem 1rem;border-radius:8px;font-weight:700;cursor:pointer;white-space:nowrap;">Install</button>
      <button id="pwa-dismiss-btn" style="background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;font-size:1.2rem;padding:0 0.25rem;">&times;</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('pwa-install-btn').addEventListener('click', () => {
      if (this._deferredPrompt) {
        this._deferredPrompt.prompt();
        this._deferredPrompt.userChoice.then(choice => {
          if (choice.outcome === 'accepted') {
            console.log('[PWA] User accepted install');
          }
          this._deferredPrompt = null;
          banner.remove();
        });
      }
    });

    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
      banner.remove();
      sessionStorage.setItem('pwaInstallDismissed', 'true');
    });
  },

  _updateStatus(online) {
    let indicator = document.getElementById('pwa-status');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'pwa-status';
      indicator.style.cssText = 'position:fixed;top:0;left:0;right:0;text-align:center;padding:0.35rem;font-size:0.8rem;font-weight:600;z-index:10000;transition:transform 0.3s;';
      document.body.appendChild(indicator);
    }

    if (online) {
      indicator.textContent = 'Back online';
      indicator.style.background = '#2ECC71';
      indicator.style.color = 'white';
      indicator.style.transform = 'translateY(0)';
      setTimeout(() => { indicator.style.transform = 'translateY(-100%)'; }, 3000);
    } else {
      indicator.textContent = 'You are offline — saved itineraries still available';
      indicator.style.background = '#F39C12';
      indicator.style.color = 'white';
      indicator.style.transform = 'translateY(0)';
    }
  },

  // Save itinerary for offline access
  saveForOffline(itinerary) {
    if (!itinerary) return;
    try {
      const saved = JSON.parse(localStorage.getItem('offlineItineraries') || '[]');
      const existing = saved.findIndex(s => s.id === itinerary.id);
      if (existing >= 0) saved[existing] = itinerary;
      else saved.push(itinerary);
      localStorage.setItem('offlineItineraries', JSON.stringify(saved));
    } catch (e) {
      console.warn('[PWA] Failed to save for offline:', e);
    }
  },

  // Retrieve offline itineraries
  getOfflineItineraries() {
    try {
      return JSON.parse(localStorage.getItem('offlineItineraries') || '[]');
    } catch (e) {
      return [];
    }
  }
};

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  if (typeof OfflinePWA !== 'undefined') OfflinePWA.init();
});
