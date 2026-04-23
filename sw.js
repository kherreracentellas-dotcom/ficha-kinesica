const CACHE_NAME = 'kine-app-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600;700&family=JetBrains+Mono&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

// Instalación: Guardar archivos en caché
// Almacena los recursos críticos para que la app cargue sin internet
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache abierto');
      return cache.addAll(ASSETS);
    })
  );
});

// Activación: Limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Estrategia: Cache First, falling back to Network
// Esto permite que la app cargue instantáneamente
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
