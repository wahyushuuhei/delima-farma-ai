# Panduan Singkat dari HP

Tidak perlu coding. Cukup ketik satu perintah pendek.

## 1. Mulai
1. Buka aplikasi Claude di HP (atau claude.ai/code di browser HP), masuk ke bagian **Claude Code**, lalu mulai sesi baru. Nama menu bisa sedikit berbeda antar versi aplikasi.
2. Pilih repositori **delima-farma-ai**.
3. Pilih branch: **`ccr-b42eac8f-feas5l`** selama skill belum digabung ke `master`. Setelah Anda menyetujui merge, pakai `master`.

Skill hanya muncul pada branch yang berisi folder `.claude/skills`. Bila perintah tidak dikenali, hampir selalu penyebabnya branch yang salah atau sesi lama. Mulai sesi baru di branch yang benar.

## 2. Ketik perintah
Pola: **`/nama-skill`** + permintaan biasa.

| Mau apa | Ketik |
|---|---|
| Carousel Instagram | `/carousel Topik: cara menyimpan obat di rumah, 8 slide` |
| Naskah Reels | `/ig-reel Reel 30 detik: 3 kesalahan saat minum obat` |
| Kalender konten | `/content-strategy Kalender 4 minggu, posting 3 kali seminggu` |
| Analisis penjualan | `/delima-sales Analisis penjualan bulan lalu` (lampirkan file) |
| Cek stok dan ED | `/delima-stock Obat yang kedaluwarsa 6 bulan ke depan` (lampirkan file) |
| Laporan keuangan | `/delima-finance Laba rugi bulan ini` (lampirkan file) |
| Audit | `/delima-audit Audit penyimpanan obat` |
| Rencana pemasaran | `/delima-marketing Rencana 90 hari naikkan pelanggan ulang` |
| File Excel/Word/PDF/slide | `/xlsx`, `/docx`, `/pdf`, `/pptx` + permintaan |

Daftar lengkap dengan contoh: `DAFTAR-SKILL.md` (satu folder dengan berkas ini).

## 3. Melampirkan berkas
- Ekspor dari kasir/POS (CSV atau Excel), lalu lampirkan lewat tombol lampiran di kolom chat.
- **Sebelum melampirkan:** hapus kolom nama pasien, nomor HP, dan nomor resep.
- Jangan pernah mengetik atau melampirkan kata sandi, kunci Supabase, atau data bank.

## 4. Menerima hasil
- Tulis: "kirimkan filenya ke saya". Hasil (PNG carousel, Excel, PDF) dikirim ke chat.
- Hasil tidak disimpan di repositori. Simpan sendiri di HP atau Drive Anda.

## 5. Aturan persetujuan
- Claude **tidak akan memposting, menjadwalkan, atau mengirim apa pun** sebelum Anda mengetik **"setuju"**.
- Untuk konten, Anda akan diminta menyetujui naskah dulu, lalu pratinjau, baru ekspor.
- Menggabungkan perubahan ke aplikasi (merge) atau deploy ke produksi selalu menunggu persetujuan Anda.

## 6. Tips agar hasil bagus
- Tulis tujuan, bukan teknis: "Saya mau tahu obat apa yang harus dipesan minggu ini."
- Satu permintaan per pesan. Jawab pertanyaan Claude dengan singkat.
- Bila hasil kurang pas, ketik apa yang ingin diubah: "slide 3 terlalu panjang."

## 7. Konten pribadi dr. Wahyu
Untuk carousel atau konten pribadi dr. Wahyu (proktologi/bedah/PBPI), pakai skill pribadi di akun Anda (`carousel-edukasi-dr-wahyu`). Perintah `/carousel` di atas hanya untuk akun Apotek Delima Farma.
