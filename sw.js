const CACHE_NAME = 'myreparto-v2';
const BASE_PATH = '/myreparto';

// Risorse statiche da precaricare
const STATIC_RESOURCES = [
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

// Strategie di caching
const CACHE_STRATEGIES = {
  // Cache First per file statici
  static: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('Serving from cache:', request.url);
      return cachedResponse;
    }
    
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        console.log('Caching new resource:', request.url);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.error('Network error:', error);
      return new Response('Errore di rete', { status: 503 });
    }
  },

  // Network Only per API
  api: async (request) => {
    try {
      return await fetch(request);
    } catch (error) {
      console.error('API error:', error);
      return new Response('Errore API', { status: 503 });
    }
  },

  // Stale While Revalidate per immagini
  image: async (request) => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    // Aggiorna la cache in background
    const networkResponsePromise = fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    });

    return cachedResponse || networkResponsePromise;
  }
};

// Determina la strategia da usare in base alla richiesta
function getStrategy(request) {
  const url = new URL(request.url);
  
  // API e Firebase
  if (url.pathname.includes('/api/') || 
      url.hostname.includes('firebase') || 
      url.hostname.includes('googleapis')) {
    return CACHE_STRATEGIES.api;
  }
  
  // Immagini
  if (request.destination === 'image' || 
      url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
    return CACHE_STRATEGIES.image;
  }
  
  // Default: Cache First per file statici
  return CACHE_STRATEGIES.static;
}

// Installazione del Service Worker
self.addEventListener('install', event => {
  console.log('Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static resources...');
        return cache.addAll(STATIC_RESOURCES)
          .catch(error => {
            console.error('Error caching static resources:', error);
            return Promise.resolve();
          });
      })
  );
});

// Attivazione del Service Worker
self.addEventListener('activate', event => {
  console.log('Activating Service Worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
});

// Intercettazione delle richieste
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Ignora le richieste non GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignora le richieste a chrome-extension
  if (request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    getStrategy(request)(request)
  );
}); 