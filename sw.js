const CACHE = 'apostolic-media-v2';

const CORE = [
  './',
  './index.html',

  './manifest.json',

  './css/style.css',
  './css/themes.css',
  './css/responsive.css',

  './js/app.js',
  './js/config.js',
  './js/data.js',
  './js/ui.js',
  './js/router.js',
  './js/auth.js',
  './js/languages.js',
  './js/supabase.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});


self.addEventListener('fetch', event => {

  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(

    fetch(event.request)
      .then(response => {

        const copy = response.clone();

        caches.open(CACHE).then(cache => {
          cache.put(event.request, copy);
        });

        return response;
      })

      .catch(() => {

        return caches.match(event.request)
          .then(cachedResponse => {

            if (cachedResponse) {
              return cachedResponse;
            }

            return caches.match('./index.html');
          });

      })

  );

});
