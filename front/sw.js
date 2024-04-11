const CACHE_NAME = 'cep-app-v3';
const urlsToCache = [
  '/',
  // styles
  '/css/materialize.css',
  '/css/materialize.min.css',
  '/css/style.css',
  // js
  '/js/init.js',
  '/js/materialize.js',
  '/js/materialize.min.js',
  '/js/script.js',
  //images
  '/cep.png'
];

self.addEventListener('install', function(event) {
  // Instalar o Service Worker
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Responder a solicitações de rede
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Se o recurso estiver em cache, retorná-lo
        if (response) {
          return response;
        }
        // Caso contrário, solicitar o recurso da rede
        return fetch(event.request);
      })
  );
});