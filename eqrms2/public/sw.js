// Service worker for IME RMS PWA
// Ensures proper standalone mode behavior

const CACHE_NAME = 'ime-rms-pwa-v1';

// Install event - register for PWA installation
self.addEventListener('install', (event) => {
  console.log('IME RMS Service Worker: Installing');
  self.skipWaiting();
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
  console.log('IME RMS Service Worker: Activating');
  event.waitUntil(
    self.clients.claim().then(() => {
      // Notify all clients that SW is ready
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SW_READY' });
        });
      });
    })
  );
});

// Fetch event - pass through to network (no caching for now)
self.addEventListener('fetch', (event) => {
  // Ensure all requests go to network for fresh data
  event.respondWith(fetch(event.request));
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
