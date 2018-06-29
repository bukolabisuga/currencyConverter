const staticCacheName = 'cc-v107';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/main.js',
    '/js/db.js',
    '/idb/lib/idb.js',
    '/fonts/Gilroy-Bold.woff',
    '/fonts/Gilroy-Bold.woff2',
    '/fonts/Gilroy-Light.woff',
    '/fonts/Gilroy-Light.woff2',
    '/fonts/Gilroy-Medium.woff',
    '/fonts/Gilroy-Medium.woff2'
];

self.addEventListener('install', (event) => {
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

self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then(
            (cacheNames) => {
                return Promise.all(cacheNames.map(
                    (cacheName) => {
                        if(cacheName !== staticCacheName) {
                            console.log('[ServiceWorker] Removing old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    }
                ))
            }
        )
    )
})

self.addEventListener('fetch', (event) => {
    console.log('[ServiceWorker] Fetch', event.request.url);
    event.respondWith(
        caches.match(event.request).then(
            response => {
                return response || fetch(event.request);
            }
        )
    )
})