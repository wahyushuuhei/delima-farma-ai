// Shared Supabase client loader. Static site (no build step), jadi
// @supabase/supabase-js dimuat dari CDN sebagai ESM module.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cfg = window.__DELIMA_KONSULTASI_CONFIG__ || {};

export const configReady = Boolean(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);

export const supabase = configReady
  ? createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY)
  : null;

export function requireConfig() {
  if (!configReady) {
    throw new Error(
      "Supabase belum dikonfigurasi (assets/config.js kosong). " +
        "Isi SUPABASE_URL & SUPABASE_ANON_KEY dari project Supabase konsultasi (Project B)."
    );
  }
  return supabase;
}
