const CACHE_NAME = 'kine-app-v2'; // Incrementado para forzar actualización
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@600;700&family=JetBrains+Mono&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js'
];

// Instalación: Guardar archivos en caché
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forzar a que el nuevo SW tome el control
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache actualizado a ' + CACHE_NAME);
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
            console.log('Borrando caché antiguo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Tomar control de las pestañas abiertas inmediatamente
  );
});

// Estrategia: Network First (Internet primero, si falla usa el caché)
// Esto asegura que el usuario siempre vea la última versión si tiene conexión
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la red responde, clonamos y guardamos en el caché
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, resClone);
        });
        return response;
      })
      .catch(() => {
        // Si falla el internet (offline), buscamos en el caché
        return caches.match(event.request);
      })
  );
});
