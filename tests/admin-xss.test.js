#!/usr/bin/env node
/**
 * Uji regresi XSS dasbor admin (admin.html).
 *
 * Menjalankan admin.html di Chromium headless dengan Supabase di-stub (tidak ada
 * jaringan, tidak menyentuh database nyata). Data konsultasi berisi payload XSS
 * di setiap kolom teks yang dirender. Lulus bila:
 *   1. tidak ada payload yang tereksekusi (window.__pwned tetap kosong),
 *   2. payload tampil sebagai TEKS literal, bukan elemen,
 *   3. isi textarea jawaban sama persis dengan data asli (termasuk "</textarea>").
 *
 * Pakai:  node tests/admin-xss.test.js      (butuh modul "playwright")
 * Exit 0 = lulus, 1 = gagal.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const PAYLOAD = '<img src=x onerror="window.__pwned=(window.__pwned||0)+1">';
const TEXTAREA_BREAKOUT = "</textarea>" + PAYLOAD;

const ROWS = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    created_at: "2026-01-01T00:00:00Z",
    nama_pasien: PAYLOAD,
    no_hp_pasien: PAYLOAD,
    keluhan_utama: PAYLOAD,
    durasi_keluhan: PAYLOAD,
    gejala_penyerta: PAYLOAD,
    kondisi_khusus: { hamil: true },
    is_red_flag: true,
    red_flag_reason: PAYLOAD,
    kategori: "umum",
    status: "baru",
    jawaban: TEXTAREA_BREAKOUT,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    created_at: "2026-01-02T00:00:00Z",
    nama_pasien: "Tom & Jerry's",
    no_hp_pasien: "08123456789",
    keluhan_utama: "Nyeri \"hebat\" <2 hari & mual",
    durasi_keluhan: null,
    gejala_penyerta: null,
    kondisi_khusus: {},
    is_red_flag: false,
    red_flag_reason: null,
    kategori: "proktologi_bedah",
    status: "direview_apoteker",
    jawaban: null,
  },
];

const STUB_SUPABASE = `
const ROWS = ${JSON.stringify(ROWS)};
export const createClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: { user: {} } } }),
    onAuthStateChange: () => ({ data: { subscription: {} } }),
    signOut: async () => ({}),
    signInWithPassword: async () => ({}),
  },
  from: () => ({
    select: () => ({ order: async () => ({ data: ROWS, error: null }) }),
    update: () => ({ eq: async () => ({ error: null }) }),
  }),
});
`;

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); return res.end("not found");
  }
  const type = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" }[path.extname(file)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.route("**/*", (route) => {
    const url = route.request().url();
    if (url.startsWith(base + "/assets/config.js")) {
      return route.fulfill({ contentType: "text/javascript", body: 'window.__DELIMA_KONSULTASI_CONFIG__={SUPABASE_URL:"https://example.invalid",SUPABASE_ANON_KEY:"test"};' });
    }
    if (url.startsWith("https://esm.sh/")) {
      return route.fulfill({ contentType: "text/javascript", body: STUB_SUPABASE });
    }
    if (url.startsWith(base)) return route.continue();
    return route.abort();
  });

  const dialogs = [];
  page.on("dialog", (d) => { dialogs.push(d.message()); d.dismiss(); });

  await page.goto(base + "/admin.html");
  await page.waitForSelector(".consult-row", { timeout: 5000 });
  await page.waitForFunction(() => document.querySelectorAll(".consult-row").length === 2);
  await page.waitForTimeout(300); // beri waktu onerror (bila ada) untuk jalan

  const result = await page.evaluate((payload) => {
    const row = document.querySelector(".consult-row");
    const keluhan = [...row.querySelectorAll("p.keluhan")].map((p) => p.textContent).join("|");
    return {
      pwned: window.__pwned || 0,
      injectedImgs: row.querySelectorAll("img").length,
      literalShown: keluhan.includes(payload),
      textareaValue: row.querySelector('[data-role="jawaban"]').value,
      textareaCount: row.querySelectorAll("textarea").length,
      benign: (() => {
        const r2 = document.querySelectorAll(".consult-row")[1];
        const ps = [...r2.querySelectorAll("p.keluhan")].map((p) => p.textContent);
        return ps[0] === "Tom & Jerry's — 08123456789" && ps[1] === 'Nyeri "hebat" <2 hari & mual'
          && r2.querySelector('[data-role="jawaban"]').value === "";
      })(),
    };
  }, PAYLOAD);

  await browser.close();
  server.close();

  const checks = [
    ["payload tidak tereksekusi", result.pwned === 0 && dialogs.length === 0],
    ["tidak ada elemen <img> hasil injeksi", result.injectedImgs === 0],
    ["payload tampil sebagai teks literal", result.literalShown],
    ["data wajar dengan karakter khusus tampil apa adanya", result.benign],
    ["textarea jawaban utuh (tidak bisa ditutup paksa)", result.textareaCount === 1 && result.textareaValue === TEXTAREA_BREAKOUT],
  ];
  let failed = 0;
  for (const [name, ok] of checks) { console.log((ok ? "PASS " : "FAIL ") + name); if (!ok) failed++; }
  console.log(failed ? `\nGAGAL: ${failed} pemeriksaan (payload tereksekusi: ${result.pwned}x)` : "\nLULUS: dasbor admin aman dari XSS tersimpan pada kolom yang diuji.");
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e); try { server.close(); } catch (_) {} process.exit(1); });
