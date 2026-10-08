/* =========================================================
   Apostolic Media Service Worker
   Network-first for app files so GitHub Pages updates appear
   without serving stale JS/CSS/HTML.
   ========================================================= */

const CACHE = "apostolic-media-v21";

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

const APP_FILE_EXTENSIONS = [
  ".html",
  ".js",
  ".css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const request = event.request;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    const isAppFile = APP_FILE_EXTENSIONS.some((extension) =>
      url.pathname.endsWith(extension)
    );

    if (isAppFile || url.pathname.endsWith("/")) {
      event.respondWith(
        fetch(request, { cache: "no-store" })
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() =>
            caches.match(request).then(
              (cachedResponse) =>
                cachedResponse || caches.match("./index.html")
            )
          )
      );
      return;
    }
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              networkResponse.type !== "opaque"
            ) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }

            return networkResponse;
          })
          .catch(() => caches.match("./index.html"));
      })
  );
});
