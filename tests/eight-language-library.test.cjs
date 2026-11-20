const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=require('./helpers/app.cjs');
const WordLibrary=require('../library');
const WordEntry=require('../word-entry');
const read=file=>JSON.parse(fs.readFileSync(path.join(__dirname,'..',file),'utf8'));

test('new language pairs can select courses and restore their independent preferences',()=>{
  const a=app({target:'lt',base:'bg',pack:'top',dir:'rec',diff:1});
  a.run('render=()=>{};draft={...state.settings};view="setup";renderSetup();');
  a.context.document.getElementById('courseSelect').value='hotel';
  a.context.document.getElementById('courseSelect').onchange();
  assert.equal(a.run('draft.pack'),'hotel');
  a.run('state.settings={...draft,dir:"write",diff:2};saveState();');
  assert.equal(a.run('CoursePreferences.resolve(state,{pack:"hotel",target:"lt",base:"bg"}).dir'),'write');
  assert.equal(a.run('CoursePreferences.resolve(state,{pack:"hotel",target:"lt",base:"bg"}).diff'),2);
  assert.equal(a.run('CoursePreferences.resolve(state,{pack:"hotel",target:"bg",base:"lt"}).diff'),1);
});

test('eight-language dictionary retains six- and four-language layouts for existing clients',()=>{
  const current=read('lexicon-v4.json'),six=read('lexicon-v3.json'),four=read('lexicon.json');
  assert.equal(current.version,4);
  assert.equal(current.languages.length,8);
  assert.deepEqual(current.aliases,six.aliases);
  assert.deepEqual(current.aliases,four.aliases);
  for(let i=0;i<current.entries.length;i++){
    const row=current.entries[i];
    assert.equal(row.length,11);
    assert.deepEqual(six.entries[i],[...row.slice(0,7),...row.slice(9)]);
    assert.deepEqual(four.entries[i],[...row.slice(0,5),...row.slice(9)]);
  }
  const original=read('dictionary/common-words.json'),expanded=read('dictionary/common-words-v2.json');
  assert.deepEqual(original.aliases,expanded.aliases);
  assert.deepEqual(original.license,expanded.license);
  assert.deepEqual(original.sources,expanded.sources);
  for(let i=0;i<original.entries.length;i++)assert.deepEqual(original.entries[i],[...expanded.entries[i].slice(0,5),...expanded.entries[i].slice(9)]);
});

test('saved Lithuanian/Bulgarian words load from both dictionary collections and round-trip through backup',async()=>{
  const dictionary=read('lexicon-v4.json'),common=read('dictionary/common-words-v2.json');
  const a=app({target:'lt',base:'bg',pack:'airport',dir:'rec',diff:1});
  a.context.LEXICON_INDEX={file:'lexicon-v4.json',version:'test'};
  a.context.fetch=async url=>({ok:true,json:async()=>structuredClone(String(url).startsWith('dictionary/')?common:dictionary)});
  a.run("wordLibrary.add('airport:en bagagemedarbejder');");
  await a.run('loadDictionary()');
  assert.ok(a.run('ITEM[wordLibrary.data.favorites[0]].words.lt'));
  assert.ok(a.run('ITEM[wordLibrary.data.favorites[0]].words.bg'));
  assert.equal(a.run("listPool('favorites',state.settings).length"),1);
  const commonId=common.entries.find(row=>row[7]&&row[8])[0];
  a.run(`wordLibrary.add(${JSON.stringify(commonId)});`);
  assert.equal(a.run("listPool('favorites',state.settings).length"),2);
  const library=new WordLibrary();
  library.mergeBackup(JSON.parse(a.run("JSON.stringify({format:'jobvocabulary-library',version:1,library:wordLibrary.data})")));
  assert.equal(library.data.favorites.length,2);
  const id=library.addCustom({lt:'mano žodis',bg:'моя дума'});
  const draft=new WordEntry([],{target:'lt',base:'en'},library.data.custom[id]);
  draft.setLanguage('base','bg');
  assert.equal(draft.translation,'моя дума');
  const restored=new WordLibrary();
  restored.mergeBackup({format:'jobvocabulary-library',version:1,library:library.data});
  assert.equal(restored.data.custom[id].words.lt,'mano žodis');
  assert.equal(restored.data.custom[id].words.bg,'моя дума');
});
