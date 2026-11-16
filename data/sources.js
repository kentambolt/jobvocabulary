// Indlæser frekvenskilder som Map(ord -> forekomster pr. million). Kun parsing af data.
// Filerne hentes med data/fetch.sh til data/.cache/.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const S = path.join(__dirname, '.cache');
const MAX = 60000;

function toIpm(entries) {
  // entries: [word, count][]; merges case, returns Map word->ipm (top MAX)
  const m = new Map();
  let total = 0;
  for (const [w0, c] of entries) {
    const w = w0.toLowerCase().replace(/ё/g, 'е');
    if (!/^[\p{L}'’-]+$/u.test(w)) continue;
    m.set(w, (m.get(w) || 0) + c);
    total += c;
  }
  const out = new Map();
  [...m].sort((a, b) => b[1] - a[1]).slice(0, MAX).forEach(([w, c]) => out.set(w, (c / total) * 1e6));
  return out;
}

function lines(file) { return fs.readFileSync(path.join(S, file), 'utf8').split(/\r?\n/).filter(Boolean); }

function openSubs(lang) {
  return toIpm(lines(`os_${lang}.txt`).map((l) => { const [w, c] = l.split(' '); return [w, Number(c)]; }));
}
function leipzig(dir) {
  return toIpm(lines(`${dir}/${dir}-words.txt`).map((l) => { const p = l.split('\t'); return [p[1] || '', Number(p[2])]; }));
}
function norvig() {
  return toIpm(lines('norvig_en.txt').map((l) => { const [w, c] = l.split('\t'); return [w, Number(c)]; }));
}

// Minimal msgpack decoder (arrays, maps, strings, ints) for wordfreq's cBpack files.
function decodeMsgpack(buf) {
  let i = 0;
  const str = (n) => { const s = buf.toString('utf8', i, i + n); i += n; return s; };
  const arr = (n) => { const a = []; for (let k = 0; k < n; k++) a.push(read()); return a; };
  const map = (n) => { const o = {}; for (let k = 0; k < n; k++) { const key = read(); o[key] = read(); } return o; };
  function read() {
    const b = buf[i++];
    if (b <= 0x7f) return b;
    if (b >= 0x80 && b <= 0x8f) return map(b & 0x0f);
    if (b >= 0x90 && b <= 0x9f) return arr(b & 0x0f);
    if (b >= 0xa0 && b <= 0xbf) return str(b & 0x1f);
    if (b >= 0xe0) return b - 256;
    switch (b) {
      case 0xc0: return null;
      case 0xc2: return false;
      case 0xc3: return true;
      case 0xcc: return buf[i++];
      case 0xcd: { const v = buf.readUInt16BE(i); i += 2; return v; }
      case 0xce: { const v = buf.readUInt32BE(i); i += 4; return v; }
      case 0xd0: return buf.readInt8(i++);
      case 0xd9: { const n = buf[i++]; return str(n); }
      case 0xda: { const n = buf.readUInt16BE(i); i += 2; return str(n); }
      case 0xdb: { const n = buf.readUInt32BE(i); i += 4; return str(n); }
      case 0xdc: { const n = buf.readUInt16BE(i); i += 2; return arr(n); }
      case 0xdd: { const n = buf.readUInt32BE(i); i += 4; return arr(n); }
      case 0xde: { const n = buf.readUInt16BE(i); i += 2; return map(n); }
      case 0xcb: { const v = buf.readDoubleBE(i); i += 8; return v; }
      default: throw new Error('msgpack type ' + b.toString(16) + ' at ' + (i - 1));
    }
  }
  return read();
}
function wordfreq(lang) {
  const data = decodeMsgpack(zlib.gunzipSync(fs.readFileSync(path.join(S, `wf_${lang}.msgpack.gz`))));
  const entries = [];
  data.slice(1).forEach((bucket, cB) => { for (const w of bucket) entries.push([w, Math.pow(10, -cB / 100)]); });
  return toIpm(entries);
}
function rnc() {
  const m = new Map();
  lines('rnc/freqrnc2011.csv').slice(1).forEach((l) => {
    const [lemma, pos, ipm] = l.split('\t');
    const w = lemma.toLowerCase().replace(/ё/g, 'е');
    m.set(w, (m.get(w) || 0) + Number(ipm));
  });
  return m;
}

// weight: how much the source counts in the combined estimate; lemma: true if keyed by lemma
const SOURCES = {
  da: [
    { name: 'OpenSubtitles 2018', short: 'subs', weight: 2, load: () => openSubs('da') },
    { name: 'wordfreq (blandede kilder)', short: 'wordfreq', weight: 2, load: () => wordfreq('da') },
    { name: 'Leipzig nyheder 2022', short: 'news', weight: 1, load: () => leipzig('dan_news_2022_100K') },
    { name: 'Leipzig Wikipedia 2021', short: 'wiki', weight: 0.5, load: () => leipzig('dan_wikipedia_2021_100K') },
  ],
  en: [
    { name: 'OpenSubtitles 2018', short: 'subs', weight: 2, load: () => openSubs('en') },
    { name: 'wordfreq (blandede kilder)', short: 'wordfreq', weight: 2, load: () => wordfreq('en') },
    { name: 'Google web (Norvig)', short: 'web', weight: 1, load: norvig },
    { name: 'Leipzig nyheder 2023', short: 'news', weight: 1, load: () => leipzig('eng_news_2023_100K') },
    { name: 'Leipzig Wikipedia 2016', short: 'wiki', weight: 0.5, load: () => leipzig('eng_wikipedia_2016_100K') },
  ],
  ru: [
    { name: 'OpenSubtitles 2018', short: 'subs', weight: 2, load: () => openSubs('ru') },
    { name: 'wordfreq (blandede kilder)', short: 'wordfreq', weight: 2, load: () => wordfreq('ru') },
    { name: 'Russisk Nationalkorpus (lemmaer)', short: 'rnc', weight: 2, lemma: true, load: rnc },
    { name: 'Leipzig nyheder 2023', short: 'news', weight: 1, load: () => leipzig('rus_news_2023_100K') },
    { name: 'Leipzig Wikipedia 2021', short: 'wiki', weight: 0.5, load: () => leipzig('rus_wikipedia_2021_100K') },
  ],
};

function loadAll(lang) {
  return SOURCES[lang].map((s) => ({ ...s, map: s.load() }));
}

module.exports = { loadAll, SOURCES };
