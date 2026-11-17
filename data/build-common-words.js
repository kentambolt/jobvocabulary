// Bygger kandidater til listen over almindelige ord (mål: 10.000) ud fra Wiktionary.
// Kør: sh data/fetch-wiktionary.sh   (henter og filtrerer Wiktionary-data til data/.cache/kaikki/)
//      sh data/fetch.sh              (frekvenskilderne, hvis de ikke allerede er hentet)
//      node data/build-common-words.js [antal lemmaer, standard 200] [spring de første N over]
//
// Output: data/.cache/common-words.candidates.jsonl (ikke i git). Kandidaterne skal kvalitetstjekkes,
// før de lægges i content/incoming/common-words.jsonl. Se content/incoming/common-words-report.md.
//
// Metode
//  1. Danske opslagsord (lemmaer) og deres bøjningsformer fra den danske del af engelsk Wiktionary.
//  2. Lemmaets frekvens = summen af formernes frekvens i de danske frekvenskilder (data/sources.js).
//     En form, der hører til flere lemmaer (fx "tog" = tog/tage), deles ligeligt mellem dem.
//  3. Betydninger: oversættelsestabellerne i engelsk Wiktionary. Hver tabel hører til én engelsk
//     betydning og har (ofte) dansk, russisk og ukrainsk i samme tabel, så de fire sprog deler betydning.
//  4. Krydstjek: en tabel bruges kun, hvis det engelske opslagsord også står i det danske opslags
//     glosser (begge retninger i Wiktionary er enige). Tabeller uden betydningsangivelse springes over.
//  5. Ord, der allerede er i appens kerneliste (words.js), springes over; deres id'er røres ikke.
//
// Licens: Wiktionary-indhold er CC BY-SA 4.0 (og GFDL). Udtræk: kaikki.org / wiktextract (Ylonen 2022).
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { loadAll } = require('./sources');

const CACHE = path.join(__dirname, '.cache');
const K = path.join(CACHE, 'kaikki');
const LIMIT = Number(process.argv[2] || 200);
const SKIP = Number(process.argv[3] || 0);
const MAX_SENSES = 4; // pr. lemma i et parti

const norm = (w) => w.toLowerCase();
const POS = { noun: 'noun', verb: 'verb', adj: 'adj', adv: 'adv', pron: 'pron', prep: 'prep', conj: 'conj', num: 'num', intj: 'intj', det: 'det', particle: 'particle' };
const BAD_TAGS = ['archaic', 'obsolete', 'dated', 'rare', 'vulgar', 'slang', 'derogatory', 'dialectal', 'regional', 'nonstandard', 'colloquial', 'informal', 'pre-reform'];

// --- 1. Danske lemmaer ---
const lemmas = new Map(); // word -> {pos:Set, forms:Set, glosses:[]}
const formOwners = new Map(); // form -> Set(lemma)
for (const line of zlib.gunzipSync(fs.readFileSync(path.join(K, 'kaikki-Danish.jsonl.gz'))).toString('utf8').split('\n')) {
  if (!line) continue;
  const o = JSON.parse(line);
  if (!POS[o.pos]) continue;
  const senses = (o.senses || []).filter((s) => !(s.tags || []).includes('form-of') && !s.form_of && !(s.tags || []).includes('alt-of'));
  if (!senses.length) continue;
  if (/[A-ZÆØÅ]/.test(o.word[0]) || /[\s.]/.test(o.word) || o.word.length < 2) continue; // egennavne, forkortelser, flerord
  const w = o.word;
  if (!lemmas.has(w)) lemmas.set(w, { pos: new Set(), forms: new Set([norm(w)]), glosses: [] });
  const L = lemmas.get(w);
  L.pos.add(POS[o.pos]);
  for (const s of senses) for (const g of s.glosses || []) L.glosses.push(g);
  for (const f of o.forms || []) {
    // Bydeform springes over: sjælden i tekst og ofte lig et andet ord (digte -> "digt", lodde -> "lod").
    if (!f.form || (f.tags || []).some((t) => ['table-tags', 'inflection-template', 'imperative'].includes(t))) continue;
    if (/^[\p{L}-]+$/u.test(f.form)) L.forms.add(norm(f.form));
  }
}
// --- Ord der allerede er i appens kerneliste (words.js, kildedata i data/concepts.js) ---
// Både opslagsord og bøjningsformer, så fx "kunne" regnes som kendt, fordi "kan" er i kernelisten.
const CONCEPTS = require('./concepts');
const coreForms = new Set();
for (const r of CONCEPTS) {
  if (r[1]) coreForms.add(norm(r[1]));
  for (const f of (r[6] || '').split(/\s+/).filter(Boolean)) coreForms.add(norm(f.split(':')[0]));
}
// Wiktionarys bøjningsfelter indeholder støj ("er", "har", "et" fra hjælpeverber/artikler).
// Derfor tælles en form ikke med, hvis den er et kerneord. Andre delte former deles ligeligt.
for (const [w, L] of lemmas) {
  for (const f of [...L.forms]) if (f !== norm(w) && coreForms.has(f)) L.forms.delete(f);
}
for (const [w, L] of lemmas) for (const f of L.forms) {
  if (!formOwners.has(f)) formOwners.set(f, new Set());
  formOwners.get(f).add(w);
}

