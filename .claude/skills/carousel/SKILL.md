---
name: carousel
description: Membuat carousel Instagram/Facebook rasio 4:5 (1080x1350) untuk Apotek Delima Farma — edukasi kesehatan untuk awam, penggunaan obat yang benar, info layanan apotek dan aplikasi konsultasi. Memandu dari brief, naskah berrujukan, pratinjau HTML, sampai ekspor PNG dan caption. Gunakan saat pengguna menyebut carousel, slide IG, swipe post, konten edukasi apotek, atau desain slide sosial media. Untuk carousel edukasi pribadi dr. Wahyu (proktologi/PBPI), pakai skill carousel-edukasi-dr-wahyu bila tersedia karena aturannya lebih ketat.
license: Internal Delima Farma — hanya untuk penggunaan internal
metadata:
  version: "1.0"
  owner: Delima Farma
---

# Carousel Delima Farma

Menghasilkan carousel yang aman secara etika, terbaca di ponsel, dan konsisten dengan merek aplikasi Delima. Teks slide selalu dibuat dengan kode HTML, tidak pernah di dalam gambar buatan AI, supaya tidak ada salah ketik pada informasi kesehatan.

## Aturan keras (tidak boleh dilanggar)

1. Tidak ada data, foto, video, atau tangkapan layar pasien, termasuk yang tampak anonim (chat WhatsApp, resep, struk, layar aplikasi konsultasi yang berisi data).
2. Tidak ada janji sembuh, jaminan hasil, atau klaim "terbaik", "tercepat", "paling ampuh", "100% aman".
3. Tidak mempromosikan obat keras, obat resep, narkotika, atau psikotropika kepada publik (nama merek, harga, diskon). Aturan periklanan obat ke publik ada di ketentuan BPOM/Kemenkes; verifikasi versi terbaru. Produk bebas, suplemen, dan alat kesehatan hanya boleh diklaim sebatas label dan izin edar.
4. Setiap angka atau klaim klinis wajib punya rujukan yang sudah diperiksa (PubMed, pedoman resmi). Jangan menulis angka dari ingatan. Rujukan tidak ketemu: buang klaimnya atau beri label "belum terbukti".
5. Tidak menakut-nakuti dan tidak mendiagnosis lewat konten. Cantumkan kapan harus ke dokter atau IGD bila relevan, dan label "Informasi edukasi, bukan pengganti pemeriksaan".
6. Tidak memakai wajah, foto, atau testimoni orang tanpa izin tertulis. Tidak menyalin desain, musik, atau gambar pihak lain.
7. Tidak memposting atau menjadwalkan apa pun tanpa persetujuan eksplisit pemilik akun atas pratinjau.
8. Tidak menampilkan kunci, token, atau isi berkas `.env`/konfigurasi.

## Alur 4 tahap (jangan dilompati)

### 1. Brief
Tanyakan hanya yang belum jelas, dalam satu pesan: topik, sasaran pembaca (awam, ibu hamil, lansia, pasien kronis), tujuan (edukasi, trafik ke konsultasi, kunjungan), platform, jumlah slide (bawaan 7–9), nama akun dan ajakan bertindak (CTA) yang boleh dipakai. Jika topik menyentuh pengobatan keras atau kondisi serius, tandai perlu tinjau apoteker/dokter.

### 2. Naskah berrujukan
- Cari rujukan lebih dulu, catat penulis, jurnal/lembaga, tahun, PMID atau DOI.
- Susun naskah, lalu tampilkan tabel **klaim → rujukan → tingkat keyakinan** sebelum membuat desain.
- Beri tahu terus terang bila rujukan lemah atau klaim bisa menyesatkan.
- Bahasa Indonesia sederhana, satu gagasan per slide, maksimal sekitar 35 kata per slide.

### 3. Pratinjau
Salin `assets/carousel-template.html`, isi isinya, dan tampilkan pratinjau. Tanyakan: "Slide mana yang perlu diubah?" Ubah hanya slide yang disebut. Ekspor hanya setelah ada persetujuan jelas seperti "setuju" atau "ekspor".

### 4. Ekspor dan paket posting
- Jalankan `node scripts/export-png.js <file.html> <folder-keluaran>` (perintah dijalankan dari folder skill ini). Skrip memotret tiap `.slide` menjadi PNG 1080x1350, memblokir permintaan jaringan, dan gagal bila ada teks keluar dari slide.
- Simpan hasil di luar repo atau di folder `out/` (sudah diabaikan git). Jangan commit keluaran.
- Siapkan caption: inti di 125 karakter pertama, CTA satu saja, 3–5 tagar relevan. Jadwalkan hanya setelah persetujuan eksplisit.

## Struktur slide (bawaan)

| # | Slide | Isi |
|---|---|---|
| 1 | Sampul/hook | Satu pertanyaan atau pernyataan tajam, tanpa klaim hasil dan tanpa rasa takut berlebihan |
| 2 | Janji | Apa yang pembaca dapat setelah menggeser |
| 3–6 | Isi | Satu gagasan per slide: judul pendek, penjelasan, contoh nyata |
| 7 | Ringkasan | 3 butir yang bisa dilakukan hari ini |
| 8 | Kapan ke dokter | Tanda bahaya dan kapan ke IGD (jika relevan) |
| 9 | Penutup/CTA | Satu ajakan, label edukasi, nama apotek. Rujukan boleh di slide terpisah |

Alternatif: daftar "X kesalahan umum", tutorial langkah, atau mitos vs fakta, bila topik cocok.

## Aturan desain

- Kanvas 1080x1350 px per slide. Teks isi minimal 40 px, judul 64–96 px, kontras tinggi.
- Warna merek dari aplikasi: hijau tua `#0b3d2e`, hijau `#0d9457`, hijau terang `#12b76a`, hijau muda `#ecfdf5`, teks `#16241f`, latar `#f4faf7`. Peringatan memakai amber `#d97706`, bahaya `#dc2626`, dan hanya untuk tanda bahaya.
- Font: template memakai tumpukan font sistem. Berkas font merek tidak ada di repo; bila pemilik akun punya, sematkan lewat `@font-face` dari berkas lokal. Jangan memuat Google Fonts (jaringan keluar diblokir dan alasan privasi).
- Bila memakai gambar, sematkan sebagai data URI dan periksa lisensinya. Ilustrasi sederhana dibuat dengan SVG/HTML.
- Bilah progres, penanda geser (kecuali slide terakhir), dan nama akun ada di setiap slide.

## Pemeriksaan sebelum menyerahkan

- [ ] Setiap angka punya rujukan dan masuk slide rujukan atau caption
- [ ] Tidak ada janji hasil, nama obat keras, harga, promo obat resep, atau data pasien
- [ ] Ada label "Informasi edukasi, bukan pengganti pemeriksaan" dan tanda kapan ke dokter
- [ ] Skrip ekspor melapor 0 slide meluap
- [ ] Tidak ada teks medis di dalam gambar generatif
- [ ] Pratinjau sudah disetujui sebelum ekspor atau penjadwalan
- [ ] Hasil ekspor berada di luar repo

## Gaya jawaban ke pengguna

Bahasa Indonesia sederhana, langsung ke inti. Sebut risiko atau kelemahan suatu ide beserta alternatifnya. Laporkan hasil, bukan proses.
