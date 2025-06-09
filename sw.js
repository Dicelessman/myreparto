const CACHE_NAME = 'myreparto-v1';
const BASE_PATH = '/myreparto';

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/register.html`,
  `${BASE_PATH}/css/output.css`,
  `${BASE_PATH}/js/app.js`,
  `${BASE_PATH}/js/config/firebase.js`,
  `${BASE_PATH}/js/utils/ui.js`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icons/icon-192x192.png`,
  `${BASE_PATH}/icons/icon-512x512.png`
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta:', CACHE_NAME);
        return cache.addAll(urlsToCache)
          .catch(error => {
            console.error('Errore durante la cache:', error);
            // Continua anche se alcune risorse non possono essere memorizzate
            return Promise.resolve();
          });
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Non memorizzare nella cache le richieste a Firebase
            if (event.request.url.includes('firebase') || 
                event.request.url.includes('googleapis')) {
              return response;
            }
            
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.error('Errore durante la memorizzazione nella cache:', error);
              });
              
            return response;
          })
          .catch(error => {
            console.error('Errore durante il fetch:', error);
            return new Response('Errore di rete', { status: 503 });
          });
      })
  );
}); 