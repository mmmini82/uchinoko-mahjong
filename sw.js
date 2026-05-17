const CACHE_NAME = 'hyoen-mahjong-v36-image-tiles';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './assets/icon.svg',
  './assets/icon-192.svg',
  './assets/icon-512.svg',
  './assets/icon-512.png',
  './assets/icon-192.png',
  './assets/ui/background_pc.png',
  './assets/ui/background_mobile.png',
  './assets/tiles/dragon_chun.gif',
  './assets/tiles/dragon_haku.gif',
  './assets/tiles/dragon_hatsu.gif',
  './assets/tiles/man_1.gif',
  './assets/tiles/man_2.gif',
  './assets/tiles/man_3.gif',
  './assets/tiles/man_4.gif',
  './assets/tiles/man_5.gif',
  './assets/tiles/man_6.gif',
  './assets/tiles/man_7.gif',
  './assets/tiles/man_8.gif',
  './assets/tiles/man_9.gif',
  './assets/tiles/pin_1.gif',
  './assets/tiles/pin_2.gif',
  './assets/tiles/pin_3.gif',
  './assets/tiles/pin_4.gif',
  './assets/tiles/pin_5.gif',
  './assets/tiles/pin_6.gif',
  './assets/tiles/pin_7.gif',
  './assets/tiles/pin_8.gif',
  './assets/tiles/pin_9.gif',
  './assets/tiles/sou_1.gif',
  './assets/tiles/sou_2.gif',
  './assets/tiles/sou_3.gif',
  './assets/tiles/sou_4.gif',
  './assets/tiles/sou_5.gif',
  './assets/tiles/sou_6.gif',
  './assets/tiles/sou_7.gif',
  './assets/tiles/sou_8.gif',
  './assets/tiles/sou_9.gif',
  './assets/tiles/wind_nan.gif',
  './assets/tiles/wind_pei.gif',
  './assets/tiles/wind_sha.gif',
  './assets/tiles/wind_ton.gif',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => Promise.resolve())));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
