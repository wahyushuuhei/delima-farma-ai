// Service worker — cache konten statis/informasional (shell halaman, kontak,
// info rujukan IGD) supaya tetap bisa dibaca offline. Data dinamis
// (kirim konsultasi, cek status, dashboard admin) tetap butuh koneksi karena
// bergantung pada Supabase — itu ditangani lewat pesan "kamu sedang offline"
// di masing-masing halaman, bukan lewat cache.

const CACHE_VERSION = "delima-konsultasi-v1";
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/status.html",
  "/manifest.json",
  "/assets/style.css",
  "/assets/icon.svg",
  "/assets/config.js",
  "/assets/supabase-client.js",
  "/assets/red-flag.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Jangan campur tangan request ke domain lain (Supabase API, CDN esm.sh) —
  // itu memang harus network-only, gagal alami kalau offline.
  if (url.origin !== self.location.origin) return;
  if (req.method !== "GET") return;

  // Network-first untuk halaman HTML supaya konten selalu terbaru saat
  // online, fallback ke cache saat offline.
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("/index.html")))
    );
    return;
  }

  // Cache-first untuk asset statis (css/svg/js lokal).
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => cached);
    })
  );
});
