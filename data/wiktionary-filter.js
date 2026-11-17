// Filtrerer kaikki.org's engelske Wiktionary-udtræk (JSONL på stdin) til oversættelsestabeller med
// dansk, og beholder kun dansk, russisk og ukrainsk. Én linje pr. (engelsk ord, ordklasse, betydning).
// Bruges af data/fetch-wiktionary.sh. Licens for data: CC BY-SA 4.0 (Wiktionary contributors).
const readline = require('readline');

const strip = (s) => s.normalize('NFD').replace(/[̀́]/g, '').normalize('NFC'); // fjern trykaccent, behold ё/й
let bad = 0;
const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on('line', (line) => {
  let o;
  try { o = JSON.parse(line); } catch (e) { bad++; return; }
  if (o.lang_code !== 'en') return;
  const tr = (o.translations || []).concat(...(o.senses || []).map((s) => s.translations || []));
  const groups = new Map();
  for (const t of tr) {
    const c = t.lang_code || t.code;
    if (!['da', 'ru', 'uk'].includes(c) || !t.word) continue;
    const k = t.sense || '';
    if (!groups.has(k)) groups.set(k, { da: [], ru: [], uk: [] });
    const w = c === 'da' ? t.word : strip(t.word);
    const item = { w };
    if (t.tags && t.tags.length) item.t = t.tags;
    if (t.note) item.n = t.note;
    if (!groups.get(k)[c].some((x) => x.w === w)) groups.get(k)[c].push(item);
  }
  for (const [sense, v] of groups) if (v.da.length) process.stdout.write(JSON.stringify({ en: o.word, pos: o.pos, sense, ...v }) + '\n');
});
rl.on('close', () => {
  // Et afkortet input giver en ufuldstændig sidste linje; mere end nogle få fejl betyder en defekt strøm.
  if (bad > 5) { console.error(`FEJL: ${bad} linjer kunne ikke parses`); process.exit(1); }
});
