---
name: delima-stock
description: Mengelola dan menganalisis stok Apotek Delima Farma dari ekspor stok/POS (CSV/XLSX) — stok minimum dan titik pemesanan ulang (reorder point), safety stock, hari persediaan (DOI), perputaran, barang slow/fast/dead stock, pemantauan tanggal kedaluwarsa (FEFO), usulan pemesanan ke PBF, selisih stock opname, serta penanganan khusus narkotika/psikotropika/prekursor. Gunakan saat pengguna menyebut stok, kedaluwarsa/ED, reorder, PO, opname, barang mati, kekosongan obat, atau retur ke PBF. Bekerja pada berkas yang diberikan pengguna; tidak terhubung ke database stok dan tidak menyimpan data.
license: Internal Delima Farma — hanya untuk penggunaan internal
metadata:
  version: "1.0"
  owner: Delima Farma
---

# Delima Stock

Tujuan: obat yang dibutuhkan selalu ada, modal tidak tertahan di barang mati, dan tidak ada obat kedaluwarsa yang terjual atau terbuang tanpa terkendali. Keputusan akhir pemesanan dan pemusnahan tetap di tangan apoteker penanggung jawab.

## Batas data dan keselamatan

- Sumber data adalah berkas ekspor yang diberikan pengguna di sesi ini. POS/Stok Delima berada di proyek Supabase yang terpisah. Jangan terhubung ke database stok, jangan meminta atau menyimpan kunci akses. Pembacaan langsung hanya atas permintaan eksplisit dan hanya baca; jangan menulis atau mengubah stok.
- Jangan commit berkas data. Simpan hasil di folder sementara atau di luar repo.
- Keluaran adalah **usulan**. Jangan menyatakan stok "pasti habis" atau "aman" tanpa menyebut data dan asumsinya.
- **Narkotika, psikotropika, prekursor farmasi, dan obat-obat tertentu** dianalisis terpisah. Jangan membuat usulan pemesanan otomatis atau saran penyesuaian selisih untuk golongan ini; tandai untuk penanganan apoteker sesuai ketentuan yang berlaku.
- Jangan menyarankan menjual obat mendekati atau melewati kedaluwarsa. Obat kedaluwarsa tidak boleh dijual; arahkan ke karantina, retur ke PBF bila memungkinkan, atau pemusnahan dengan berita acara sesuai ketentuan.

## Alur kerja

### 1. Klarifikasi
Tujuan (pemesanan minggu ini, bersih-bersih ED, opname), periode data penjualan yang dipakai, lead time dan syarat tiap PBF (waktu kirim, minimum order, tempo bayar), kebijakan retur ED PBF, anggaran pembelian, kapasitas penyimpanan, dan daftar barang berpantangan (rantai dingin, golongan khusus).

### 2. Profil dan pemetaan kolom

| Kanonik | Keterangan |
|---|---|
| sku / nama_barang | Produk (dan satuan: strip, botol, tablet) |
| golongan | Bebas, bebas terbatas, keras, narkotika, psikotropika, alkes, suplemen |
| stok_saat_ini | Per batch bila tersedia |
| batch dan tgl_kedaluwarsa | Wajib untuk analisis ED |
| penjualan_harian atau riwayat_penjualan | Dasar permintaan |
| harga_beli | Untuk nilai persediaan |
| pemasok | PBF dan lead time |

Pemeriksaan kualitas: stok negatif, batch tanpa ED, satuan tidak konsisten (box vs strip), duplikasi SKU, penjualan tanpa stok awal. Laporkan jumlah dan cara penanganannya; jangan membuang data diam-diam.

### 3. Rumus inti

