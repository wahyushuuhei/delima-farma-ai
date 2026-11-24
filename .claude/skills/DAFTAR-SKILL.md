# Daftar Skill Terpasang — Delima Farma AI

Cara memanggil: ketik **`/nama-skill`** lalu tuliskan permintaan dengan kalimat biasa. Contoh: `/delima-stock cek obat yang kedaluwarsa 6 bulan ke depan`.

Status uji: semua 15 skill diuji di sesi Claude Code yang benar-benar baru. Perintah `/nama` bekerja untuk 15 dari 15 skill. Pemicu otomatis (tanpa `/`, cukup menulis permintaan) lolos untuk `carousel`, `ig-reel`, `delima-sales`, `delima-stock`, `delima-audit` pada model Sonnet, tetapi tidak selalu pada model kecil. **Untuk hasil paling pasti, selalu mulai dengan `/nama`.**

## Konten media sosial (khusus akun Apotek Delima Farma)

| Perintah | Untuk apa | Contoh (salin dan ubah) |
|---|---|---|
| `/carousel` | Carousel Instagram/Facebook 4:5, dari naskah berrujukan sampai PNG | `/carousel Topik: cara menyimpan obat di rumah. 8 slide, untuk ibu rumah tangga.` |
| `/ig-reel` | Naskah Reels, shot list, caption | `/ig-reel Reel 30 detik: 3 kesalahan saat minum obat. Pembawa: apoteker.` |
| `/content-strategy` | Pilar, kalender 4 minggu, KPI | `/content-strategy Buat kalender konten 4 minggu. Kami hanya bisa posting 3 kali seminggu.` |

Aturan tetap: tidak ada data pasien, tidak ada janji sembuh, tidak mempromosikan obat keras/resep, dan **tidak ada yang diposting atau dijadwalkan tanpa Anda mengetik "setuju"**. Konten pribadi dr. Wahyu (proktologi/bedah/PBPI) memakai skill terpisah di akun Anda (`carousel-edukasi-dr-wahyu`), bukan skill di atas. Username media sosial tidak pernah ditebak; hanya dipakai bila Anda menyebutkannya.

## Operasional apotek (bekerja dari berkas yang Anda lampirkan)

| Perintah | Untuk apa | Contoh | Berkas yang diperlukan |
|---|---|---|---|
| `/delima-sales` | Omzet, margin, produk terlaris, ABC, tren | `/delima-sales Analisis penjualan bulan lalu: produk terlaris dan margin.` | Ekspor penjualan POS (CSV/XLSX) |
| `/delima-stock` | Stok minimum, reorder, kedaluwarsa (ED), opname | `/delima-stock Cek obat yang kedaluwarsa dalam 6 bulan dan buat usulan pesanan.` | Ekspor stok (dengan batch dan ED) |
| `/delima-finance` | Laba rugi, arus kas, hutang PBF, harga | `/delima-finance Buat laba rugi bulan ini dan jadwal bayar hutang PBF.` | Rekap pemasukan, biaya, faktur PBF |
| `/delima-audit` | Audit kepatuhan, stok-kas, keamanan aplikasi | `/delima-audit Audit kepatuhan penyimpanan obat pakai checklist.` | Tidak wajib; bukti diminta bertahap |
| `/delima-marketing` | Strategi pemasaran dan rencana 30/60/90 hari | `/delima-marketing Susun rencana 90 hari untuk menaikkan pelanggan ulang.` | Tidak wajib |

Sebelum melampirkan berkas: hapus kolom nama pasien, nomor telepon, dan nomor resep. Jangan melampirkan data bank atau kata sandi.

## Dokumen, PDF, spreadsheet, presentasi, desain (resmi Anthropic)

| Perintah | Untuk apa | Contoh |
|---|---|---|
| `/xlsx` | Buat atau rapikan spreadsheet dengan rumus | `/xlsx Ubah stok.csv jadi spreadsheet rapi dengan total per kategori.` |
| `/pdf` | Gabung, pisah, baca, isi formulir PDF | `/pdf Gabungkan tiga PDF ini jadi satu.` |
| `/docx` | Dokumen Word (SOP, surat, laporan) | `/docx Buat SOP penerimaan barang dari PBF dalam Word.` |
| `/pptx` | Presentasi | `/pptx Buat 8 slide pelatihan staf tentang FEFO.` |
| `/canvas-design` | Poster/visual statis PNG atau PDF | `/canvas-design Poster A4 "Cuci tangan 6 langkah" untuk dipasang di apotek.` |
| `/theme-factory` | Tema warna dan font untuk dokumen/slide | `/theme-factory Terapkan tema hijau ke presentasi ini.` |
| `/frontend-design` | Panduan desain tampilan aplikasi | `/frontend-design Usulkan perbaikan tampilan halaman status konsultasi.` (perubahan kode tetap butuh persetujuan Anda) |

## Memilih cepat

- Mau **membuat konten** → `/carousel` atau `/ig-reel`; bingung harus posting apa → `/content-strategy`.
- Mau **angka dari kasir** → `/delima-sales` (penjualan) atau `/delima-stock` (stok).
- Mau **uang** → `/delima-finance`.
- Mau **cek kelemahan** → `/delima-audit`.
- Mau **rencana tumbuh** → `/delima-marketing`.
- Mau **file jadi** (Excel, Word, PDF, slide, poster) → `/xlsx`, `/docx`, `/pdf`, `/pptx`, `/canvas-design`.

Skill bisa digabung dalam satu permintaan: `/delima-sales analisis penjualan bulan lalu, lalu hasilnya jadikan Excel`.
