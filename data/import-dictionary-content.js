// Keep the CC BY-SA word collection separate from the project's own lexicon.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname,'..');
const source = path.resolve(process.argv[2] || path.join(root,'.private/jobvocabulary-private'));
const read = name => fs.readFileSync(path.join(source,'content/incoming',name),'utf8').trim().split(/\r?\n/).map(line=>JSON.parse(line));
const common = read('common-words.jsonl');
const own = read('common-words-supplement.jsonl');
const languages = ['da','en','ru','uk'];
const seen = new Set();
for(const row of [...common,...own]) {
  if(!row.id || seen.has(row.id) || languages.some(l=>typeof row[l]!=='string') || languages.filter(l=>row[l].trim()).length<2 || !/^ai-reviewed(?:-no-equivalent)?$/.test(row.reviewStatus)) throw new Error('Invalid dictionary row: '+row.id);
  seen.add(row.id);
}
const entries = common.map(row=>['lex:'+crypto.createHash('sha256').update(row.id).digest('hex').slice(0,16),...languages.map(l=>row[l]),0,'']);
const packageData = { version:1,languages,license:{name:'CC BY-SA 4.0',url:'https://creativecommons.org/licenses/by-sa/4.0/',authors:'Wiktionary contributors',source:'https://en.wiktionary.org/',extraction:'https://kaikki.org/'},entries,aliases:Object.fromEntries(common.map((row,index)=>[row.id,index])),sources:Object.fromEntries(common.map((row,index)=>[entries[index][0],row.sourceUrl])) };
fs.mkdirSync(path.join(root,'dictionary'),{recursive:true});
fs.writeFileSync(path.join(root,'dictionary/common-words.json'),JSON.stringify(packageData)+'\n');
fs.writeFileSync(path.join(root,'dictionary/project-supplement.json'),JSON.stringify(own.map(row=>({id:row.id,words:Object.fromEntries(languages.map(l=>[l,row[l]]))})))+'\n');
console.log(`Prepared ${common.length} separately licensed senses and ${own.length} original supplementary senses.`);
