const CACHE_NAME = 'london-planner-v8';
const urlsToCache = [
  '/',
  '/index.html',
  '/wizard.html',
  '/itinerary.html',
  '/demo.html',
  '/my-trips.html',
  '/whats-on.html',
  '/quiz.html',
  '/free-guide.html',
  '/css/variables.css',
  '/css/base.css',
  '/css/components.css',
  '/css/layout.css',
  '/css/wizard.css',
  '/css/itinerary.css',
  '/css/responsive.css',
  '/js/config.js',
  '/js/state.js',
  '/js/ui.js',
  '/js/engine.js',
  '/js/wizard.js',
  '/js/itinerary-renderer.js',
  '/js/payment.js',
  '/js/chat-assistant.js',
  '/js/social-proof.js',
  '/js/exit-intent.js',
  '/js/weather.js',
  '/js/events-feed.js',
  '/js/reviews-system.js',
  '/js/env-bridge.js',
  '/js/feature-flags.js',
  '/js/trip-countdown.js',
  '/js/itinerary-share.js',
  '/js/referral.js',
  '/js/media-hub.js',
  '/js/offline-pwa.js',
  '/js/price-alerts.js',
  '/js/claude-chat.js',
  '/js/availability.js',
  '/js/ai-concierge.js',
  '/js/dynamic-regen.js',
  '/js/ar-guide.js',
  '/js/group-trip.js',
  '/js/local-experts.js',
  '/js/memory-book.js',
  '/js/multi-city.js',
  '/js/loyalty.js',
  '/js/marketing-engine.js',
  '/js/social-scheduler.js',
  '/js/sms-outreach.js',
  '/js/ai-staff-admin.js',
  '/js/affiliate-dashboard.js',
  '/js/ab-admin.js',
  '/data/attractions.json',
  '/data/restaurants.json',
  '/data/nightlife.json',
  '/data/cafes.json',
  '/data/hotels.json',
  '/data/entertainment.json',
  '/data/neighbourhoods.json',
  '/data/day-templates.json',
  '/data/promotions-content.json'
];

// Install — cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for static assets, network-first for API calls
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Network-first for API calls
  if (request.url.includes('api.') || request.url.includes('services.leadconnectorhq')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) return response;
      return fetch(request).then((fetchResponse) => {
        if (fetchResponse && fetchResponse.status === 200) {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return fetchResponse;
      });
    }).catch(() => {
      // Offline fallback
      if (request.destination === 'document') {
        return caches.match('/index.html');
      }
    })
  );
});
