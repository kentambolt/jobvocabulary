// Import selected, completed courses. Internal reviews stay in the private checkout.
// node data/import-new-courses.js [course-directory] airport,bus,getaround,propertyservice
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const directory = path.resolve(process.argv[2] || path.join(root, '.private/jobvocabulary-private/content/courses'));
const ids = (process.argv[3] || '').split(',').filter(Boolean);
const languages = ['da', 'en', 'ru', 'uk', 'pl', 'ro', 'lt', 'bg'];
const additionalLabels = require('./course-labels-lt-bg.json');
const overlayFile = path.resolve(directory,'../translations/new-courses-lt-bg.json');
const overlay = fs.existsSync(overlayFile) ? JSON.parse(fs.readFileSync(overlayFile,'utf8')).courses : {};
if (!ids.length || ids.some(id => !/^[a-z][a-z0-9]*$/.test(id)) || new Set(ids).size !== ids.length) throw new Error('Pass unique course IDs to import.');
const labels = value => {
  const result = {};
  for (const language of languages) {
    if (typeof value?.[language] !== 'string' || !value[language].trim()) throw new Error('Missing label: ' + language);
    result[language] = value[language].replace(/\s+[–—]\s+/g, ', ');
  }
  return result;
};
const localized = (value, additional) => {
  if (languages.every(lang=>value?.[lang])) return labels(value);
  if (!Array.isArray(additional) || additional.length!==2) throw new Error('Missing new-language metadata');
  return labels({...value,lt:additional[0],bg:additional[1]});
};
const planned = [];
for (const id of ids) {
  const destination = path.join(root, 'packs', id + '.js');
  if (fs.existsSync(destination)) throw new Error('Existing course requires an explicit migration: ' + id);
  const input = JSON.parse(fs.readFileSync(path.join(directory, id + '.json'), 'utf8'));
  if (input.id !== id || !['work', 'everyday'].includes(input.group) || !Array.isArray(input.categories) || !input.categories.length) throw new Error('Invalid course: ' + id);
  const metadata=additionalLabels.courses[id];
  const pack = { id, name: localized(input.name,metadata?.name), desc: localized(input.desc,metadata?.desc), categories: [] };
  const keys = new Set(), sourceWords = new Set();
  for (const category of input.categories) {
    if (!/^[a-z][a-zA-Z0-9]*$/.test(category.key) || keys.has(category.key) || !['word', 'phrase'].includes(category.type) || !category.rows?.length) throw new Error('Invalid category: ' + id);
    keys.add(category.key);
    const rows = category.rows.map(original => {
      const added=overlay[id]?.[id+':'+original[1]];
      const row=original.length===7 ? [...original,added?.lt,added?.bg] : original;
      if (row.length !== languages.length+1 || ![1, 2, 3].includes(row[0]) || row.slice(1).some(text => typeof text !== 'string' || !text.trim())) throw new Error('Invalid row: ' + id);
      if (sourceWords.has(row[1])) throw new Error('Repeated source: ' + id + ':' + row[1]);
      sourceWords.add(row[1]);
      return row;
    });
    pack.categories.push({ key: category.key, type: category.type, name: localized(category.name,additionalLabels.categories[category.name.en]), rows });
  }
  const categories = pack.categories.map(category => `    { key: ${JSON.stringify(category.key)}, type: ${JSON.stringify(category.type)}, name: ${JSON.stringify(category.name)}, rows: [\n${category.rows.map(row => '      ' + JSON.stringify(row)).join(',\n')}\n    ] }`).join(',\n');
  const code = `// Learning data. Internal reviews are held in the private content repository.\nvar PACKS = typeof PACKS !== 'undefined' ? PACKS : {};\nPACKS.${id} = {\n  id: ${JSON.stringify(id)},\n  name: ${JSON.stringify(pack.name)},\n  desc: ${JSON.stringify(pack.desc)},\n  categories: [\n${categories}\n  ]\n};\n`;
  planned.push([destination, code]);
  console.log(`${id}: ${sourceWords.size} words and phrases (${input.group})`);
}
for (const [destination, code] of planned) fs.writeFileSync(destination, code);
console.log('Imported learning data only. Run build-packs, build-lexicon and build-pages before publishing.');
