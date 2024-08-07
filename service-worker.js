self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('trade-tracker-cache').then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './app.js',
                './manifest.json',
                './styles.css',
                './icon.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
