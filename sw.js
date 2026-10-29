/* Contact — Service Worker (offline support) */
const V = 'contact-v2.0.0';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  // Only handle our own files and the Firebase SDK scripts; never touch Firestore/Auth API calls.
  if (!(u.origin === location.origin || u.hostname === 'www.gstatic.com')) return;

  // Page loads: network first (so updates arrive), fall back to cache when offline.
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r)
        .then(res => { const cp = res.clone(); caches.open(V).then(c => c.put('index.html', cp)); return res; })
        .catch(() => caches.match('index.html'))
    );
    return;
  }

  // Everything else: cache first, refresh in background.
  e.respondWith(
    caches.match(r).then(hit => {
      const net = fetch(r).then(res => {
        if (res && (res.status === 200 || res.type === 'opaque')) {
          const cp = res.clone();
          caches.open(V).then(c => c.put(r, cp));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
