// Atualize o nome do cache sempre que modificar arquivos
const CACHE_NAME = 'AcertosClub-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/compartilhar.png',
  '/icons/resultado.png',
  '/icons/jogar.png',
  '/icons/palpite.png',
  '/icons/LotoHack.png',
  '/icons/favicon.png',
  '/icons/favicon.ico',
  '/icons/favicon.svg',
  // Externos se necessário:
  'https://rafaeldantasl.github.io/LotoHack/palpites.js',
  'https://rafaeldantasl.github.io/LotoHack/resultados.js'
];

// Instala o service worker e adiciona os arquivos ao cache
self.addEventListener('install', event => {
  self.skipWaiting(); // ativa imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Erro ao cachear arquivos:', err))
  );
});

// Ativa o novo service worker e remove caches antigos
self.addEventListener('activate', event => {
  clients.claim(); // assume controle imediato das páginas
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Excluindo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta requisições e usa cache se disponível
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
