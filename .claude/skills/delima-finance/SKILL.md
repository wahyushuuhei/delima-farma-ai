---
name: delima-finance
description: Menganalisis dan menyusun laporan keuangan Apotek Delima Farma — laba rugi sederhana, arus kas, hutang dagang ke PBF (aging dan jatuh tempo), piutang, margin dan penetapan harga, titik impas, siklus konversi kas (DIO, DSO, DPO), anggaran, dan rekonsiliasi kas/bank — dari berkas yang diberikan pengguna (CSV/XLSX). Gunakan saat pengguna menyebut keuangan, laba rugi, cash flow, hutang PBF, margin, HPP, break even, budget, atau rekonsiliasi. Bukan nasihat pajak atau akuntan publik; angka estimasi diberi label jelas.
license: Internal Delima Farma — hanya untuk penggunaan internal
metadata:
  version: "1.0"
  owner: Delima Farma
---

# Delima Finance

Memberi pemilik gambaran keuangan yang jujur: berapa laba sebenarnya, kapan kas menipis, hutang mana yang harus dibayar lebih dulu. Prioritas: akurasi, keterlacakan, dan kehati-hatian dengan data keuangan.

## Batas data dan keamanan (baca dulu)

- Bekerja dari berkas yang diberikan pengguna di sesi ini. Jangan terhubung ke bank, aplikasi akuntansi, atau database POS. Jangan meminta atau menyimpan kata sandi, PIN, token, atau kunci akses.
- Data keuangan bersifat rahasia: jangan diunggah ke layanan pihak ketiga, jangan ditempel ke konten publik, dan jangan di-commit ke repo. Simpan hasil kerja di folder sementara atau di luar repo.
- Samarkan nomor rekening dan kartu (tampilkan 4 digit terakhir) dan hapus data identitas pasien atau pelanggan yang tidak diperlukan.
- Ini analisis manajerial. Untuk perlakuan pajak, penyusunan laporan resmi, atau keputusan hukum, arahkan ke akuntan atau konsultan pajak. Jangan menyebut tarif pajak dari ingatan.
- Pisahkan **angka dari data** dan **estimasi/asumsi**. Beri label "Estimasi" pada yang kedua.

## Alur kerja

### 1. Klarifikasi
Tujuan (laporan bulanan, rencana kas 13 minggu, keputusan harga, evaluasi hutang), periode, basis pencatatan (kas atau akrual; bila tidak jelas, tanyakan), apakah ada HPP, daftar biaya tetap dan variabel, tempo pembayaran tiap PBF, dan saldo kas awal.

### 2. Susun struktur data
Petakan sumber ke kategori standar:

| Kategori | Isi umum |
|---|---|
| Pendapatan | Penjualan tunai, non-tunai, kredit instansi |
| HPP | Pembelian terpakai (persediaan awal + pembelian − persediaan akhir) |
| Biaya tetap | Sewa, gaji, listrik/air/internet, asuransi, perizinan |
| Biaya variabel | Kemasan, komisi pembayaran digital, ongkos kirim |
| Non-operasional | Bunga, penyusutan, biaya satu kali |
| Hutang dagang | Faktur PBF belum dibayar, tanggal jatuh tempo |
| Piutang | Tagihan instansi/pelanggan kredit |

Pemeriksaan kualitas: transaksi tanpa kategori, duplikat, tanggal di luar periode, selisih total vs mutasi, biaya pribadi tercampur biaya usaha. Laporkan, jangan hapus diam-diam.

### 3. Rumus inti

| Konsep | Rumus |
|---|---|
| Laba kotor | Pendapatan neto − HPP |
| Margin kotor % | Laba kotor ÷ pendapatan neto |
| Mark-up % | (Harga jual − harga pokok) ÷ harga pokok. **Berbeda** dari margin; jangan tertukar |
| Laba operasional | Laba kotor − biaya operasional |
| Laba bersih | Laba operasional ± non-operasional − pajak (pajak per konsultan) |
| Titik impas (omzet) | Biaya tetap ÷ margin kotor % |
| DIO | Rata-rata persediaan ÷ HPP × jumlah hari |
| DSO | Rata-rata piutang ÷ penjualan kredit × jumlah hari |
| DPO | Rata-rata hutang dagang ÷ pembelian × jumlah hari |
| Siklus konversi kas (CCC) | DIO + DSO − DPO |
| Hari kas bertahan | Saldo kas ÷ biaya operasional kas harian |
| Rasio lancar | Aset lancar ÷ kewajiban lancar |

Harga pokok efektif = harga beli setelah diskon dari PBF, ditambah biaya perolehan. Perlakuan pajak masukan (dapat dikreditkan atau tidak) dikonfirmasi ke akuntan sebelum dimasukkan. Penetapan harga: patuhi harga eceran tertinggi bila berlaku untuk produk tersebut.

### 4. Paket analisis
1. **Laba rugi ringkas:** pendapatan, HPP, laba kotor, biaya, laba bersih, dan perbandingan dengan periode sebelumnya.
2. **Arus kas:** kas masuk dan keluar per minggu, saldo akhir, titik terendah, dan minggu berisiko. Untuk proyeksi, tulis asumsinya di sheet terpisah dan beri skenario dasar, hati-hati, dan optimis bila diminta.
3. **Hutang dagang (aging):** kelompokkan belum jatuh tempo, 1–30, 31–60, > 60 hari. Urutkan pembayaran dengan mempertimbangkan diskon pelunasan, hubungan dengan PBF, dan risiko pasokan.
4. **Piutang:** umur dan risiko tagih; usulan penagihan.
5. **Margin dan harga:** margin per kategori dan SKU kelas A; produk dengan margin di bawah target (tanya target ke pemilik).
6. **Titik impas dan kesehatan kas:** omzet minimum per bulan dan hari kas bertahan.
7. **Rekonsiliasi:** cocokkan mutasi bank dan catatan kas/penjualan. Daftar selisih dengan kemungkinan sebab (waktu pencatatan, biaya admin, kesalahan input) tanpa menyimpulkan kecurangan.

### 5. Dari angka ke keputusan
Format temuan:

> **Temuan** → **Bukti** (angka, sumber) → **Implikasi** → **Rekomendasi** → **Prioritas** → **Pemilik & tenggat**

Jelaskan trade-off, misalnya mempercepat pembayaran PBF demi diskon versus menjaga kas. Ambil 3–5 tindakan teratas.

### 6. Keluaran
- Ringkasan Markdown (Ringkasan, Analisis, Rekomendasi, Langkah, Risiko).
- Bila diminta berkas, buat xlsx dengan skill `xlsx`. Struktur yang disarankan: `Input`, `Laba_Rugi`, `Arus_Kas`, `Hutang`, `KPI`, `Asumsi`. Gunakan rumus hidup, bukan nilai statis, dan pisahkan sel asumsi dari sel hitung. Jalankan perhitungan ulang dan pastikan tidak ada galat rumus sebelum menyerahkan.
- Sebutkan sumber berkas, periode, dan keterbatasan.

## Pemeriksaan sebelum menyerahkan

- [ ] Total laba rugi cocok dengan data rinci
- [ ] Estimasi dan asumsi diberi label; tidak ada tarif pajak dari ingatan
- [ ] Margin dan mark-up tidak tertukar
- [ ] Nomor rekening disamarkan; tidak ada data pasien
- [ ] xlsx bebas galat rumus dan rumusnya hidup
- [ ] Tidak ada berkas keuangan di dalam repo atau diunggah ke pihak ketiga
