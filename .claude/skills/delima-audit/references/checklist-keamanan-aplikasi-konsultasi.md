# Checklist keamanan dan privasi: aplikasi Delima Farma AI Consultation

Cakupan: aplikasi web statis (PWA) di Vercel dengan backend Supabase "Project B" yang terpisah total dari Supabase POS/Stok. Aplikasi menyimpan data kesehatan pasien (keluhan, nomor telepon, kondisi khusus), yaitu data pribadi yang sensitif.

Aturan audit: hanya baca. Jangan menjalankan SQL yang menulis, jangan memakai kunci `service_role`, jangan menambahkan kunci ke berkas, dan jangan mencetak isi konfigurasi rahasia ke laporan. Kunci `anon`/publishable memang publik, tetapi tidak perlu disalin ke laporan.

## 1. Rahasia dan konfigurasi

| # | Periksa | Cara |
|---|---|---|
| 1.1 | Tidak ada kunci `service_role`, kata sandi, atau token privat di berkas atau riwayat git | Cari di HEAD dan seluruh riwayat (`git log --all -p`) untuk JWT dan kata `service_role`; decode hanya klaim `role` |
| 1.2 | Konfigurasi klien hanya berisi URL dan kunci publik (anon/publishable) | Baca `assets/config.js` |
| 1.3 | Proyek Supabase konsultasi tidak berbagi kunci dengan proyek POS | Bandingkan referensi proyek, bukan nilai kunci |
| 1.4 | Berkas rahasia (`.env*`, `.claude/settings.local.json`) ada di `.gitignore` | Baca `.gitignore` |
| 1.5 | Folder internal (`.claude`) tidak ikut terpublikasi sebagai file statis | Pastikan `.vercelignore` ada; setelah deploy, URL `/.claude/skills/...` harus 404 |

## 2. Database dan Row Level Security (RLS)

| # | Periksa | Cara |
|---|---|---|
| 2.1 | RLS aktif pada semua tabel di skema `public` | `select tablename, rowsecurity from pg_tables where schemaname='public'` |
| 2.2 | Peran `anon` hanya punya `INSERT` pada `consultations` dan `consultation_messages`, dan `SELECT` pada `red_flag_rules` aktif | `select * from pg_policies` |
| 2.3 | `anon` tidak bisa membaca atau mengubah baris konsultasi | Coba lewat klien anon di lingkungan uji, bukan produksi |
| 2.4 | Fungsi `SECURITY DEFINER` mengatur `search_path` dan hanya mengembalikan kolom aman | Baca definisi fungsi |
| 2.5 | Token akses acak dan cukup panjang; tidak bisa ditebak dari id | Baca pembuatan token di klien |
| 2.6 | **Peran `authenticated` punya akses penuh. Apakah pendaftaran mandiri (sign-up) dinonaktifkan dan hanya akun staf yang ada?** | Periksa pengaturan Auth Supabase dan daftar pengguna. Jika sign-up terbuka, siapa pun bisa menjadi `authenticated` dan membaca semua data pasien |
| 2.7 | Akun staf memakai kata sandi kuat dan autentikasi dua langkah bila tersedia | Wawancara, pengaturan |
| 2.8 | Batasan ukuran dan format input di sisi database (panjang teks, `check`) | Baca skema |
| 2.9 | Ada pembatasan laju atau perlindungan bot untuk insert anonim | Periksa konfigurasi; insert anonim `with check (true)` rentan spam |

## 3. Aplikasi sisi klien

| # | Periksa | Cara |
|---|---|---|
| 3.1 | **Data pengguna tidak dimasukkan ke `innerHTML` tanpa escape** (XSS tersimpan, terutama di dasbor admin) | Cari `innerHTML`, `insertAdjacentHTML`, `document.write`; telusuri apakah nilai dari database di-escape. Prefer `textContent` atau pembuatan elemen |
| 3.2 | Token pada URL status tidak bocor lewat header Referer | Periksa kebijakan `Referrer-Policy` dan tautan keluar di halaman status |
| 3.3 | Header keamanan di hosting: CSP, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, HSTS | Baca `vercel.json` dan header hasil deploy |
| 3.4 | Halaman admin tidak terindeks | Cari `noindex` |
| 3.5 | Sesi admin punya batas waktu menganggur dan logout | Baca kode autentikasi |
| 3.6 | Service worker tidak menyimpan respons API atau URL ber-token | Baca `sw.js` |
| 3.7 | Nomor kontak dan konfigurasi bisnis di kode adalah milik bisnis, bukan pribadi | Baca kode |

## 4. Privasi dan siklus hidup data

| # | Periksa | Cara |
|---|---|---|
| 4.1 | Pasien diberi tahu apa yang dikumpulkan dan untuk apa, serta persetujuan dicatat | Baca alur formulir |
| 4.2 | Ada kebijakan masa simpan dan prosedur hapus atas permintaan | Kebijakan tertulis |
| 4.3 | Cadangan database dilindungi dan masa simpannya jelas | Pengaturan Supabase |
| 4.4 | Kondisi khusus (hamil, menyusui, kronis, alergi) selalu diarahkan ke tinjauan manusia | Baca logika aplikasi |
| 4.5 | Daftar kata kunci red flag ditinjau klinis dan berversi; kegagalan sistem mengarahkan pasien ke IGD | Wawancara dokter, baca alur |
| 4.6 | Prosedur insiden kebocoran data tertulis | SOP |

## Baseline temuan per commit `dea109f` (2026-11-24): verifikasi ulang sebelum dipakai

Hasil pemeriksaan awal kode. Statusnya perlu dikonfirmasi pada audit berikutnya karena kode berubah.

| ID | Temuan | Bukti | Risiko awal |
|---|---|---|---|
| B-1 | `admin.html` menyisipkan `keluhan_utama`, `nama_pasien`, `no_hp_pasien`, `gejala_penyerta`, `durasi_keluhan`, `red_flag_reason`, dan `jawaban` ke `innerHTML` tanpa escape (fungsi `renderList`). Karena `anon` boleh `INSERT` isi bebas, penyerang dapat menyisipkan skrip yang berjalan di sesi apoteker yang sedang login | `admin.html` sekitar baris 100–135; policy `anon can insert consultation` dengan `with check (true)` | Kritis |
| B-2 | Policy staf memberi akses penuh ke seluruh `authenticated`. Aman hanya bila pendaftaran mandiri Auth dinonaktifkan | `supabase/schema.sql` bagian RLS; status sign-up belum diverifikasi | Tinggi sampai terbukti sign-up tertutup |
| B-3 | Tidak ada header keamanan (CSP, `Referrer-Policy`, dll.) di `vercel.json`; URL status membawa token di query string | `vercel.json`, `status.html` | Sedang |
| B-4 | Insert anonim tidak dibatasi laju atau ukuran, membuka peluang spam dan penyalahgunaan penyimpanan | `supabase/schema.sql` | Sedang |
| B-5 | Tidak ditemukan kunci `service_role` atau JWT rahasia di riwayat git | Pemindaian riwayat | Baik |

Perbaikan atas temuan ini adalah perubahan aplikasi dan harus diminta serta disetujui secara terpisah.
