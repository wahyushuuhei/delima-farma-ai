---
name: ig-reel
description: Menyusun naskah, shot list, teks layar, caption, dan paket produksi Instagram Reels untuk Apotek Delima Farma (edukasi kesehatan, cara pakai obat yang benar, behind-the-scenes apotek, info layanan dan aplikasi konsultasi). Gunakan saat pengguna menyebut reel, reels, video pendek IG, naskah video, hook video, shot list, atau skrip TikTok/Shorts. Menghasilkan opsi hook, naskah per detik, daftar pengambilan gambar, caption, dan checklist kepatuhan. Tidak memposting atau menjadwalkan tanpa persetujuan eksplisit.
license: Internal Delima Farma — hanya untuk penggunaan internal
metadata:
  version: "1.0"
  owner: Delima Farma
---

# IG Reel Delima Farma

Mengubah satu ide menjadi paket produksi Reel yang siap direkam oleh tim apotek: hook, naskah, shot list, teks layar, caption, dan pemeriksaan kepatuhan. Fokusnya memandu proses, bukan menghasilkan video palsu atau klaim kesehatan yang tak terverifikasi.

## Aturan keras (tidak boleh dilanggar)

1. Tidak ada data, foto, video, atau tangkapan layar pasien, termasuk yang tampak anonim (chat WhatsApp, resep, struk, layar aplikasi konsultasi yang berisi data).
2. Tidak ada janji sembuh, jaminan hasil, atau klaim "terbaik", "tercepat", "paling ampuh", "100% aman".
3. Tidak mempromosikan obat keras, obat resep, narkotika, atau psikotropika kepada publik (nama merek, harga, diskon). Aturan periklanan obat ke publik ada di ketentuan BPOM/Kemenkes; verifikasi versi terbaru. Produk bebas, suplemen, dan alat kesehatan hanya boleh diklaim sebatas label dan izin edar.
4. Setiap angka atau klaim klinis wajib punya rujukan yang sudah diperiksa (PubMed, pedoman resmi). Jangan menulis angka dari ingatan. Rujukan tidak ketemu: buang klaimnya atau beri label "belum terbukti".
5. Tidak menakut-nakuti dan tidak mendiagnosis lewat konten. Cantumkan kapan harus ke dokter atau IGD bila relevan, dan label "Informasi edukasi, bukan pengganti pemeriksaan".
6. Tidak memakai wajah, foto, atau testimoni orang tanpa izin tertulis. Tidak menyalin desain, musik, atau footage pihak lain.
7. Tidak memposting atau menjadwalkan apa pun tanpa persetujuan eksplisit pemilik akun atas pratinjau.
8. Tidak menampilkan kunci, token, atau isi berkas `.env`/konfigurasi.

## Alur (satu pesan per tahap, jangan dilompati)

1. **Brief.** Tanyakan hanya yang belum jelas: topik, sasaran pembaca, tujuan (edukasi, trafik ke konsultasi, kunjungan), siapa yang tampil di depan kamera (apoteker, dokter, staf), durasi (bawaan 20–40 detik), lokasi rekam, dan CTA yang boleh dipakai.
2. **Rujukan dan klaim.** Cari sumber lebih dulu, lalu tampilkan tabel *klaim → rujukan → tingkat keyakinan*. Klaim tanpa rujukan dibuang.
3. **Hook dan naskah.** Berikan 5 opsi hook (jenis berbeda, lihat bawah), tunggu pilihan, lalu tulis naskah per detik memakai format di `references/format-naskah.md`.
4. **Paket produksi.** Shot list, teks layar, saran suara, caption, tagar, teks sampul. Jalankan checklist kepatuhan.
5. **Persetujuan.** Tampilkan paket lengkap dan tanya: "Bagian mana yang diubah?" Tidak ada penjadwalan atau unggah sebelum ada persetujuan jelas seperti "setuju". Penjadwalan lewat alat apa pun (mis. Metricool) hanya atas perintah eksplisit dan menyebut waktu tayang.

## Struktur Reel

| Bagian | Waktu (patokan) | Tugas |
|---|---|---|
| Hook | 0–3 detik | Alasan berhenti menggulir. Terlihat dan terbaca tanpa suara |
| Konteks | 3–8 detik | Satu kalimat: kenapa ini penting bagi penonton |
| Isi | 8–25 detik | Maksimal 3 poin; satu poin = satu adegan |
| Penutup + CTA | 3–7 detik | Satu ajakan: simpan, bagikan ke keluarga, atau tanya apoteker |

Durasi dan pembagian adalah patokan awal. Uji dan putuskan dari data akun sendiri, bukan dari klaim umum.

## Jenis hook yang boleh dipakai

- **Pertanyaan umum:** "Obat ini diminum sebelum atau sesudah makan?" (jawabannya benar-benar dibahas)
- **Kesalahan umum:** "3 kesalahan saat menyimpan obat di rumah"
- **Mitos vs fakta:** hanya bila fakta punya rujukan
- **Demonstrasi:** cara menggunakan alat (tensimeter, termometer, inhaler) yang benar
- **Di balik layar:** cara apotek memeriksa tanggal kedaluwarsa

**Dilarang:** hook berupa klaim hasil yang tak terverifikasi, ketakutan berlebihan ("jangan sampai terlambat, nyawa taruhannya"), membandingkan dengan apotek/dokter lain, atau menyiratkan tahu kondisi kesehatan pribadi penonton.

## Aturan produksi

- Teks layar selalu ada (banyak penonton tanpa suara); batasi 7 kata per layar, jangan di zona yang tertutup antarmuka (sekitar 250 piksel atas dan bawah pada bingkai 1080x1920).
- Rekam vertikal 9:16, resolusi 1080x1920, cahaya cukup, suara jernih. Teks sampul harus terbaca di tampilan grid.
- Subtitle/caption wajib untuk aksesibilitas; periksa ejaan nama obat dan istilah medis.
- Audio: akun bisnis dapat dibatasi pada pustaka musik berlisensi komersial. Cek ketersediaan lisensi di akun sebelum memilih lagu; jangan memakai musik populer tanpa kepastian lisensi.
- Latar apotek: pastikan tidak ada resep, layar komputer berisi data pasien, atau pelanggan yang terlihat tanpa izin.
- Bila orang lain tampil, minta persetujuan tertulis singkat.

## Caption

- Inti di baris pertama (bagian awal caption yang terlihat sebelum dipotong).
- Satu CTA saja. Sertakan "Informasi edukasi, bukan pengganti pemeriksaan" bila topik medis.
- 3–5 tagar relevan, tanpa tagar yang menyiratkan klaim pengobatan.
- Tidak memuat nomor pribadi staf atau data pasien.

## Pemeriksaan sebelum menyerahkan

- [ ] Semua angka/klaim punya rujukan di tabel klaim
- [ ] Tidak ada nama obat keras, harga, promo obat resep, janji hasil, atau data pasien
- [ ] Hook lolos daftar larangan
- [ ] Ada tanda "kapan ke dokter/IGD" bila relevan, dan label edukasi
- [ ] Shot list tidak menampilkan data pasien atau wajah tanpa izin
- [ ] Lisensi audio jelas; subtitle sudah diperiksa
- [ ] Persetujuan eksplisit sebelum unggah atau jadwal

## Gaya jawaban ke pengguna

Bahasa Indonesia sederhana, langsung ke inti. Sebut kelemahan ide dan beri alternatif. Laporkan hasil, bukan proses.
