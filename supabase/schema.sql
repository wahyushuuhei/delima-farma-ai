-- ============================================================================
-- Delima Farma AI Consultation — Supabase schema (Project B, TERPISAH TOTAL
-- dari Supabase project POS/Stok Apotek Delima Farma).
--
-- Jalankan file ini di SQL Editor project Supabase BARU (bukan project POS).
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- consultations: satu baris per sesi konsultasi (intake terstruktur)
-- ----------------------------------------------------------------------------
create table if not exists consultations (
  id uuid primary key default gen_random_uuid(),
  -- token acak untuk akses balik oleh pasien (link /status/{token}) — tidak
  -- pernah ditebak dari id yang berurutan
  access_token text unique not null default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now(),

  -- data intake terstruktur (lihat §1 & §4A spec)
  nama_pasien text,
  no_hp_pasien text,
  keluhan_utama text not null,
  durasi_keluhan text,
  gejala_penyerta text,
  kondisi_khusus jsonb default '{}'::jsonb, -- { hamil, menyusui, penyakit_kronis, alergi_obat }

  -- hasil deteksi red flag & kategorisasi
  is_red_flag boolean not null default false,
  red_flag_reason text,
  kategori text not null default 'umum'
    check (kategori in ('umum', 'proktologi_bedah', 'lainnya')),

  -- status review berlapis
  status text not null default 'baru'
    check (status in ('baru', 'direview_apoteker', 'dieskalasi_dokter', 'selesai', 'red_flag_darurat')),
  reviewed_by text check (reviewed_by in ('apoteker', 'dokter')),
  jawaban text,
  reviewed_at timestamptz
);

create index if not exists idx_consultations_status on consultations (status);
create index if not exists idx_consultations_created_at on consultations (created_at desc);

