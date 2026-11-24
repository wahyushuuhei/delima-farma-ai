---
name: delima-sales
description: Menganalisis penjualan Apotek Delima Farma dari berkas ekspor POS (CSV/XLSX) — omzet, laba kotor dan margin, produk terlaris/terlambat, analisis ABC (Pareto), tren harian-mingguan-bulanan, jam sibuk, keranjang belanja dan peluang cross-sell, anomali retur/void/diskon, serta rekomendasi tindakan berprioritas. Gunakan saat pengguna menyebut penjualan, omzet, laporan POS, produk laris, margin, perbandingan periode, atau performa cabang/shift. Bekerja pada berkas yang diberikan pengguna; tidak terhubung ke database POS dan tidak menyimpan data.
license: Internal Delima Farma — hanya untuk penggunaan internal
metadata:
  version: "1.0"
  owner: Delima Farma
---

# Delima Sales

Mengubah ekspor penjualan POS menjadi keputusan: apa yang dijual, seberapa menguntungkan, apa yang harus diubah minggu ini. Hasil harus bisa ditelusuri ke baris data, bukan sekadar angka cantik.

## Batas data dan privasi (baca dulu)

- Sumber data adalah **berkas ekspor yang diberikan pengguna** di sesi ini. POS/Stok Delima berada di proyek Supabase yang terpisah dari aplikasi konsultasi. Jangan menghubungkan ke database POS, jangan meminta atau menyimpan kunci akses. Jika pengguna secara eksplisit meminta pembacaan langsung, hanya baca (read-only), dan jangan pernah menulis.
- Berkas ekspor jangan disimpan di dalam repo dan jangan di-commit. Simpan hasil kerja di folder sementara atau di luar repo.
- Hapus kolom identitas sebelum analisis: nama pasien, nomor telepon, alamat, nomor resep, nama dokter penulis resep, nama pelanggan. Jika perlu menggabungkan data per pelanggan, gunakan ID yang sudah di-hash dan jangan tampilkan di laporan.
- Laporkan data dalam bentuk agregat. Untuk obat keras, narkotika, dan psikotropika, analisis di tingkat kategori; jangan membuat saran promosi untuk golongan ini.
- Analisis per kasir atau per orang bersifat sensitif: sajikan sebagai pola proses (mis. jam rawan salah input), bukan sebagai penilaian pribadi, kecuali pemilik meminta secara eksplisit.

## Alur kerja

### 1. Klarifikasi (satu pesan, hanya yang belum jelas)
Periode dan pembandingnya, cabang, keputusan yang akan diambil dari analisis, definisi omzet (bruto atau neto), apakah ada harga beli/HPP di data, dan apakah retur tercatat sebagai baris negatif.

### 2. Profil dan pemetaan kolom
Buka berkas, tampilkan struktur, lalu petakan ke nama kanonik. Konfirmasi pemetaan bila ragu.

| Kanonik | Keterangan | Contoh nama di POS (beragam) |
|---|---|---|
| tanggal | Tanggal-waktu transaksi | tgl, waktu, datetime |
| no_nota | ID transaksi | faktur, invoice, nota |
| sku / nama_barang | Produk | kode, item |
| kategori | OTC, OWA, obat resep, alkes, suplemen, lainnya | golongan |
| qty | Jumlah (negatif = retur bila begitu aturannya) | jumlah |
| harga_jual | Harga satuan jual | harga |
| diskon | Diskon baris atau nota | potongan |
| harga_beli | HNA/harga pokok satuan (bila ada) | hna, modal |
| metode_bayar | Tunai, QRIS, transfer, kredit | bayar |
| shift / cabang | Bila ada | |

Pemeriksaan kualitas sebelum menghitung: nota duplikat, qty nol atau negatif tak terduga, harga nol, tanggal di luar periode atau zona waktu keliru, produk tanpa kategori, selisih total baris dan total nota. Laporkan jumlah baris yang bermasalah dan cara menanganinya. Jangan membuang data diam-diam.

### 3. Hitung metrik standar

