// Cache versioning for easy updates
const CACHE_NAME = "my-pwa-cache-v2"; // Update the version on app changes
const urlsToCache = [
  "/", // Cache the root page
  "/favicon.ico",
  "/manifest.json",
  "/offline", // Offline fallback page
  // Add additional URLs as needed
];

// Install event - cache assets and activate immediately
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app assets...");
      return cache.addAll(urlsToCache);
    })
  );

  // Immediately activate the new service worker
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating and cleaning old caches...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME) // Remove outdated caches
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );

  // Claim all clients (force control of all pages)
  self.clients.claim();
});

// Fetch event - serve from cache first, then network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          return caches.match("/offline"); // Serve fallback if offline
        })
      );
    })
  );
});

// Optional: Listen for skipWaiting message to trigger updates immediately
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    console.log("[Service Worker] Skip waiting triggered...");
    self.skipWaiting();
  }
});
