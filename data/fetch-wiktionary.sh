#!/usr/bin/env sh
# Henter Wiktionary-data til listen over almindelige ord (data/build-common-words.js) til data/.cache/kaikki/.
# Kilde: kaikki.org (wiktextract-udtræk af engelsk Wiktionary). Licens: CC BY-SA 4.0 og GFDL.
# Den engelske fil er 534 MB komprimeret; den filtreres i en strøm, så der kun gemmes ca. 8 MB:
# de oversættelsestabeller, der har en dansk oversættelse, med kun dansk, russisk og ukrainsk.
set -e
cd "$(dirname "$0")"
mkdir -p .cache/kaikki
cd .cache/kaikki

curl -sfL -o kaikki-Danish.jsonl.gz https://kaikki.org/dictionary/Danish/kaikki.org-dictionary-Danish.jsonl.gz

curl -sfL https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl.gz | gzip -dc \
  | grep -E '"(lang_)?code": ?"da"' \
  | node -e '
const rl = require("readline").createInterface({ input: process.stdin, crlfDelay: Infinity });
const strip = (s) => s.normalize("NFD").replace(/[̀́]/g, "").normalize("NFC"); // fjern trykaccenter, behold ё/й
rl.on("line", (line) => {
  let o; try { o = JSON.parse(line); } catch (e) { return; }
  if (o.lang_code !== "en") return;
  const tr = (o.translations || []).concat(...(o.senses || []).map((s) => s.translations || []));
  const groups = new Map();
  for (const t of tr) {
    const c = t.lang_code || t.code;
    if (!["da", "ru", "uk"].includes(c) || !t.word) continue;
    const k = t.sense || "";
    if (!groups.has(k)) groups.set(k, { da: [], ru: [], uk: [] });
    const w = c === "da" ? t.word : strip(t.word);
    const item = { w };
    if (t.tags && t.tags.length) item.t = t.tags;
    if (t.note) item.n = t.note;
    if (!groups.get(k)[c].some((x) => x.w === w)) groups.get(k)[c].push(item);
  }
  for (const [sense, v] of groups) if (v.da.length) process.stdout.write(JSON.stringify({ en: o.word, pos: o.pos, sense, ...v }) + "\n");
});' > en-senses-da-ru-uk.jsonl
echo "OK"
