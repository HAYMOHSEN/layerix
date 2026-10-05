// Layerix Studio offline service worker — generated at build time.
const VERSION = '1.0.0-dab6c95785d1';
const CACHE = 'layerix-' + VERSION;
const FILES = ["./","./assets/index-CtB-Z6Dj.css","./assets/index-W4XBXlv0.js","./assets/pdf.worker.min-Dkey6ZUl.mjs","./assets/psd.worker-D8vQT_nL.js","./assets/psdCore-lzOVzK1e.js","./icons/apple-touch-icon.png","./icons/favicon-16.png","./icons/favicon-32.png","./icons/icon-1024.png","./icons/icon-128.png","./icons/icon-150.png","./icons/icon-16.png","./icons/icon-192.png","./icons/icon-24.png","./icons/icon-256.png","./icons/icon-310.png","./icons/icon-32.png","./icons/icon-44.png","./icons/icon-48.png","./icons/icon-512.png","./icons/icon-64.png","./icons/icon-96.png","./icons/icon-plated-512.png","./icons/icon.svg","./icons/maskable-192.png","./icons/maskable-512.png","./icons/store-logo-300.png","./index.html","./manifest.webmanifest","./pdfjs/cmaps.zip","./pdfjs/iccs/CGATS001Compat-v2-micro.icc","./pdfjs/standard_fonts.zip","./pdfjs/wasm/jbig2.wasm","./pdfjs/wasm/jbig2_nowasm_fallback.js","./pdfjs/wasm/openjpeg.wasm","./pdfjs/wasm/openjpeg_nowasm_fallback.js","./pdfjs/wasm/qcms_bg.wasm","./privacy.html"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('layerix-') && k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        // Pages we ship (the app, the privacy policy) come from the cache.
        const exact = await cache.match(req, { ignoreSearch: true });
        if (exact) return exact;
        try {
          return await fetch(req);
        } catch (err) {
          return (await cache.match('./index.html')) || (await cache.match('./')) || new Response('Offline', { status: 503 });
        }
      })(),
    );
    return;
  }
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req, { ignoreSearch: true });
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res.ok && res.type === 'basic') cache.put(req, res.clone());
        return res;
      } catch (err) {
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })(),
  );
});
