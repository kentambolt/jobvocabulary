#!/usr/bin/env bash
# Henter Wiktionary-data til listen over almindelige ord (data/build-common-words.js) til data/.cache/kaikki/.
#
# Kilde:   kaikki.org (wiktextract-udtræk af engelsk Wiktionary), https://kaikki.org/dictionary/
# Licens:  Wiktionary-indhold er CC BY-SA 4.0 (og GFDL). Se content/incoming/WIKTIONARY-LICENSE.md.
#
# Atomisk: alt hentes og bygges i en midlertidig mappe. Cachen erstattes først, når hvert trin er
# lykkedes (pipefail), gzip-filerne er hele, outputtet kan parses og ikke er tomt. Ved fejl bevares
# den gamle cache uændret.
#
# Sporbarhed: data/.cache/kaikki/provenance.json får kilde-URL'er, Last-Modified, størrelse, sha256 for
# input og output, kaikkis udtræksdato, Wiktionary-dumpdato, wiktextract-revision og git-revision af
# scripts. Kør med --verify for at kræve, at input er identisk med den eksisterende provenance.json
# (dvs. at et review-parti kan genskabes uændret); afviger det, stopper scriptet uden at ændre cachen.
set -euo pipefail

cd "$(dirname "$0")"
DATA_DIR="$(pwd)"
OUT=".cache/kaikki"
mkdir -p "$OUT"
VERIFY=0
[ "${1:-}" = "--verify" ] && VERIFY=1

DA_URL="${KAIKKI_DA_URL:-https://kaikki.org/dictionary/Danish/kaikki.org-dictionary-Danish.jsonl.gz}"
EN_URL="${KAIKKI_EN_URL:-https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl.gz}"
DA_INDEX="https://kaikki.org/dictionary/Danish/index.html"
EN_INDEX="https://kaikki.org/dictionary/English/index.html"

TMP="$(mktemp -d "$OUT/.tmp.XXXXXX")"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT
trap 'echo "FEJL: hentning afbrudt; cachen er ikke ændret." >&2' ERR

sha() { sha256sum "$1" | cut -d' ' -f1; }
header() { curl -sfIL --retry 3 "$1" | tr -d '\r' | awk -v k="$2" 'tolower($1)==tolower(k)":" {sub(/^[^:]*: /,""); v=$0} END {print v}'; }
snapshot() { curl -sfL --retry 3 "$1" | sed 's/<[^>]*>//g' | tr -s ' \n' ' ' | grep -o 'extracted on [0-9-]* from the [a-z]* dump dated [0-9-]* using wiktextract ([^)]*)' | head -1; }

echo "Henter dansk udtræk ..."
curl -sfL --retry 3 -o "$TMP/kaikki-Danish.jsonl.gz" "$DA_URL"
gzip -t "$TMP/kaikki-Danish.jsonl.gz"

echo "Henter og filtrerer engelsk udtræk (ca. 0,5 GB, gemmes ikke) ..."
# tee gemmer kun checksum af den komprimerede strøm; pipefail fanger fejl i alle led.
curl -sfL --retry 3 "$EN_URL" \
  | tee >(sha256sum | cut -d' ' -f1 > "$TMP/en.sha256") \
  | gzip -dc \
  | { grep -E '"(lang_)?code": ?"da"' || true; } \
  | node "$DATA_DIR/wiktionary-filter.js" > "$TMP/en-senses-da-ru-uk.jsonl"
# Vent på process substitution (sha256), før filen læses.
for _ in 1 2 3 4 5 6 7 8 9 10; do [ -s "$TMP/en.sha256" ] && break; sleep 1; done
[ -s "$TMP/en.sha256" ] || { echo "FEJL: checksum for engelsk input mangler" >&2; exit 1; }

# Validering: hver linje skal kunne parses, og der skal være et realistisk antal betydningsgrupper.
node -e '
const fs = require("fs");
const lines = fs.readFileSync(process.argv[1], "utf8").split("\n").filter(Boolean);
for (const l of lines) { const o = JSON.parse(l); if (!o.en || !Array.isArray(o.da) || !o.da.length) throw new Error("ugyldig linje"); }
if (lines.length < 20000) throw new Error("for få betydningsgrupper: " + lines.length);
console.log("OK: " + lines.length + " betydningsgrupper");
' "$TMP/en-senses-da-ru-uk.jsonl"

