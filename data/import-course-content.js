// Copy only selected learning data from the private content checkout.
// Review logs, fact checks, provenance and generator inputs remain private.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = path.resolve(process.argv[2] || path.join(root, '.private/jobvocabulary-private'));
const labels = require('./course-labels-pl-ro.json');
const translations = JSON.parse(fs.readFileSync(path.join(source, 'content/translations/courses-pl-ro.json'), 'utf8'));
const pair = (values) => { if (!Array.isArray(values) || values.length !== 2 || values.some(v => typeof v !== 'string' || !v.trim())) throw new Error('Missing Polish/Romanian label'); return { pl: values[0], ro: values[1] }; };
const planned = new Map();
function write(pack) {
  const localized = value => Object.fromEntries(Object.entries(value).map(([l,s])=>[l,s.replace(/\s+[–—]\s+/g, ', ')]));
  const categories = pack.categories.map(c => `    { key: ${JSON.stringify(c.key)}, type: ${JSON.stringify(c.type)}, name: ${JSON.stringify(localized(c.name))}, rows: [\n${c.rows.map(r => '      '+JSON.stringify(r)).join(',\n')}\n    ] }`).join(',\n');
  planned.set(path.join(root, 'packs', pack.id+'.js'), `// Learning data: six languages. Internal reviews are held in the private content repository.\nvar PACKS = typeof PACKS !== 'undefined' ? PACKS : {};\nPACKS.${pack.id} = {\n  id: ${JSON.stringify(pack.id)},\n  name: ${JSON.stringify(localized(pack.name))},\n  desc: ${JSON.stringify(localized(pack.desc))},\n  categories: [\n${categories}\n  ]\n};\n`);
}
let translated = 0;
for (const [id, metadata] of Object.entries(labels)) {
  const context = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'packs', id+'.js'), 'utf8')+';this.pack=PACKS.'+id, context);
  const pack = context.pack;
  Object.assign(pack.name, pair(metadata.name)); Object.assign(pack.desc, pair(metadata.desc));
  for (const category of pack.categories) {
    Object.assign(category.name, pair(metadata.categories[category.key]));
    category.rows = category.rows.map(row => {
      const added = translations.courses[id]?.[id+':'+row[1]];
      if (!added?.pl || !added?.ro) throw new Error('Missing translation: '+id+':'+row[1]);
      translated++;
      return [...row.slice(0,5), added.pl, added.ro];
    });
  }
  write(pack);
}
if (translated !== translations.rows) throw new Error('Translation coverage changed: '+translated);
for (const id of ['worklife','authorities','health','children','childcare','hotel','hospital']) {
  const pack = JSON.parse(fs.readFileSync(path.join(source, 'content/courses', id+'.json'), 'utf8'));
  if (pack.id !== id || pack.categories.some(c=>c.rows.some(r=>r.length!==7 || r.slice(1).some(v=>typeof v!=='string'||!v.trim())))) throw new Error('Invalid course: '+id);
  write(pack);
}
for (const [file, content] of planned) fs.writeFileSync(file, content);
console.log(`Imported ${translated} course translations and seven new courses; private reviews were not copied.`);
