// Service Worker Registration Utility

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.log('[SW] Service workers are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('[SW] Service worker registered successfully:', registration.scope);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New service worker installed, ready to update');
            // Auto-activate new service worker
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[SW] Service worker registration failed:', error);
    return null;
  }
};

// Pre-cache a specific video URL
export const preCacheVideo = async (videoUrl: string): Promise<void> => {
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
    return;
  }

  navigator.serviceWorker.controller.postMessage({
    type: 'CACHE_VIDEO',
    url: videoUrl
  });
};

// Check if video is cached
export const isVideoCached = async (videoUrl: string): Promise<boolean> => {
  if (!('caches' in window)) {
    return false;
  }

  try {
    const cache = await caches.open('revwheel-video-cache-v1');
    const response = await cache.match(videoUrl);
    return !!response;
  } catch {
    return false;
  }
};

// Get cache size
export const getCacheSize = async (): Promise<number> => {
  if (!('caches' in window)) {
    return 0;
  }

  try {
    const cache = await caches.open('revwheel-video-cache-v1');
    const keys = await cache.keys();
    let totalSize = 0;

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.clone().blob();
        totalSize += blob.size;
      }
    }

    return totalSize;
  } catch {
    return 0;
  }
};

// Clear video cache
export const clearVideoCache = async (): Promise<void> => {
  if (!('caches' in window)) {
    return;
  }

  try {
    await caches.delete('revwheel-video-cache-v1');
    console.log('[SW] Video cache cleared');
  } catch (error) {
    console.error('[SW] Failed to clear video cache:', error);
  }
};

