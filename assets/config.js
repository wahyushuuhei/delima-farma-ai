// Konfigurasi publik untuk Delima Farma AI Consultation.
//
// PENTING: ini menunjuk ke Supabase project KHUSUS untuk konsultasi
// (Project B), TERPISAH TOTAL dari Supabase project POS/Stok Apotek Delima
// Farma. Jangan pernah isi nilai dari project POS di sini, atau sebaliknya.
//
// SUPABASE_ANON_KEY aman ditaruh di client — ini kunci publik "anon", akses
// sebenarnya dikontrol oleh Row Level Security (lihat supabase/schema.sql).
// Jangan pernah taruh service_role key di sini.
//
// TODO: isi setelah Supabase project B dibuat (Project Settings → API).
window.__DELIMA_KONSULTASI_CONFIG__ = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
};
