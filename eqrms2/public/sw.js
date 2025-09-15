// Basic service worker for PWA installation only
// No caching or offline functionality as requested

const CACHE_NAME = 'ime-rms-v1';

// Install event - just for PWA installation capability
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
});

// Fetch event - pass through to network (no caching)
self.addEventListener('fetch', (event) => {
  // Just pass through all requests to the network
  // No caching or offline functionality
  event.respondWith(fetch(event.request));
});
