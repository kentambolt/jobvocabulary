// Bygger ../words.js og REPORT.md ud fra concepts.js og frekvenskilderne i .cache/.
// Kør: node data/build.js   (hent først kilderne med: sh data/fetch.sh)
//
// Metode
//  1. For hvert begreb og sprog slås opslagsordet + bøjningsformerne op i hver kilde.
//     Ordformslister: frekvensen er summen af formernes frekvens (evt. vægtet).
//     Lemmalister (Russisk Nationalkorpus): opslagsordets frekvens direkte.
//  2. Kilderne vægtes og kombineres som vægtet geometrisk gennemsnit (gennemsnit af log10),
//     så én kilde med en skæv værdi ikke dominerer.
//  3. Mangler et ord i en kilde, udelades kilden for det ord. Findes ordet ikke i nogen
//     kilde (fx flerordsudtryk som "i dag"), bruges gennemsnittet af de andre sprogs
//     estimat for samme begreb.
const fs = require('fs');
const path = require('path');
const ROWS = require('./concepts');
const UK = require('./uk');
const { loadAll } = require('./sources');

const LANGS = ['da', 'en', 'ru'];
const COL = { da: 1, en: 2, ru: 3 };
const FORMS = { da: 7, en: 8, ru: 9 };
const norm = (w) => w.toLowerCase().replace(/ё/g, 'е');

// --- sanity checks ---
const ids = new Set();
for (const r of ROWS) {
  if (ids.has(r[0])) throw new Error('dup id ' + r[0]);
  ids.add(r[0]);
}
for (const l of LANGS) {
  const seen = new Map();
  for (const r of ROWS) {
    const w = norm(r[COL[l]]);
    if (!w) continue;
    if (seen.has(w)) throw new Error(`dup ${l} word "${w}" in ${seen.get(w)} and ${r[0]}`);
    seen.set(w, r[0]);
  }
}
const missingUk = ROWS.filter((r) => !(r[0] in UK)).map((r) => r[0]);
if (missingUk.length) throw new Error('missing uk: ' + missingUk.join(', '));
const ukSeen = new Map();
for (const r of ROWS) {
  const w = UK[r[0]];
  if (!w) continue;
  if (ukSeen.has(w)) throw new Error(`dup uk word "${w}" in ${ukSeen.get(w)} and ${r[0]}`);
  ukSeen.set(w, r[0]);
}
const emojis = ROWS.map((r) => r[4]).filter(Boolean);
if (new Set(emojis).size !== emojis.length) throw new Error('dup emoji');

function formsOf(row, lang) {
  const word = row[COL[lang]];
  const map = new Map();
  if (word && !word.includes(' ')) map.set(norm(word), 1);
  for (const f of (row[FORMS[lang]] || '').split(/\s+/).filter(Boolean)) {
    const [w, wt] = f.split(':');
    if (w.includes(' ')) continue;
    map.set(norm(w), wt === undefined ? 1 : Number(wt));
  }
  return map;
}

const result = {}; // lang -> id -> {log, perSource: {short: ipm}, proxy}
const sourcesByLang = {};
for (const lang of LANGS) {
  const srcs = loadAll(lang);
  sourcesByLang[lang] = srcs;
  result[lang] = {};
  for (const row of ROWS) {
    const word = row[COL[lang]];
    if (!word) continue;
    const forms = formsOf(row, lang);
    const per = {};
    let num = 0;
    let den = 0;
    for (const s of srcs) {
      let ipm = 0;
      if (s.lemma) ipm = s.map.get(norm(word)) || 0;
      else for (const [f, wt] of forms) ipm += (s.map.get(f) || 0) * wt;
      if (ipm > 0) {
        per[s.short] = ipm;
        num += s.weight * Math.log10(ipm);
        den += s.weight;
      }
    }
    result[lang][row[0]] = { log: den ? num / den : null, per, proxy: !den };
  }
}
// proxy for words not found in any source
for (const lang of LANGS) {
  for (const [id, r] of Object.entries(result[lang])) {
    if (r.log !== null) continue;
    const others = LANGS.filter((l) => l !== lang && result[l][id] && result[l][id].log !== null).map((l) => result[l][id].log);
    r.log = others.length ? others.reduce((a, b) => a + b, 0) / others.length : -3;
  }
}

const ORDER = {};
for (const lang of LANGS) {
  ORDER[lang] = Object.keys(result[lang]).sort((a, b) => result[lang][b].log - result[lang][a].log);
}

// --- write words.js ---
const rowsOut = ROWS.map((r) => [r[0], r[1], r[2], r[3], UK[r[0]] || '', r[4], r[5], r[6]]);
const ipm = {};
for (const lang of LANGS) {
  ipm[lang] = Object.fromEntries(ORDER[lang].map((id) => [id, Number(Math.pow(10, result[lang][id].log).toPrecision(3))]));
}
const js = `// GENERERET af data/build.js – ret ikke her. Ret i data/concepts.js og kør: node data/build.js
// Kilder og metode: se data/REPORT.md
//
// [id, dansk, engelsk, russisk, ukrainsk, emoji, ordklasse, sværhedsgrad (1=let, 2=mellem, 3=svær)]
const WORD_ROWS = ${JSON.stringify(rowsOut).replace(/\],\[/g, '],\n  [').replace(/^\[\[/, '[\n  [').replace(/\]\]$/, '],\n]')};

// Hyppighedsrækkefølge pr. sprog (mest brugte først), beregnet ud fra flere kilder.
const ORDER = ${JSON.stringify(ORDER)};

// Estimeret frekvens (forekomster pr. million ord, inkl. bøjningsformer).
const IPM = ${JSON.stringify(ipm)};

const LANGS = {
  da: { name: 'Dansk', tts: 'da-DK' },
  en: { name: 'English', tts: 'en-GB' },
  ru: { name: 'Русский', tts: 'ru-RU' },
  uk: { name: 'Українська', tts: 'uk-UA' },
};

const CONCEPTS = WORD_ROWS.map(([id, da, en, ru, uk, emoji, pos, diff]) => ({ id, words: { da, en, ru, uk }, emoji, pos, diff }));
const BY_ID = Object.fromEntries(CONCEPTS.map((c) => [c.id, c]));

if (typeof module !== 'undefined') module.exports = { WORD_ROWS, CONCEPTS, BY_ID, ORDER, IPM, LANGS };
`;
fs.writeFileSync(path.join(__dirname, '..', 'words.js'), js);