// --- 2. Frekvens ---
const srcs = loadAll('da');
const totalW = srcs.reduce((a, s) => a + s.weight, 0);
function formIpm(f) {
  let sum = 0;
  let w = 0;
  for (const s of srcs) { const v = s.map.get(f); if (v) { sum += s.weight * Math.log10(v); w += s.weight; } }
  return w ? Math.pow(10, sum / w) * (w / totalW) : 0; // straf for at mangle i nogle kilder
}
const freq = new Map();
for (const [w, L] of lemmas) {
  let ipm = 0;
  for (const f of L.forms) ipm += formIpm(f) / formOwners.get(f).size;
  if (ipm > 0) freq.set(w, ipm);
}

// --- 3. Ord der allerede er i appen ---
const existing = coreForms;
const existingIds = new Set(CONCEPTS.map((r) => r[0]));

// --- 4. Betydninger fra oversættelsestabellerne ---
const byDa = new Map();
for (const line of fs.readFileSync(path.join(K, 'en-senses-da-ru-uk.jsonl'), 'utf8').split('\n')) {
  if (!line) continue;
  const g = JSON.parse(line);
  if (!g.sense || !POS[g.pos]) continue;
  for (const d of g.da) {
    const k = d.w;
    if (!byDa.has(k)) byDa.set(k, []);
    byDa.get(k).push(g);
  }
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function pick(list, pos) {
  const ok = list.filter((x) => !(x.t || []).some((t) => BAD_TAGS.includes(t)));
  if (!ok.length) return { word: '', alts: list.map((x) => x.w) };
  let best = ok[0];
  if (pos === 'verb') best = ok.find((x) => (x.t || []).includes('imperfective')) || ok[0];
  return { word: best.w, alts: ok.filter((x) => x !== best).map((x) => x.w) };
}
const slug = (s) => s.toLowerCase().replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const ranked = [...freq].filter(([w]) => !existing.has(norm(w)) && byDa.has(w)).sort((a, b) => b[1] - a[1]);
const out = [];
const ids = new Set();
ranked.slice(SKIP, SKIP + LIMIT).forEach(([da, ipm], i) => {
  const L = lemmas.get(da);
  const glossText = L.glosses.join(' ; ').toLowerCase();
  const groups = byDa.get(da)
    .filter((g) => L.pos.has(POS[g.pos]))
    .filter((g) => new RegExp(`(^|[^a-z])${esc(g.en.toLowerCase())}([^a-z]|$)`).test(glossText))
    .map((g) => ({ g, at: glossText.indexOf(g.en.toLowerCase()) }))
    .sort((a, b) => a.at - b.at)
    .slice(0, MAX_SENSES);
  for (const { g } of groups) {
    const ru = pick(g.ru, g.pos);
    const uk = pick(g.uk, g.pos);
    const h = crypto.createHash('md5').update(`${g.en}|${g.pos}|${g.sense}`).digest('hex').slice(0, 6);
    let id = `cw-${slug(da)}-${g.pos}-${h}`;
    if (existingIds.has(id) || ids.has(id)) throw new Error('id-kollision ' + id);
    ids.add(id);
    out.push({
      id, da, en: g.en, ru: ru.word, uk: uk.word, partOfSpeech: g.pos, sense: g.sense,
      sourceUrl: `https://en.wiktionary.org/wiki/${encodeURIComponent(g.en.replace(/ /g, '_'))}#Translations`,
      license: 'CC BY-SA 4.0; Wiktionary contributors (via kaikki.org/wiktextract)',
      reviewStatus: 'unreviewed',
      _rank: SKIP + i + 1, _ipm: Number(ipm.toFixed(1)), _ruAlt: ru.alts, _ukAlt: uk.alts, _daGloss: L.glosses.slice(0, 6),
    });
  }
});
const file = path.join(CACHE, 'common-words.candidates.jsonl');
fs.writeFileSync(file, out.map((o) => JSON.stringify(o)).join('\n') + '\n');
const lemmasWithSense = new Set(out.map((o) => o.da)).size;
console.log(`Danske lemmaer med frekvens: ${freq.size}; med Wiktionary-oversættelsestabel: ${[...freq.keys()].filter((w) => byDa.has(w)).length}`);
console.log(`Kerneord og -former (springes over): ${existing.size}`);
console.log(`Parti: rang ${SKIP + 1}-${SKIP + LIMIT}: ${lemmasWithSense} lemmaer med krydstjekket betydning, ${out.length} betydninger`);
console.log(`  uden ru: ${out.filter((o) => !o.ru).length}, uden uk: ${out.filter((o) => !o.uk).length}`);
console.log('Skrevet: ' + path.relative(process.cwd(), file));