GIT_REV="$(git -C "$DATA_DIR" rev-parse HEAD 2>/dev/null || echo unknown)"
FILTER_BLOB="$(git -C "$DATA_DIR" hash-object "$DATA_DIR/wiktionary-filter.js")"
FETCH_BLOB="$(git -C "$DATA_DIR" hash-object "$DATA_DIR/fetch-wiktionary.sh")"

node -e '
const [file, ...a] = process.argv.slice(1);
const [daUrl, daLm, daLen, daSha, daSnap, enUrl, enLm, enLen, enSha, enSnap, outSha, outLines, gitRev, filterBlob, fetchBlob] = a;
const parse = (s) => { const m = /extracted on (\S+) from the (\S+) dump dated (\S+) using wiktextract \(([^)]*)\)/.exec(s) || []; return { extractedOn: m[1] || null, wiktionaryEdition: m[2] || null, dumpDate: m[3] || null, wiktextractRevision: m[4] || null }; };
const manifest = {
  generatedAt: new Date().toISOString(),
  license: { name: "CC BY-SA 4.0 (Wiktionary-tekst er også under GFDL)", url: "https://creativecommons.org/licenses/by-sa/4.0/", attribution: "Wiktionary contributors, https://en.wiktionary.org/ ; udtræk: kaikki.org / wiktextract (Ylonen 2022)" },
  inputs: [
    { name: "kaikki Danish", url: daUrl, lastModified: daLm, contentLength: Number(daLen) || null, sha256: daSha, snapshot: parse(daSnap), storedAs: "kaikki-Danish.jsonl.gz" },
    { name: "kaikki English", url: enUrl, lastModified: enLm, contentLength: Number(enLen) || null, sha256: enSha, snapshot: parse(enSnap), storedAs: null, note: "Streames og filtreres; kun output gemmes" },
  ],
  outputs: [{ file: "en-senses-da-ru-uk.jsonl", sha256: outSha, lines: Number(outLines) }],
  generator: { gitCommit: gitRev, scripts: { "data/wiktionary-filter.js": filterBlob, "data/fetch-wiktionary.sh": fetchBlob } },
};
require("fs").writeFileSync(file, JSON.stringify(manifest, null, 2) + "\n");
' "$TMP/provenance.json" \
  "$DA_URL" "$(header "$DA_URL" last-modified)" "$(header "$DA_URL" content-length)" "$(sha "$TMP/kaikki-Danish.jsonl.gz")" "$(snapshot "$DA_INDEX")" \
  "$EN_URL" "$(header "$EN_URL" last-modified)" "$(header "$EN_URL" content-length)" "$(cat "$TMP/en.sha256")" "$(snapshot "$EN_INDEX")" \
  "$(sha "$TMP/en-senses-da-ru-uk.jsonl")" "$(wc -l < "$TMP/en-senses-da-ru-uk.jsonl" | tr -d ' ')" \
  "$GIT_REV" "$FILTER_BLOB" "$FETCH_BLOB"

if [ "$VERIFY" = 1 ]; then
  [ -f "$OUT/provenance.json" ] || { echo "FEJL: --verify kræver en eksisterende $OUT/provenance.json" >&2; exit 1; }
  node -e '
  const [a, b] = process.argv.slice(1).map((f) => JSON.parse(require("fs").readFileSync(f, "utf8")));
  const key = (m) => JSON.stringify(m.inputs.map((i) => i.sha256));
  if (key(a) !== key(b)) { console.error("FEJL: kilderne er ændret siden det reviewede parti; cachen er ikke ændret."); process.exit(1); }
  console.log("OK: input er identisk med det reviewede parti");
  ' "$OUT/provenance.json" "$TMP/provenance.json"
fi

# Udskift atomisk: hver fil flyttes på plads inden for samme filsystem.
mv -f "$TMP/kaikki-Danish.jsonl.gz" "$OUT/kaikki-Danish.jsonl.gz"
mv -f "$TMP/en-senses-da-ru-uk.jsonl" "$OUT/en-senses-da-ru-uk.jsonl"
mv -f "$TMP/provenance.json" "$OUT/provenance.json"
trap - ERR
echo "OK: $OUT opdateret (se provenance.json)"