| Metrik | Rumus |
|---|---|
| Omzet bruto | Σ(qty × harga_jual) |
| Omzet neto | Omzet bruto − diskon − retur |
| HPP | Σ(qty × harga_beli) |
| Laba kotor | Omzet neto − HPP |
| Margin kotor % | Laba kotor ÷ Omzet neto |
| Rata-rata nilai nota (AOV) | Omzet neto ÷ jumlah nota |
| Item per nota (UPT) | Σ qty ÷ jumlah nota |
| Pertumbuhan | (periode ini − pembanding) ÷ pembanding |
| Kontribusi SKU | Omzet atau laba kotor SKU ÷ total |

**ABC (Pareto):** urutkan SKU menurut kontribusi, kumulatif sampai sekitar 80% = A, sampai sekitar 95% = B, sisanya = C. Ambang ini usulan awal; konfirmasi ke pengguna. Untuk keputusan stok, ABC menurut **laba kotor** lebih berguna daripada menurut omzet. Bila harga beli tidak ada, katakan analisis hanya berdasarkan omzet.

### 4. Paket analisis
1. **Ringkasan eksekutif:** 5 angka utama dan perubahannya terhadap pembanding.
2. **Tren:** harian atau mingguan, dengan penanda hari libur dan kejadian khusus bila diketahui.
3. **ABC dan kategori:** kontribusi per kategori, daftar SKU kelas A, dan SKU kelas C yang menyita modal atau rak.
4. **Pola waktu:** jam dan hari tersibuk untuk jadwal staf dan shift.
5. **Keranjang belanja:** pasangan produk yang sering dibeli bersama (support, confidence, lift). Dipakai untuk penataan rak dan pengingat konseling apoteker, bukan untuk mendorong obat yang tidak dibutuhkan. Pasangan harus masuk akal secara klinis dan ditinjau apoteker.
6. **Anomali:** retur, void, dan diskon di luar pola; transaksi di luar jam buka; harga jual di bawah harga beli. Tulis sebagai "perlu dicek", bukan tuduhan.

### 5. Dari temuan ke keputusan
Setiap temuan memakai format ini:

> **Temuan** → **Bukti** (angka, baris, filter) → **Implikasi** → **Rekomendasi** → **Prioritas** (dampak × usaha: tinggi/sedang/rendah) → **Pemilik & tenggat**

Urutkan menurut prioritas dan ambil 3–5 tindakan teratas (prinsip 80/20). Pisahkan **fakta dari data** dan **hipotesis** yang perlu diuji.

### 6. Keluaran
- Ringkasan dalam Markdown (struktur: Ringkasan, Analisis, Rekomendasi, Langkah, Risiko).
- Bila diminta berkas, buat xlsx dengan skill `xlsx`: tabel sumber yang sudah dibersihkan, rumus hidup (bukan nilai statis) di sheet hitung, satu sheet ringkasan, dan sheet "Catatan & asumsi".
- Sebutkan berkas sumber, filter, jumlah baris yang dihitung, dan keterbatasan.

## Aturan interpretasi

- Bandingkan periode yang sebanding (jumlah hari kerja, bulan puasa, musim penyakit). Jangan membandingkan minggu biasa dengan minggu libur tanpa catatan.
- Korelasi bukan sebab. Tandai penjelasan sebagai hipotesis dan sarankan cara mengujinya.
- Data sedikit: sebutkan jumlah nota atau hari yang dipakai dan beri peringatan bahwa pola bisa tidak stabil. Jangan mengarang ambang "cukup".
- Kenaikan omzet belum tentu kenaikan laba. Periksa margin sebelum menyarankan diskon atau promo.
- Jangan menyimpulkan perilaku pasien dari data individu.

## Pemeriksaan sebelum menyerahkan

- [ ] Pemetaan kolom dan masalah kualitas data sudah dilaporkan
- [ ] Angka ringkasan cocok dengan total di tabel rinci
- [ ] Tidak ada kolom identitas pasien/dokter dalam keluaran
- [ ] Fakta dan hipotesis dipisahkan; sampel kecil diberi peringatan
- [ ] Rekomendasi punya pemilik, prioritas, dan cara mengukur hasilnya
- [ ] Tidak ada berkas data yang berada di dalam repo
