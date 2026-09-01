// Deteksi red flag — rule-based, dikelola sebagai data (tabel red_flag_rules),
// BUKAN keputusan bebas model AI, supaya predictable & mudah diaudit.
//
// ⚠️ DAFTAR INI ADALAH DRAFT AWAL (sumber: CLINICAL_SAFETY.md) — WAJIB
// direview & difinalisasi oleh dr. Wahyu sebelum go-live produksi.
//
// Prinsip fail-safe: kalau fetch ke Supabase gagal (mis. sedang offline),
// tetap pakai daftar lokal di bawah supaya deteksi red flag TIDAK PERNAH
// bergantung sepenuhnya pada koneksi jaringan.

import { supabase, configReady } from "./supabase-client.js";

export const LOCAL_FALLBACK_RULES = [
  { keyword: "nyeri dada", description: "Kardiovaskular — nyeri dada, terutama menjalar ke lengan/rahang" },
  { keyword: "sesak napas", description: "Pernapasan — sesak napas berat atau mendadak" },
  { keyword: "jantung berdebar", description: "Kardiovaskular — berdebar sangat cepat disertai pusing/pingsan" },
  { keyword: "penurunan kesadaran", description: "Neurologis — penurunan kesadaran atau bingung mendadak" },
  { keyword: "bicara pelo", description: "Neurologis — tanda stroke" },
  { keyword: "wajah mencong", description: "Neurologis — tanda stroke" },
  { keyword: "kelemahan satu sisi", description: "Neurologis — tanda stroke" },
  { keyword: "kejang", description: "Neurologis — kejang" },
  { keyword: "sakit kepala hebat mendadak", description: "Neurologis — seperti disambar petir" },
  { keyword: "perdarahan tidak berhenti", description: "Perdarahan & trauma — perdarahan aktif tidak berhenti" },
  { keyword: "muntah darah", description: "Perdarahan & trauma — muntah darah" },
  { keyword: "bab berdarah masif", description: "Proktologi — BAB berdarah masif/terus-menerus" },
  { keyword: "kecelakaan", description: "Trauma — cedera signifikan" },
  { keyword: "demam tinggi bayi", description: "Demam & infeksi — demam tinggi pada bayi < 6 bulan" },
  { keyword: "kaku kuduk", description: "Demam & infeksi — demam tinggi disertai kaku kuduk" },
  { keyword: "ruam cepat menyebar", description: "Demam & infeksi — tanda sepsis" },
  { keyword: "nyeri perut hebat mendadak", description: "Proktologi/Bedah — nyeri perut hebat mendadak" },
  { keyword: "benjolan anus nyeri", description: "Proktologi/Bedah — benjolan anus nyeri, membesar cepat, curiga abses" },
  { keyword: "keringat dingin", description: "Tanda syok — pucat, lemas, keringat dingin" },
];

// Kata kunci untuk kategorisasi proktologi/bedah (bukan red flag, cuma
// routing ke L2/dr. Wahyu vs L1/apoteker umum).
export const PROKTOLOGI_KEYWORDS = [
  "wasir", "ambeien", "ambeyen", "hemoroid", "anus", "dubur",
  "bab berdarah", "fisura", "abses", "benjolan anus", "prolaps",
];

let cachedRules = null;

export async function loadActiveRules() {
  if (cachedRules) return cachedRules;
  if (!configReady || !supabase) {
    cachedRules = LOCAL_FALLBACK_RULES;
    return cachedRules;
  }
  try {
    const { data, error } = await supabase
      .from("red_flag_rules")
      .select("keyword, description")
      .eq("active", true);
    if (error || !data || data.length === 0) {
      cachedRules = LOCAL_FALLBACK_RULES;
    } else {
      cachedRules = data;
    }
  } catch (_err) {
    // Offline / network gagal — fallback ke daftar lokal, jangan pernah
    // biarkan deteksi red flag gagal total karena tidak ada koneksi.
    cachedRules = LOCAL_FALLBACK_RULES;
  }
  return cachedRules;
}

function normalize(text) {
  return (text || "").toLowerCase();
}

export async function detectRedFlag(text) {
  const rules = await loadActiveRules();
  const normalized = normalize(text);
  for (const rule of rules) {
    if (normalized.includes(rule.keyword.toLowerCase())) {
      return { isRedFlag: true, reason: rule.description || rule.keyword };
    }
  }
  return { isRedFlag: false, reason: null };
}

export function detectKategori(text) {
  const normalized = normalize(text);
  const hit = PROKTOLOGI_KEYWORDS.some((kw) => normalized.includes(kw));
  return hit ? "proktologi_bedah" : "umum";
}
