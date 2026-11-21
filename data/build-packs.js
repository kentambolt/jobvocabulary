// Validerer alle branchepakker i packs/*.js og skriver packs/index.js (navne, emner og antal),
// så appen kan vise valgmulighederne uden at hente alle pakker. Pakkerne hentes først, når de vælges.
// Kør: node data/build-packs.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const textAssetVersion=require('./text-asset-version');
require('./build-exercise-forms')();

const DIR = path.join(__dirname, '..', 'packs');
const stableIds = require('./stable-word-ids.json');
const LANGS = ['da', 'en', 'ru', 'uk', 'pl', 'ro', 'lt', 'bg'];
// Bevidste synonymer: samme oversættelse er tilladt for disse danske par.
const SYNONYMS = new Set(['mug|skimmel', 'stoppet|tilstoppet']);
// Rækkefølge i appen (resten alfabetisk efter).
const FIRST = ['cleaning', 'restaurant', 'warehouse', 'construction', 'care', 'agriculture', 'retail', 'transport', 'childcare', 'hotel', 'hospital', 'essentials', 'driving', 'worklife', 'authorities', 'health', 'children'];

const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.js') && f !== 'index.js');
const index = [];
let problems = 0;
const warn = (msg) => { problems++; console.log('  ! ' + msg); };

for (const f of files) {
  const code = fs.readFileSync(path.join(DIR, f), 'utf8');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(code + ';this.P = PACKS;', ctx);
  for (const p of Object.values(ctx.P)) {
    console.log(`${p.id} (${f})`);
    if (`${p.id}.js` !== f) warn(`id "${p.id}" matcher ikke filnavnet`);
    for (const l of LANGS) {
      if (!p.name || !p.name[l]) warn(`navn mangler (${l})`);
      if (!p.desc || !p.desc[l]) warn(`beskrivelse mangler (${l})`);
    }
    const seen = {};
    const keys = new Set();
    const cats = [];
    let total = 0;
    for (const cat of p.categories) {
      for (const language of LANGS) if (!cat.name?.[language]) warn(`emnenavn mangler (${language}) i ${cat.key}`);
      if (keys.has(cat.key)) warn(`dobbelt emne-nøgle ${cat.key}`);
      keys.add(cat.key);
      if (!['word', 'phrase'].includes(cat.type)) warn(`ukendt type i ${cat.key}`);
      const n = [0, 0, 0, 0];
      for (const r of cat.rows) {
        if (r.length !== LANGS.length + 1 || ![1, 2, 3].includes(r[0]) || r.slice(1).some((v) => typeof v !== 'string' || !v.trim())) {
          warn(`forkert række i ${cat.key}: ${JSON.stringify(r)}`);
          continue;
        }
        n[r[0]]++;
        total++;
        LANGS.forEach((l, i) => {
          const k = `${l}|${r[i + 1].toLowerCase()}`;
          if (seen[k]) {
            const pair = [seen[k], r[1]].sort().join('|');
            if (l === 'da' || !SYNONYMS.has(pair)) warn(`dublet (${l}): "${r[i + 1]}" – ${seen[k]} / ${r[1]}`);
          }
          seen[k] = r[1];
        });
      }
      cats.push({ key: cat.key, type: cat.type, name: cat.name, n });
    }
    const v = textAssetVersion(code,'md5',8);
    const sourceIds = stableIds[p.id] || {};
    for (const [text,id] of Object.entries(sourceIds)) {
      if (!seen['da|'+text.toLowerCase()]) warn(`stabilt id har ingen kilde: ${text}`);
      if (!id.startsWith(p.id+':')) warn(`stabilt id har forkert kursus: ${id}`);
    }
    const ids = p.categories.flatMap(cat => cat.rows.map(row => sourceIds[row[1]] || `${p.id}:${row[1]}`));
    if (new Set(ids).size !== ids.length) warn('stabile id er ikke entydige');
    index.push({ id: p.id, name: p.name, desc: p.desc, total, v, categories: cats, ...(Object.keys(sourceIds).length ? {sourceIds} : {}) });
    console.log(`  ${cats.length} emner, ${total} ord og sætninger`);
  }
}

index.sort((a, b) => {
  const ia = FIRST.indexOf(a.id);
  const ib = FIRST.indexOf(b.id);
  return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.id.localeCompare(b.id);
});
fs.writeFileSync(path.join(DIR, 'index.js'),
  `// GENERERET af data/build-packs.js – ret i den enkelte pakke og kør: node data/build-packs.js\nvar PACK_INDEX = ${JSON.stringify(index)};\n`);
console.log(problems ? `\n${problems} problemer` : '\nIngen problemer');
process.exitCode = problems ? 1 : 0;
