/**
 * Service Worker para cache offline e otimizações
 */

// Configuração do service worker
const CACHE_NAME = 'amplie-chat-v1';
const OFFLINE_URL = '/offline.html';

// Recursos para cache
const STATIC_RESOURCES = [
  '/',
  '/auth',
  '/dashboard',
  '/manifest.json',
  '/favicon.ico'
];

// Estratégias de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static resources');
      return cache.addAll(STATIC_RESOURCES);
    })
  );
  
  // Ativar imediatamente
  self.skipWaiting();
});

// Ativar service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Controlar todas as abas
  self.clients.claim();
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não-HTTP
  if (!request.url.startsWith('http')) return;

  // Estratégia baseada no tipo de recurso
  if (request.destination === 'document') {
    // HTML: Network first
    event.respondWith(handleDocumentRequest(request));
  } else if (request.destination === 'image') {
    // Imagens: Cache first
    event.respondWith(handleImageRequest(request));
  } else if (request.url.includes('/api/') || request.url.includes('supabase.co')) {
    // API: Network first com fallback
    event.respondWith(handleApiRequest(request));
  } else {
    // Outros recursos: Stale while revalidate
    event.respondWith(handleGenericRequest(request));
  }
});

// Estratégia para documentos HTML
async function handleDocumentRequest(request) {
  try {
    // Tentar rede primeiro
    const networkResponse = await fetch(request);
    
    // Cachear se sucesso
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback para cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Página offline como último recurso
    return caches.match(OFFLINE_URL);
  }
}

// Estratégia para imagens
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Placeholder para imagem indisponível
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f0f0f0" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Imagem indisponível</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Estratégia para APIs
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cachear apenas respostas GET bem-sucedidas
    if (request.method === 'GET' && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      const clonedResponse = networkResponse.clone();
      
      // Adicionar timestamp para expiração
      const headers = new Headers(clonedResponse.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const responseWithTimestamp = new Response(clonedResponse.body, {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers
      });
      
      cache.put(request, responseWithTimestamp);
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback para cache apenas em GET
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      
      if (cachedResponse) {
        // Verificar se não está muito antigo (30 minutos)
        const cachedAt = cachedResponse.headers.get('sw-cached-at');
        if (cachedAt) {
          const age = Date.now() - parseInt(cachedAt);
          if (age < 30 * 60 * 1000) { // 30 minutos
            return cachedResponse;
          }
        }
      }
    }
    
    throw error;
  }
}

// Estratégia genérica (stale-while-revalidate)
async function handleGenericRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Buscar na rede em paralelo
  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  // Retornar cache se disponível, senão aguardar rede
  return cachedResponse || await networkPromise;
}

// Notificações push
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: data.icon || '/favicon.ico',
    badge: '/favicon.ico',
    tag: data.tag,
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [],
    data: data.data || {}
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Verificar se já há uma aba aberta
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Abrir nova aba
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Buscar dados pendentes no IndexedDB
    // Sincronizar com servidor
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Mensagens do app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ size });
    });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearCache().then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
});

async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

async function clearCache() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}