// --- report ---
function spearman(a, b) {
  const n = a.length;
  const rank = (arr) => {
    const idx = arr.map((v, i) => [v, i]).sort((x, y) => y[0] - x[0]);
    const r = new Array(n);
    idx.forEach(([, i], k) => (r[i] = k));
    return r;
  };
  const ra = rank(a);
  const rb = rank(b);
  let d2 = 0;
  for (let i = 0; i < n; i++) d2 += (ra[i] - rb[i]) ** 2;
  return 1 - (6 * d2) / (n * (n * n - 1));
}
const NAMES = { da: 'Dansk', en: 'Engelsk', ru: 'Russisk' };
let md = `# Topwords – ordfrekvenser\n\nGenereret af \`data/build.js\` den ${new Date().toISOString().slice(0, 10)}. ${ROWS.length} begreber.\n\n`;
md += `## Metode\n\n` +
  `- Ordene lærer man som **opslagsord** (fx *være*), så hvert ords frekvens er summen af dets bøjningsformer (*er, var, været*) i ordformslisterne. Formerne står i \`data/concepts.js\`. Former, der også betyder noget andet, tælles kun delvist (fx dansk *tog* = både "train" og "took").\n` +
  `- Russisk Nationalkorpus er allerede opgjort pr. opslagsord og bruges direkte.\n` +
  `- Kilderne kombineres som et **vægtet geometrisk gennemsnit**. Talesprog (undertekster) og blandede kilder vægtes højest, fordi appen handler om hverdagssprog; Wikipedia vægtes lavest.\n` +
  `- Ord, der ikke findes i nogen kilde (flerordsudtryk som *i dag*), får gennemsnittet af de andre sprogs estimat for samme begreb.\n\n`;

for (const lang of LANGS) {
  const srcs = sourcesByLang[lang];
  const order = ORDER[lang];
  md += `## ${NAMES[lang]}\n\n| Kilde | Vægt | Type | Enighed med samlet bud (Spearman) |\n|---|---|---|---|\n`;
  for (const s of srcs) {
    const both = order.filter((id) => result[lang][id].per[s.short]);
    const rho = spearman(both.map((id) => result[lang][id].per[s.short]), both.map((id) => result[lang][id].log));
    md += `| ${s.name} | ${s.weight} | ${s.lemma ? 'lemmaer' : 'ordformer'} | ${rho.toFixed(2)} (${both.length} ord) |\n`;
  }
  const rankIn = (s) => {
    const ids2 = order.filter((id) => result[lang][id].per[s.short]).sort((a, b) => result[lang][b].per[s.short] - result[lang][a].per[s.short]);
    return Object.fromEntries(ids2.map((id, i) => [id, i + 1]));
  };
  const ranks = srcs.map(rankIn);
  md += `\n### Top 60\n\n| # | Ord | Pr. mio. | ${srcs.map((s) => s.short).join(' | ')} |\n|---|---|---|${srcs.map(() => '---').join('|')}|\n`;
  order.slice(0, 60).forEach((id, i) => {
    const r = result[lang][id];
    const word = ROWS.find((x) => x[0] === id)[COL[lang]];
    md += `| ${i + 1} | ${word}${r.proxy ? ' *' : ''} | ${Math.round(Math.pow(10, r.log))} | ${ranks.map((rk) => rk[id] || '–').join(' | ')} |\n`;
  });
  // disagreements
  const dis = order.map((id) => {
    const vals = Object.values(result[lang][id].per).map(Math.log10);
    return [id, vals.length > 1 ? Math.max(...vals) - Math.min(...vals) : 0];
  }).filter(([, d]) => d > 1).sort((a, b) => b[1] - a[1]).slice(0, 15);
  md += `\n### Største uenigheder mellem kilderne\n\nOrd hvor den højeste og laveste kilde er mere end en faktor 10 fra hinanden:\n\n`;
  md += dis.map(([id, d]) => {
    const word = ROWS.find((x) => x[0] === id)[COL[lang]];
    const per = result[lang][id].per;
    return `- **${word}** (×${Math.round(Math.pow(10, d))}): ${Object.entries(per).map(([k, v]) => `${k} ${v < 10 ? v.toFixed(1) : Math.round(v)}`).join(', ')}`;
  }).join('\n') + '\n\n';
  const proxies = order.filter((id) => result[lang][id].proxy);
  if (proxies.length) md += `Estimeret ud fra de andre sprog (*): ${proxies.map((id) => ROWS.find((x) => x[0] === id)[COL[lang]]).join(', ')}\n\n`;
}
fs.writeFileSync(path.join(__dirname, 'REPORT.md'), md);
for (const lang of LANGS) console.log(lang, ORDER[lang].length, ORDER[lang].slice(0, 40).map((id) => ROWS.find((x) => x[0] === id)[COL[lang]]).join(' '));
