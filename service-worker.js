// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(registration => {
        console.log('Service worker registration succeeded:', registration);
    }).catch(error => {
        console.log('Service worker registration failed:', error);
    });
} else {
    console.log('Service workers are not supported.');
}

const staticCacheName = 'currency-static-v101';

let allCaches = [
    staticCacheName
];

const urlsToCache = [
    './',
    './index.html',
    './css/style.css',
    './js/main.js',
    './js/db.js',
    './idb/lib/idb.js',
    './fonts/Gilroy-Bold.woff',
    './fonts/Gilroy-Bold.woff2',
    './fonts/Gilroy-Light.woff',
    './fonts/Gilroy-Light.woff2'
];

self.addEventListener('install', event => {
    console.log('[ServiceWorker] install');
    event.waitUntil(
        caches.open(staticCacheName)

            .then(
                (cache) => {
                    console.log('[ServiceWorker] Caching app shell');
                    return cache.addAll(urlsToCache);
                }
            )
    )
});

self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    console.log('[ServiceWorker] Removing old cache', cacheName);
                    return cacheName.startsWith('currency-') &&
                        !allCaches.includes(cacheName);
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
})

self.addEventListener("fetch", event => {
    // offline-first
    event.respondWith(
        caches.match(event.request.url).then(cacheResponse => {
        return cacheResponse || fetch(event.request);
      })
    );
  });