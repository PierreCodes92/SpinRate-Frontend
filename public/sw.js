// Service Worker for RevWheel - Video Caching
const CACHE_NAME = 'revwheel-video-cache-v1';
const VIDEO_CACHE_NAME = 'revwheel-video-cache-v1';

// URLs to cache with long TTL (local video)
const VIDEO_URLS = [
  '/video/VideoRevwheel.mp4'
];

// Cache duration: 30 days for videos
const VIDEO_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000;

// Install event - pre-cache videos
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(VIDEO_CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching video files...');
      // Don't fail installation if video caching fails
      return Promise.allSettled(
        VIDEO_URLS.map(url => 
          cache.add(url).catch(err => {
            console.log('[SW] Failed to cache video:', url, err);
          })
        )
      );
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== VIDEO_CACHE_NAME && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Only handle video requests
  if (url.includes('.mp4') || url.includes('VideoRevwheel')) {
    event.respondWith(
      caches.open(VIDEO_CACHE_NAME).then(async (cache) => {
        // Try cache first
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          // Check if cache is still valid (within 30 days)
          const cachedDate = cachedResponse.headers.get('sw-cached-date');
          if (cachedDate) {
            const cacheAge = Date.now() - new Date(cachedDate).getTime();
            if (cacheAge < VIDEO_CACHE_DURATION) {
              console.log('[SW] Serving video from cache:', url);
              return cachedResponse;
            }
          } else {
            // If no date header, serve from cache anyway
            console.log('[SW] Serving video from cache (no date):', url);
            return cachedResponse;
          }
        }
        
        // Fetch from network and cache
        console.log('[SW] Fetching video from network:', url);
        try {
          const networkResponse = await fetch(event.request);
          
          if (networkResponse.ok) {
            // Clone response to add custom header and cache
            const responseToCache = networkResponse.clone();
            const headers = new Headers(responseToCache.headers);
            headers.set('sw-cached-date', new Date().toISOString());
            
            const body = await responseToCache.blob();
            const modifiedResponse = new Response(body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: headers
            });
            
            cache.put(event.request, modifiedResponse.clone());
            console.log('[SW] Video cached successfully:', url);
          }
          
          return networkResponse;
        } catch (error) {
          console.log('[SW] Network fetch failed, serving stale cache:', url);
          // Return stale cache if network fails
          if (cachedResponse) {
            return cachedResponse;
          }
          throw error;
        }
      })
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_VIDEO') {
    const videoUrl = event.data.url;
    caches.open(VIDEO_CACHE_NAME).then((cache) => {
      cache.add(videoUrl).then(() => {
        console.log('[SW] Video cached on demand:', videoUrl);
      });
    });
  }
});

