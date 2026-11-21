// Compact project dictionary. Identical multilingual records share one ID.
// Homonyms with different translations remain separate entries.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const root = path.join(__dirname, '..');
const { CONCEPTS } = require('../words');
const languages = ['da', 'en', 'ru', 'uk', 'pl', 'ro', 'lt', 'bg'];
const stableIds = require('./stable-word-ids.json');
// The checked-in dictionary is also the identity registry. Translation corrections
// retain their source entry's ID, so saved personal lists keep working.
const previousPath = ['lexicon-v4.json','lexicon-v3.json','lexicon.json'].map(name=>path.join(root,name)).find(file=>fs.existsSync(file));
const previous = fs.existsSync(previousPath) ? JSON.parse(fs.readFileSync(previousPath, 'utf8')) : { entries: [], aliases: {} };
const previousAliases = Object.fromEntries(Object.entries(previous.aliases).map(([key, value]) => [key, typeof value === 'number' ? previous.entries[value][0] : value]));
const keyOf = (values) => JSON.stringify(values.map((v) => v.trim().toLocaleLowerCase()));
const previousKeys = new Map(previous.entries.map((row) => [keyOf(languages.map(lang => { const index = previous.languages.indexOf(lang); return index < 0 ? '' : row[index + 1]; })), row[0]]));
const usedIds = new Set();
const entries = [];
const aliases = {};
const seen = new Map();
function add(sourceId, words, phrase, image) {
  const values = languages.map((lang) => words[lang] || '');
  const key = keyOf(values);
  let id = seen.get(key);
  if (!id) {
    id = previousAliases[sourceId] || previousKeys.get(key) || 'lex:' + crypto.createHash('sha256').update(sourceId).digest('hex').slice(0, 16);
    if (usedIds.has(id)) id = 'lex:' + crypto.createHash('sha256').update(sourceId + key).digest('hex').slice(0, 16);
    usedIds.add(id);
    seen.set(key, id);
    entries.push([id, ...values, phrase ? 1 : 0, image || '']);
  }
  aliases[sourceId] = id;
  const oldId = previousAliases[sourceId];
  if (oldId && oldId !== id) aliases[oldId] = id;
}
for (const c of CONCEPTS) add(c.id, c.words, false, fs.existsSync(path.join(root, 'images', 'words', c.id + '.webp')) ? c.id : '');
const context = { PACKS: {} };
vm.createContext(context);
for (const name of fs.readdirSync(path.join(root, 'packs')).filter((n) => n.endsWith('.js') && n !== 'index.js').sort()) {
  vm.runInContext(fs.readFileSync(path.join(root, 'packs', name), 'utf8'), context);
}
vm.runInContext('this.allPacks = PACKS', context);
for (const pack of Object.values(context.allPacks)) for (const cat of pack.categories) for (const [, da, en, ru, uk, pl, ro, lt, bg] of cat.rows) {
  const sourceId = `${pack.id}:${da}`;
  const stableId = stableIds[pack.id]?.[da] || sourceId;
  add(stableId, { da, en, ru, uk, pl, ro, lt, bg }, cat.type === 'phrase');
  if (stableId !== sourceId) aliases[sourceId] = aliases[stableId];
}
const supplementPath = path.join(root,'dictionary/project-supplement.json');
if (fs.existsSync(supplementPath)) for (const entry of JSON.parse(fs.readFileSync(supplementPath,'utf8'))) add(entry.id,entry.words,false);
// Preserve redirects for previously merged records, without redirecting a live ID.
const migrationsPath = path.join(__dirname, 'lexicon-migrations.json');
const migrations = fs.existsSync(migrationsPath) ? JSON.parse(fs.readFileSync(migrationsPath, 'utf8')) : {};
for (const [oldSource, newSource] of Object.entries(migrations)) {
  if (!aliases[newSource]) throw new Error(`Unknown migration destination: ${newSource}`);
  aliases[oldSource] = aliases[newSource];
  if (previousAliases[oldSource]) aliases[previousAliases[oldSource]] = aliases[newSource];
}
for (const [oldId, target] of Object.entries(previousAliases)) if (oldId.startsWith('lex:') && !usedIds.has(oldId) && !aliases[oldId]) aliases[oldId] = target;
for (const id of usedIds) delete aliases[id];
for (const key of Object.keys(aliases)) {
  const visited = new Set([key]);
  let target = aliases[key];
  while (aliases[target] && !visited.has(target)) { visited.add(target); target = aliases[target]; }
  if (!usedIds.has(target)) delete aliases[key]; else aliases[key] = target;
}
const indices = new Map(entries.map((row, index) => [row[0], index]));
const commonFile = fs.existsSync(path.join(root,'dictionary/common-words-v2.json')) ? 'dictionary/common-words-v2.json' : 'dictionary/common-words.json';
const commonPath = path.join(root,commonFile);
const common = fs.existsSync(commonPath) ? JSON.parse(fs.readFileSync(commonPath,'utf8')) : null;
const supplements = common ? [{url:commonFile+'?v='+require('./text-asset-version')(fs.readFileSync(commonPath))}] : [];
const dictionary = { version: 4, languages, entries, supplements, aliases: Object.fromEntries(Object.entries(aliases).map(([key, id]) => [key, indices.get(id)])) };
const json = JSON.stringify(dictionary);
const version = crypto.createHash('sha256').update(json).digest('hex').slice(0, 12);
fs.writeFileSync(path.join(root, 'lexicon-v4.json'), json + '\n');
const sixLanguage = {...dictionary,version:3,languages:languages.slice(0,6),entries:entries.map(row=>[row[0],...row.slice(1,7),row[languages.length+1],row[languages.length+2]]),supplements:common ? [{url:'dictionary/common-words.json'}] : []};
fs.writeFileSync(path.join(root,'lexicon-v3.json'),JSON.stringify(sixLanguage)+'\n');
// Older tabs keep fetching this URL with the old four-language parser. Retain
// that layout so opening a saved list after deployment cannot drop references.
const legacy = {version:2,languages:languages.slice(0,4),entries:entries.map(row=>[row[0],...row.slice(1,5),row[languages.length+1],row[languages.length+2]]),aliases:dictionary.aliases};
fs.writeFileSync(path.join(root,'lexicon.json'),JSON.stringify(legacy)+'\n');
fs.writeFileSync(path.join(root, 'lexicon-index.js'), `// Generated by data/build-lexicon.js\nvar LEXICON_INDEX = ${JSON.stringify({ file:'lexicon-v4.json',version, entries: entries.length + (common?.entries.length || 0), words: entries.filter((r) => !r[languages.length + 1]).length + (common?.entries.length || 0), phrases: entries.filter((r) => r[languages.length + 1]).length })};\n`);
console.log(`${entries.length} shared entries, ${Object.keys(aliases).length} source references, ${Buffer.byteLength(json)} bytes (loaded on demand).`);
