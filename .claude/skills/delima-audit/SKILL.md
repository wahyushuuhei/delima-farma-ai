---
name: delima-audit
description: Melakukan audit internal Apotek Delima Farma dan aplikasi konsultasinya — kepatuhan operasional kefarmasian (penyimpanan, resep, narkotika/psikotropika, pencatatan), audit stok dan kas (selisih opname, void/retur/diskon), serta tinjauan keamanan dan privasi aplikasi (RLS Supabase, XSS, kebocoran kunci, data pasien). Menghasilkan temuan berformat kondisi-kriteria-sebab-akibat-rekomendasi, skor risiko, dan register tindak lanjut. Gunakan saat pengguna menyebut audit, kepatuhan, SOP, inspeksi, selisih, kecurangan, review keamanan, privasi pasien, atau persiapan inspeksi. Bukan opini hukum.
license: Internal Delima Farma — hanya untuk penggunaan internal
metadata:
  version: "1.0"
  owner: Delima Farma
---

# Delima Audit

Menemukan kelemahan sebelum pihak luar atau insiden menemukannya, lalu mengubahnya menjadi perbaikan berprioritas. Audit bertujuan memperbaiki sistem, bukan mencari kambing hitam.

## Prinsip kerja

- **Berbasis bukti.** Setiap temuan menyebut bukti: berkas, baris, kode, foto, wawancara. Tanpa bukti, tulis sebagai "dugaan yang perlu diverifikasi".
- **Minim data pribadi.** Kertas kerja tidak memuat identitas pasien. Samarkan nama, nomor telepon, dan nomor resep; gunakan kode. Jangan menyalin data pasien ke laporan, repo, atau layanan luar.
- **Hanya baca.** Audit tidak mengubah data operasional, tidak menjalankan SQL yang menulis ke database, dan tidak memakai kunci service_role. Perbaikan dikerjakan terpisah setelah disetujui.
- **Independen.** Bila memungkinkan, orang yang menjalankan proses tidak mengaudit prosesnya sendiri; catat bila tidak bisa dihindari.
- **Bukan opini hukum.** Rujukan regulasi adalah titik awal; verifikasi versi terbaru ke sumber resmi dan konsultasikan ke apoteker penanggung jawab atau penasihat hukum untuk keputusan penting.

## Alur kerja

1. **Tentukan ruang lingkup dan tujuan.** Domain (operasional, stok-kas, aplikasi), periode, lokasi, dan keputusan yang dibantu audit ini.
2. **Pilih checklist.**
   - Operasional kefarmasian: `references/checklist-operasional-apotek.md`
   - Keamanan dan privasi aplikasi konsultasi: `references/checklist-keamanan-aplikasi-konsultasi.md`
   - Stok dan kas: gunakan prosedur analitik di bawah, bersama skill `delima-stock` dan `delima-finance`.
3. **Kumpulkan bukti** dan catat sumbernya. Pilih sampel dan sebut cara memilihnya (acak, risiko tinggi, periode tertentu).
4. **Nilai dan tulis temuan** dengan format 5 unsur.
5. **Nilai risiko** dan urutkan.
6. **Susun laporan dan register tindak lanjut.**
7. **Verifikasi tindak lanjut** pada audit berikutnya.

## Prosedur analitik stok dan kas

| Uji | Cara | Sinyal |
|---|---|---|
| Selisih stock opname | Bandingkan stok sistem dan fisik per SKU/batch | Selisih berulang pada SKU yang sama atau golongan khusus |
| Retur dan void | Frekuensi, nilai, jam, pencatat | Lonjakan, pola jam tertentu, tanpa alasan tercatat |
| Diskon | Diskon di luar kebijakan, diskon manual berulang | Persentase atau nilai tidak lazim |
| Harga di bawah harga beli | Bandingkan harga jual dan harga beli | Penjualan rugi tanpa persetujuan |
| Transaksi di luar jam buka | Stempel waktu | Aktivitas saat toko tutup |
| Kas harian | Bandingkan setoran, penjualan tunai, dan selisih kas | Selisih berulang |
| Hak akses POS | Daftar pengguna aktif, akun bersama, hak ubah harga/stok | Akun bersama, mantan karyawan masih aktif |
| Pemisahan tugas | Siapa memesan, menerima, menyimpan, mencatat, dan membayar | Satu orang memegang beberapa tahap |

Sinyal bukan bukti kecurangan. Tulis sebagai "perlu klarifikasi" dan beri kesempatan penjelasan sebelum menyimpulkan.

## Format temuan (5 unsur)

| Unsur | Isi |
|---|---|
| Kondisi | Apa yang ditemukan, dengan bukti |
| Kriteria | Standar yang dipakai: SOP, regulasi, praktik baik |
| Sebab | Akar masalah, bukan gejala |
| Akibat | Dampak nyata atau potensial |
| Rekomendasi | Tindakan spesifik yang bisa diuji selesai atau tidaknya |

## Skor risiko

Risiko = **Kemungkinan (1–5) × Dampak (1–5)**.

| Skor | Tingkat | Batas waktu tindak lanjut (usulan) |
|---|---|---|
| 15–25 | Kritis | Segera, hentikan praktik berisiko lebih dulu |
| 8–14 | Tinggi | Dalam 30 hari |
| 4–7 | Sedang | Dalam 90 hari |
| 1–3 | Rendah | Dipantau |

Dampak mencakup keselamatan pasien, kebocoran data pribadi, sanksi regulasi, kerugian finansial, dan reputasi. Keselamatan pasien dan kebocoran data selalu dinilai tinggi sampai terbukti sebaliknya. Batas waktu adalah usulan; sesuaikan dengan pemilik.

## Register tindak lanjut

| ID | Temuan | Tingkat | Rekomendasi | Pemilik | Tenggat | Status (Baru/Berjalan/Selesai/Diterima risikonya) | Bukti penyelesaian |
|---|---|---|---|---|---|---|---|

Risiko yang diterima tanpa perbaikan harus tertulis dengan alasan dan persetujuan pemilik.

## Format laporan

1. **Ringkasan:** lingkup, periode, 3–5 temuan terpenting, penilaian keseluruhan.
2. **Temuan terperinci** (format 5 unsur, urut risiko).
3. **Hal yang berjalan baik** (supaya dipertahankan).
4. **Rencana tindak lanjut** (register di atas).
5. **Keterbatasan audit** (apa yang tidak diperiksa dan kenapa).
6. **Lampiran bukti** tanpa data pasien.

## Pemeriksaan sebelum menyerahkan

- [ ] Setiap temuan punya bukti dan sumbernya
- [ ] Tidak ada identitas pasien atau kunci rahasia di laporan
- [ ] Dugaan dibedakan dari fakta; sinyal tidak ditulis sebagai tuduhan
- [ ] Setiap rekomendasi punya pemilik dan tenggat usulan
- [ ] Keterbatasan audit dinyatakan
- [ ] Tidak ada perubahan pada data atau kode operasional selama audit
