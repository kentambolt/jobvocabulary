// Add completed Lithuanian/Bulgarian translations without overwriting live wording.
// node data/import-course-languages.js [private-checkout]
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const source = path.resolve(process.argv[2] || path.join(root,'.private/jobvocabulary-private'));
const read = file => JSON.parse(fs.readFileSync(path.join(source,'content/translations',file),'utf8'));
const translations = Object.assign({},read('courses-lt-bg.json').courses,read('new-courses-lt-bg.json').courses);
const labels = require('./course-labels-lt-bg.json');
const stableIds = require('./stable-word-ids.json');
const pair = values => {
  if (!Array.isArray(values) || values.length!==2 || values.some(s=>typeof s!=='string'||!s.trim())) throw new Error('Missing Lithuanian/Bulgarian label');
  return {lt:values[0],bg:values[1]};
};
const factCorrections = {
  'health:Ring til lægevagten ved akut sygdom, når din egen læge har lukket.': {
    lt:'Dėl ūmios ligos, kai tavo gydytojas nedirba, skambink budinčiam gydytojui.',
    bg:'При остро заболяване, когато личният ти лекар не работи, се обади на дежурния лекар.'
  },
  'health:I hovedstadsområdet kan du ringe 1813 ved akut sygdom uden livsfare, når din læge har lukket.': {
    lt:'Sostinės regione dėl ūmios, gyvybei nepavojingos ligos, kai tavo gydytojas nedirba, gali skambinti 1813.',
    bg:'В Столичния регион при остро заболяване без опасност за живота можеш да се обадиш на 1813, когато личният ти лекар не работи.'
  },
  'restaurant:Varm mad skal holdes over 65 grader.': {
    lt:'Maisto, laikomo karštai be atskiro dokumentinio pagrindimo, temperatūra turi būti ne žemesnė kaip 56 °C.',
    bg:'Храната, поддържана гореща без отделна документация, трябва да е с температура поне 56 градуса по Целзий.'
  }
};
const planned = [];
let rows = 0;
let skipped = 0;
for (const file of fs.readdirSync(path.join(root,'packs')).filter(f=>f.endsWith('.js')&&f!=='index.js')) {
  const context = {};
  vm.runInNewContext(fs.readFileSync(path.join(root,'packs',file),'utf8'),context);
  const pack = Object.values(context.PACKS)[0];
  // New courses can already include reviewed translations. A legacy overlay must not replace them.
  const complete = [pack.name,pack.desc,...pack.categories.map(category=>category.name)].every(value=>['lt','bg'].every(lang=>typeof value?.[lang]==='string'&&value[lang].trim()))
    && pack.categories.every(category=>category.rows.every(row=>row.length===9&&row.slice(7).every(value=>typeof value==='string'&&value.trim())));
  if (complete) { skipped++; continue; }
  Object.assign(pack.name,pair(labels.courses[pack.id]?.name));
  Object.assign(pack.desc,pair(labels.courses[pack.id]?.desc));
  for (const category of pack.categories) {
    Object.assign(category.name,pair(labels.categories[category.name.en]));
    category.rows = category.rows.map(row=>{
      const id=stableIds[pack.id]?.[row[1]] || pack.id+':'+row[1];
      const added=factCorrections[id] || translations[pack.id]?.[id];
      if (!added?.lt || !added?.bg) throw new Error('Missing translation: '+id);
      rows++;
      return [...row.slice(0,7),added.lt,added.bg];
    });
  }
  const categories = pack.categories.map(category=>`    { key: ${JSON.stringify(category.key)}, type: ${JSON.stringify(category.type)}, name: ${JSON.stringify(category.name)}, rows: [\n${category.rows.map(row=>'      '+JSON.stringify(row)).join(',\n')}\n    ] }`).join(',\n');
  planned.push([path.join(root,'packs',file),`// Learning data. Internal reviews are held in the private content repository.\nvar PACKS = typeof PACKS !== 'undefined' ? PACKS : {};\nPACKS.${pack.id} = {\n  id: ${JSON.stringify(pack.id)},\n  name: ${JSON.stringify(pack.name)},\n  desc: ${JSON.stringify(pack.desc)},\n  categories: [\n${categories}\n  ]\n};\n`]);
}
for (const [file,code] of planned) fs.writeFileSync(file,code);
console.log(`Added Lithuanian and Bulgarian to ${rows} learning rows; skipped ${skipped} complete courses. Existing translations and IDs retained.`);
