// Extend the separately licensed dictionary without changing its existing URL layout.
// node data/import-dictionary-languages.js [private-checkout]
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=path.resolve(process.argv[2]||path.join(root,'.private/jobvocabulary-private'));
const added=JSON.parse(fs.readFileSync(path.join(source,'content/translations/common-words-pl-ro-lt-bg.json'),'utf8'));
const original=JSON.parse(fs.readFileSync(path.join(root,'dictionary/common-words.json'),'utf8'));
const languages=['da','en','ru','uk','pl','ro','lt','bg'];
function extra(id) {
  const row=added.rows[id];
  if(!row||['pl','ro','lt','bg'].some(lang=>typeof row[lang]!=='string')) throw new Error('Missing dictionary translation: '+id);
  return Object.fromEntries(['pl','ro','lt','bg'].map(lang=>[lang,row[lang]]));
}
const sourceIds=Object.fromEntries(Object.entries(original.aliases).filter(([id])=>!id.startsWith('lex:')).map(([id,index])=>[index,id]));
const entries=original.entries.map((row,index)=>{
  const words={...Object.fromEntries(original.languages.map((lang,i)=>[lang,row[i+1]])),...extra(sourceIds[index])};
  return [row[0],...languages.map(lang=>words[lang]||''),row[original.languages.length+1],row[original.languages.length+2]];
});
const supplementPath=path.join(root,'dictionary/project-supplement.json');
const supplement=JSON.parse(fs.readFileSync(supplementPath,'utf8')).map(entry=>({...entry,words:{...entry.words,...extra(entry.id)}}));
fs.writeFileSync(path.join(root,'dictionary/common-words-v2.json'),JSON.stringify({...original,version:2,languages,entries})+'\n');
fs.writeFileSync(supplementPath,JSON.stringify(supplement)+'\n');
console.log(`Extended ${entries.length} separately licensed senses and ${supplement.length} project senses. All IDs and attribution retained.`);
