// Service worker — cache konten statis/informasional (shell halaman, kontak,
// info rujukan IGD) supaya tetap bisa dibaca offline. Data dinamis
// (kirim konsultasi, cek status, dashboard admin) tetap butuh koneksi karena
// bergantung pada Supabase — itu ditangani lewat pesan "kamu sedang offline"
// di masing-masing halaman, bukan lewat cache.

// v2: config.js dipindah dari cache-first ke network-first (lihat di bawah) —
// versi v1 sempat menyimpan config.js kosong secara permanen di cache,
// membuat halaman terus bilang "belum terhubung ke database" walau server
// sudah diupdate. Bump versi supaya browser yang sudah sempat cache v1
// otomatis dapat cache baru.
const CACHE_VERSION = "delima-konsultasi-v2";
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

  // Network-first untuk halaman HTML + config.js supaya konten selalu
  // terbaru saat online (fallback ke cache saat offline). config.js sengaja
  // TIDAK cache-first — isinya (URL/key Supabase) bisa berubah sewaktu-waktu
  // dan halaman tidak boleh terus memakai versi lama tanpa sadar.
  const isConfigJs = url.pathname === "/assets/config.js";
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html") || isConfigJs) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || (isConfigJs ? undefined : caches.match("/index.html")))
        )
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
