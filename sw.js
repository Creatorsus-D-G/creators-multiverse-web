const CACHE_NAME = 'creators-mv-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './icon.png',
  './manifest.json'
];

// 1. Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// 2. Fetch (Estrategia Híbrida)
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Markdown e HTML: Network First (siempre fresco)
  if (url.endsWith('.md') || url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } 
  // CSS, JS, Iconos: Cache First (velocidad extrema)
  else {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});

// 3. Activación (Limpieza)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});