# Project Skills — Delima Farma AI

Folder ini berisi Agent Skills untuk Claude Code di proyek ini (`.claude/skills/<nama>/SKILL.md`, format standar Agent Skills). Claude memuat skill saat sesi dimulai dan memakainya bila deskripsinya cocok dengan tugas.

Folder `.claude/` dikecualikan dari deploy Vercel lewat `.vercelignore`, supaya skill internal tidak terbuka sebagai file statis publik. Ini upaya terbaik dan **belum diverifikasi di produksi**: setelah deploy berikutnya, buka `/.claude/skills/README.md` di domain produksi dan pastikan hasilnya 404.

## Inventaris

### A. Skill resmi Anthropic (salinan verbatim, Apache-2.0)

Sumber: <https://github.com/anthropics/skills>, commit `e4bb5d960d87126ff3b3a8af1a104b7db67560ba` (2026-11-16). Tidak ada berkas yang diubah; diverifikasi identik byte-per-byte. Tiap folder menyertakan `LICENSE.txt` asli. Pemberitahuan pihak ketiga ada di `THIRD_PARTY_NOTICES.md`.

| Skill | Kegunaan | Kebutuhan runtime |
|---|---|---|
| `xlsx` | Buat/edit spreadsheet, rumus hidup, hitung ulang | Python (openpyxl, pandas), LibreOffice |
| `pdf` | Baca, gabung, pisah, isi formulir, OCR PDF | Python (pypdf dll.), qpdf/poppler |
| `docx` | Dokumen Word, komentar, track changes | Node (`docx`), Python, LibreOffice |
| `pptx` | Presentasi | Node (`pptxgenjs`), Python, LibreOffice |
| `frontend-design` | Panduan desain UI | — |
| `canvas-design` | Poster/visual statis PNG/PDF (membawa 54 font OFL) | Python |
| `theme-factory` | Tema warna/font untuk slide, dokumen, halaman | — |

Tidak dipasang (di luar permintaan atau tidak relevan): `brand-guidelines` (merek Anthropic), `internal-comms`, `claude-api`, `mcp-builder`, `slack-gif-creator`, `web-artifacts-builder`, `webapp-testing`, `algorithmic-art`, `doc-coauthoring`, `skill-creator`, `academy-guide`, `discernment-nudge`.

### B. Skill custom Delima Farma

| Skill | Fungsi |
|---|---|
| `ig-reel` | Naskah, shot list, caption, dan paket produksi Reels |
| `carousel` | Carousel 4:5 (template HTML + ekspor PNG teruji) |
| `content-strategy` | Pilar, kalender, KPI, evaluasi konten |
| `delima-sales` | Analisis penjualan dari ekspor POS |
| `delima-stock` | Stok, ROP, ED/FEFO, usulan pesanan, opname |
| `delima-audit` | Audit operasional, stok-kas, keamanan aplikasi |
| `delima-finance` | Laba rugi, arus kas, hutang PBF, margin |
| `delima-marketing` | Strategi pemasaran apotek yang patuh etika |

Skill custom bersifat internal dan tidak membawa data apa pun. Skill `delima-sales/stock/finance/audit` bekerja dari berkas yang diberikan pengguna saat sesi; tidak ada koneksi ke database POS.

## Aturan data (berlaku untuk semua skill)

- Jangan menaruh data pasien, ekspor POS, data keuangan, atau kredensial di repo ini.
- Hasil kerja (laporan, PNG, xlsx) disimpan di luar repo atau di `out/` (diabaikan git).
- Kunci `service_role` tidak boleh ada di klien atau repo. Kunci `anon`/publishable memang publik.
- Pembacaan database produksi hanya atas permintaan eksplisit dan hanya baca.

## Hasil review keamanan skill upstream

Dilakukan sebelum pemasangan terhadap 7 skill upstream:

| Pemeriksaan | Hasil |
|---|---|
| Panggilan jaringan keluar (`requests`, `urllib`, `curl`, `wget`, `fetch`, soket TCP) | Tidak ada |
| `eval`, `exec`, `os.system`, `pickle`, `base64` decode, `shell=True` | Tidak ada |
| `subprocess` | Hanya memanggil `soffice` (LibreOffice) dan `python` lokal untuk konversi/hitung ulang |
| `soffice.py` (shim C dengan `LD_PRELOAD`) | Ditinjau manual. Hanya dikompilasi bila soket AF_UNIX diblokir, hanya di-preload ke proses `soffice`, tanpa jaringan |
| Unicode tersembunyi/bidi di teks | Tidak ada |
| Frasa prompt-injection di `SKILL.md`/referensi | Tidak ada |
| PDF biner `theme-showcase.pdf` | Tanpa `/JavaScript`, `/OpenAction`, `/Launch`, `/EmbeddedFile` |
| Berkas biner lain | 54 font TTF (OFL) di `canvas-design`; skema XSD teks |
| Lisensi | Semua Apache-2.0, `LICENSE.txt` disertakan |

Catatan: skill upstream mengasumsikan paket `openpyxl`, `pandas`, `docx`, `pptxgenjs`, `pypdf`, dan LibreOffice tersedia di lingkungan.

Skill custom ditinjau terhadap hal yang sama dan dipindai untuk rahasia (JWT, kunci, URL proyek Supabase), nomor telepon, dan pola data pribadi: tidak ada.

## Memperbarui skill upstream

1. Klon `https://github.com/anthropics/skills` ke folder sementara di luar repo.
2. Ulangi pemeriksaan keamanan di atas pada commit baru dan baca perbedaan (`diff -r`).
3. Salin hanya folder yang dibutuhkan, perbarui commit di README ini, dan buka PR untuk ditinjau.

## Menambah skill baru

Buat `.claude/skills/<nama-huruf-kecil-dengan-strip>/SKILL.md` dengan frontmatter `name` (sama dengan nama folder) dan `description` (apa yang dilakukan dan kapan dipakai, maks 1024 karakter). Jaga `SKILL.md` di bawah sekitar 500 baris dan pindahkan detail ke `references/`.