| Konsep | Rumus |
|---|---|
| Permintaan rata-rata harian (d) | Total terjual ÷ jumlah hari dengan stok tersedia |
| Simpangan baku permintaan harian (σd) | Simpangan baku penjualan harian |
| Safety stock | z × σd × √LT (LT = lead time, hari). z = 1,65 untuk target layanan 95%; konfirmasi target layanan ke pengguna |
| Titik pemesanan ulang (ROP) | d × LT + safety stock |
| Stok maksimum | ROP + kuantitas pesan (atau d × siklus pemesanan) |
| Kuantitas pesan usulan | max(0, stok maksimum − stok tersedia − pesanan dalam perjalanan), dibulatkan ke kelipatan kemasan dan minimum order |
| Hari persediaan (DOI) | Stok ÷ d |
| Perputaran persediaan | HPP periode ÷ rata-rata nilai persediaan |
| Nilai persediaan | Σ(stok × harga_beli) |
| EOQ (opsional) | √(2 × D × S ÷ H); D permintaan tahunan, S biaya sekali pesan, H biaya simpan per unit per tahun |

Penyesuaian: item musiman atau baru dengan riwayat pendek dihitung terpisah dan ditandai "data tidak cukup"; jangan memaksakan rumus. Penjualan saat stok kosong menyebabkan permintaan terhitung terlalu rendah; sebutkan koreksinya jika data kekosongan tersedia.

### 4. Klasifikasi dan paket analisis

1. **Peringatan kedaluwarsa (FEFO).** Kelompokkan batch menurut sisa waktu sampai ED. Usulan awal: sudah lewat ED, ≤ 3 bulan, 4–6 bulan, 7–12 bulan, > 12 bulan. Sesuaikan dengan syarat retur PBF yang sebenarnya. Untuk tiap kelompok beri tindakan: karantina, retur ke PBF, jual lebih dulu lewat FEFO (hanya yang belum kedaluwarsa dan masih patut), atau pemusnahan.
2. **Cepat, lambat, mati.** Berdasarkan DOI dan hari sejak penjualan terakhir. Ambang (mis. tanpa penjualan selama N hari) adalah usulan; tanyakan ke pengguna. Hitung nilai modal yang tertahan pada barang lambat dan mati.
3. **Risiko kekosongan.** Barang kelas A atau penting klinis dengan stok < ROP; urutkan menurut DOI terkecil.
4. **Usulan pemesanan per PBF.** Tabel: SKU, stok, ROP, jumlah usulan, pembulatan kemasan, estimasi nilai, tempo bayar. Beri total per PBF agar bisa dibandingkan terhadap anggaran.
5. **Barang khusus.** Daftar terpisah untuk golongan narkotika, psikotropika, prekursor, dan barang rantai dingin: hanya status dan catatan, tanpa usulan otomatis.
6. **Stock opname.** Bandingkan stok sistem dan fisik per SKU atau batch. Laporkan selisih unit dan nilai, daftar selisih terbesar, dan pola (satuan salah, input terlambat, retur belum dicatat). Sarankan penyelidikan sebelum penyesuaian; jangan menyarankan "ratakan angka" tanpa penjelasan.

### 5. Format keluaran
- Ringkasan dalam Markdown (Ringkasan, Analisis, Rekomendasi, Langkah, Risiko).
- Bila diminta berkas, buat xlsx lewat skill `xlsx` dengan rumus hidup dan sheet "Asumsi" (lead time, z, ambang ED, ambang barang mati) yang bisa diubah pengguna.
- Sebutkan berkas sumber, tanggal data, dan jumlah baris yang dihitung.

## Aturan interpretasi

- Rumus di atas bergantung pada asumsi distribusi yang sederhana. Untuk permintaan sangat sporadis, tampilkan rentang dan nilai kehati-hatian, bukan satu angka yang tampak pasti.
- Jangan menyarankan menimbun stok karena potongan harga tanpa menghitung risiko ED dan modal tertahan.
- Jangan menyarankan substitusi obat. Itu keputusan apoteker.
- Pertimbangkan kualitas penyimpanan: suhu, kelembapan, dan segregasi obat mirip nama/rupa (LASA). Itu di luar data tetapi relevan untuk risiko.

## Pemeriksaan sebelum menyerahkan

- [ ] Masalah kualitas data dilaporkan
- [ ] Parameter (lead time, z, ambang) tertulis sebagai asumsi dan bisa diubah
- [ ] Barang khusus tidak ikut usulan otomatis
- [ ] Tidak ada saran menjual barang kedaluwarsa
- [ ] Nilai total usulan per PBF dibandingkan dengan anggaran bila diketahui
- [ ] Tidak ada berkas data di dalam repo
