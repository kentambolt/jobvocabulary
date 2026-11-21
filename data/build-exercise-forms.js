'use strict';
const fs=require('node:fs'),path=require('node:path');
function build(){
 const forms=require('./exercise-forms.json');
 for(const [lang,entries]of Object.entries(forms)){
  if(!['ru','uk','pl','ro','lt','bg'].includes(lang)||!entries||Array.isArray(entries))throw Error('Invalid exercise-form language');
  for(const [pattern,pair]of Object.entries(entries)){
   if(pattern!==pattern.toLowerCase()||!Array.isArray(pair)||pair.length!==2||pair.some(value=>typeof value!=='string'||!value.trim()||/[()]/u.test(value))||pair[0]===pair[1])throw Error('Invalid exercise form: '+lang+':'+pattern);
  }
 }
 const file=path.join(__dirname,'../word-entry.js'),source=fs.readFileSync(file,'utf8');
 const pattern=/  \/\/ EXERCISE_FORMS\r?\n[\s\S]*?  \/\/ \/EXERCISE_FORMS/;
 if(!pattern.test(source))throw Error('Missing exercise-form bundle markers');
 const bundle='  // EXERCISE_FORMS\n  static exerciseForms = '+JSON.stringify(forms)+';\n  // /EXERCISE_FORMS';
 fs.writeFileSync(file,source.replace(pattern,bundle));
 return forms;
}
if(require.main===module)build();
module.exports=build;
