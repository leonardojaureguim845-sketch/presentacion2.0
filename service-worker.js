const CACHE_NAME = "leo-presentacion-pwa-v6";
const APP_SHELL = [
  "./",
  "./index.html",
  "./mobile.html",
  "./estilos.css",
  "./script.js",
  "./lazy-loader.js",
  "./components/section-components.js",
  "./pwa.js",
  "./manifest.json",
  "./mobile-manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.startsWith("leo-presentacion-pwa-") && key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (request.mode === "navigate") {
      event.respondWith(
        fetch(request).then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return response;
        }).catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const path = url.pathname.endsWith("/mobile.html") ? "./mobile.html" : "./index.html";
          return caches.match(path);
        })
      );
      return;
    }
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }))
    );
    return;
  }

  // Cache-first para recursos CDN e imágenes externas; la red se usa si aún no están guardados.
  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok || response.type === "opaque") cache.put(request, response.clone());
        return response;
      } catch {
        return cached || Response.error();
      }
    })
  );
});
