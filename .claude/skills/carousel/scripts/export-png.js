#!/usr/bin/env node
/**
 * Ekspor carousel HTML -> PNG 1080x1350, satu berkas per elemen `.slide`.
 *
 * Pemakaian:  node export-png.js <carousel.html> [folder-keluaran=out] [--check-only]
 *
 * Keamanan & kualitas:
 *  - Hanya membuka berkas lokal (file://). Semua permintaan jaringan diblokir,
 *    sehingga tidak ada data yang bocor dan tidak ada font/CDN yang diam-diam dipakai.
 *  - Gagal (exit 2) bila ada elemen yang keluar dari batas slide (teks terpotong).
 *  - Gagal (exit 3) bila masih ada placeholder [DALAM KURUNG SIKU] di teks slide.
 *  - Menunggu document.fonts.ready sebelum memotret.
 */
const fs = require('fs');
const path = require('path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (e) {
  console.error('Modul "playwright" tidak ditemukan. Instal dulu (npm i -D playwright) atau jalankan di lingkungan yang menyediakannya.');
  process.exit(1);
}

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const checkOnly = process.argv.includes('--check-only');
const [input, outDir = 'out'] = args;

if (!input) {
  console.error('Pemakaian: node export-png.js <carousel.html> [folder-keluaran] [--check-only]');
  process.exit(1);
}
const inputPath = path.resolve(input);
if (!fs.existsSync(inputPath)) {
  console.error(`Berkas tidak ditemukan: ${inputPath}`);
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });

  const blocked = [];
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith('file:') || url.startsWith('data:') || url.startsWith('about:')) return route.continue();
    blocked.push(url);
    return route.abort();
  });

  await page.goto('file://' + inputPath);
  await page.evaluate(() => document.fonts.ready);

  const report = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.slide').forEach((slide, i) => {
      const box = slide.getBoundingClientRect();
      const problems = [];
      slide.querySelectorAll('*').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
        const out4 = r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1;
        if (out4) problems.push(el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''));
      });
      // Teks isi tidak boleh menimpa bilah progres/footer (zona aman bawah 150px)
      const safeBottom = box.bottom - 150;
      slide.querySelectorAll('h1,h2,p,li,.callout').forEach((el) => {
        if (el.closest('.foot')) return;
        if (el.getBoundingClientRect().bottom > safeBottom + 1) problems.push('menimpa-footer:' + el.tagName.toLowerCase());
      });
      const text = slide.innerText || '';
      out.push({ index: i + 1, problems: [...new Set(problems)], placeholder: /\[[^\]]{2,}\]/.test(text) });
    });
    return out;
  });

  if (report.length === 0) {
    console.error('Tidak ada elemen .slide di berkas ini.');
    await browser.close();
    process.exit(1);
  }

  let overflow = 0;
  let placeholders = 0;
  report.forEach((r) => {
    if (r.problems.length) { overflow++; console.error(`Slide ${r.index}: meluap/menimpa -> ${r.problems.join(', ')}`); }
    if (r.placeholder)     { placeholders++; console.error(`Slide ${r.index}: masih ada placeholder [..]`); }
  });
  if (blocked.length) console.warn(`Diblokir ${blocked.length} permintaan jaringan (mis. ${blocked[0]})`);

  if (overflow) { await browser.close(); console.error(`GAGAL: ${overflow} slide meluap.`); process.exit(2); }
  if (placeholders) { await browser.close(); console.error(`GAGAL: ${placeholders} slide masih berisi placeholder.`); process.exit(3); }

  if (!checkOnly) {
    fs.mkdirSync(outDir, { recursive: true });
    const slides = await page.$$('.slide');
    for (let i = 0; i < slides.length; i++) {
      const file = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
      await slides[i].screenshot({ path: file });
      console.log('OK  ' + file);
    }
  }
  console.log(`Selesai: ${report.length} slide, 0 meluap, 0 placeholder${checkOnly ? ' (check-only)' : ''}.`);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
