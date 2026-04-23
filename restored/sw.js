const CACHE_NAME = 'kine-app-v3'; // Versión actualizada para arquitectura modular
const ASSETS = [
  './',
  './index.html',
  './css/main.css',
  './css/variables.css',
  './css/base.css',
  './css/layout.css',
  './css/auth.css',
  './css/components.css',
  './css/dashboard.css',
  './css/utilities.css',
  './css/print.css',
  './js/app.js',
  './manifest.json'
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