-- ----------------------------------------------------------------------------
-- consultation_messages: log percakapan (kalau ada tanya-jawab lanjutan)
-- ----------------------------------------------------------------------------
create table if not exists consultation_messages (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid not null references consultations(id) on delete cascade,
  sender text not null check (sender in ('pasien', 'apoteker', 'dokter', 'sistem')),
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_consultation_messages_consultation_id
  on consultation_messages (consultation_id);

-- ----------------------------------------------------------------------------
-- red_flag_rules: daftar kata kunci red flag dikelola sebagai DATA, bukan
-- hardcode di kode — supaya dr. Wahyu bisa update tanpa deploy ulang.
-- Diisi awal dari draft di CLINICAL_SAFETY.md (lihat seed di bawah).
-- WAJIB direview & difinalisasi oleh dr. Wahyu sebelum go-live (lihat catatan
-- di seed data).
-- ----------------------------------------------------------------------------
create table if not exists red_flag_rules (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
--
-- Prinsip: publik (anon, dipakai pelanggan) HANYA BOLEH INSERT konsultasi baru
-- dan membaca daftar red_flag_rules aktif (untuk deteksi red flag di
-- browser). TIDAK PERNAH boleh SELECT tabel consultations secara langsung —
-- itu akan membuka enumerasi seluruh data pasien lewat anon key. Cek status
-- per-pasien dilakukan lewat function get_consultation_status() di bawah,
-- yang hanya mengembalikan SATU baris yang cocok dengan token, bukan lewat
-- policy RLS bersyarat token (rawan salah konfigurasi).
--
-- Staff (apoteker/dokter) login via Supabase Auth biasa (role Postgres
-- `authenticated`) dan dapat akses penuh — di versi ini hanya apoteker yang
-- benar-benar login ke dashboard (dokter menerima info via WA manual, sesuai
-- §4C spec), jadi tidak perlu tabel role terpisah untuk v1.
-- ============================================================================

alter table consultations enable row level security;
alter table consultation_messages enable row level security;
alter table red_flag_rules enable row level security;

-- --- consultations ---

drop policy if exists "anon can insert consultation" on consultations;
create policy "anon can insert consultation"
  on consultations for insert
  to anon
  with check (true);

-- Sengaja TIDAK ADA policy SELECT/UPDATE/DELETE untuk anon di sini.
-- Akses baca oleh pasien HANYA lewat function get_consultation_status().

drop policy if exists "staff full access consultations" on consultations;
create policy "staff full access consultations"
  on consultations for all
  to authenticated
  using (true)
  with check (true);

-- --- consultation_messages ---

drop policy if exists "anon can insert message" on consultation_messages;
create policy "anon can insert message"
  on consultation_messages for insert
  to anon
  with check (true);

drop policy if exists "staff full access messages" on consultation_messages;
create policy "staff full access messages"
  on consultation_messages for all
  to authenticated
  using (true)
  with check (true);

-- --- red_flag_rules ---

drop policy if exists "anon can read active rules" on red_flag_rules;
create policy "anon can read active rules"
  on red_flag_rules for select
  to anon
  using (active = true);

drop policy if exists "staff full access rules" on red_flag_rules;
create policy "staff full access rules"
  on red_flag_rules for all
  to authenticated
  using (true)
  with check (true);

-- ============================================================================
-- FUNCTION: get_consultation_status
--
-- Satu-satunya jalan pasien membaca statusnya sendiri. SECURITY DEFINER supaya
-- bisa baca tabel consultations walau anon tidak punya SELECT langsung, tapi
-- hanya mengembalikan kolom yang aman ditampilkan ke pasien (tidak termasuk
-- no_hp_pasien pasien lain, dll — toh cuma 1 baris yang cocok token).
-- Kalau token salah/tidak ada, hasilnya kosong (bukan error, supaya tidak
-- membocorkan info token mana yang valid).
-- ============================================================================

create or replace function get_consultation_status(p_token text)
returns table (
  status text,
  kategori text,
  is_red_flag boolean,
  jawaban text,
  reviewed_at timestamptz,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select status, kategori, is_red_flag, jawaban, reviewed_at, created_at
  from consultations
  where access_token = p_token
  limit 1;
$$;

revoke all on function get_consultation_status(text) from public;
grant execute on function get_consultation_status(text) to anon, authenticated;

-- ============================================================================
-- SEED: draft red_flag_rules dari CLINICAL_SAFETY.md
-- ⚠️ DRAFT AWAL — WAJIB direview & difinalisasi oleh dr. Wahyu sebelum
-- go-live (khususnya kriteria proktologi/bedah). Jangan anggap daftar ini
-- final/aman dipakai produksi tanpa review klinis.
-- ============================================================================

insert into red_flag_rules (keyword, description) values
  ('nyeri dada', 'Kardiovaskular — nyeri dada, terutama menjalar ke lengan/rahang'),
  ('sesak napas', 'Pernapasan — sesak napas berat atau mendadak'),
  ('jantung berdebar', 'Kardiovaskular — berdebar sangat cepat disertai pusing/pingsan'),
  ('penurunan kesadaran', 'Neurologis — penurunan kesadaran atau bingung mendadak'),
  ('bicara pelo', 'Neurologis — tanda stroke'),
  ('wajah mencong', 'Neurologis — tanda stroke'),
  ('kelemahan satu sisi', 'Neurologis — tanda stroke'),
  ('kejang', 'Neurologis — kejang'),
  ('sakit kepala hebat mendadak', 'Neurologis — seperti disambar petir'),
  ('perdarahan tidak berhenti', 'Perdarahan & trauma — perdarahan aktif tidak berhenti'),
  ('muntah darah', 'Perdarahan & trauma — BAB berdarah masif atau muntah darah'),
  ('bab berdarah masif', 'Perdarahan & trauma / Proktologi — BAB berdarah masif atau terus-menerus'),
  ('kecelakaan', 'Perdarahan & trauma — cedera signifikan'),
  ('demam tinggi bayi', 'Demam & infeksi — demam tinggi pada bayi < 6 bulan'),
  ('kaku kuduk', 'Demam & infeksi — demam tinggi disertai kaku kuduk'),
  ('ruam cepat menyebar', 'Demam & infeksi — tanda sepsis'),
  ('nyeri perut hebat mendadak', 'Proktologi/Bedah — nyeri perut hebat mendadak'),
  ('benjolan anus nyeri', 'Proktologi/Bedah — benjolan anus sangat nyeri, membesar cepat, curiga abses'),
  ('keringat dingin', 'Tanda syok — pucat, lemas, keringat dingin')
on conflict do nothing;

-- Kondisi khusus (hamil, menyusui, riwayat kronis, alergi obat) TIDAK
-- dideteksi lewat keyword — itu ditangani lewat field kondisi_khusus di form
-- intake, dan SELALU dipaksa ke review manusia di kode aplikasi (bukan
-- red flag IGD, tapi tetap tidak boleh lewat jalur otomatis).
