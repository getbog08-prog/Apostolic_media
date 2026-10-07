const CACHE = "apostolic-media-v2";

const CORE = [
  "./",
  "./index.html",
  "./manifest.json",

  "./css/style.css",
  "./css/themes.css",
  "./css/responsive.css",

  "./js/app.js",
  "./js/config.js",
  "./js/data.js",
  "./js/ui.js",
  "./js/router.js",
  "./js/auth.js",
  "./js/languages.js",
  "./js/supabase.js"
];


/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener("install", (event) => {

  event.waitUntil(

    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())

  );

});


/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener("activate", (event) => {

  event.waitUntil(

    caches.keys()
      .then((keys) => {

        return Promise.all(

          keys
            .filter((key) => key !== CACHE)
            .map((key) => caches.delete(key))

        );

      })
      .then(() => self.clients.claim())

  );

});


/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(

    caches.match(event.request)
      .then((cachedResponse) => {

        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {

            if (
              !networkResponse ||
              networkResponse.status !== 200 ||
              networkResponse.type === "opaque"
            ) {
              return networkResponse;
            }

            const responseClone =
              networkResponse.clone();

            caches.open(CACHE)
              .then((cache) => {
                cache.put(
                  event.request,
                  responseClone
                );
              });

            return networkResponse;

          })
          .catch(() => {

            return caches.match("./index.html");

          });

      })

  );

});
