const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const app = require('./helpers/app.cjs');
const locales = require('../locales');
const languages = ['da','en','ru','uk','pl','ro','lt','bg'];
const root = path.resolve(__dirname,'..');

test('new interface languages cover every UI/library key and preserve substitution variables', () => {
  const a = app();
  for (const language of ['pl','ro','lt','bg']) for (const [section, original] of [['ui',a.run('UI.en')],['library',a.run('LIBRARY_TEXT.en')]]) {
    const translated = locales[language][section];
    for (const [key,value] of Object.entries(original)) {
      assert.ok(key in translated, `${language}.${section}.${key}`);
      if (typeof value === 'string') assert.deepEqual([...value.matchAll(/\{\w+\}/g)].map(m=>m[0]).sort(), [...translated[key].matchAll(/\{\w+\}/g)].map(m=>m[0]).sort(), key);
    }
  }
});

test('all published courses offer complete pools and distinct answer choices across fifty-six language pairs', () => {
  const a = app();
  const files = fs.readdirSync(path.join(root,'packs')).filter(name=>name.endsWith('.js') && name!=='index.js');
  assert.ok(files.length >= 29);
  for (const id of ['airport','bus','propertyservice','getaround','jobsearch','money','trucking','foodindustry','shopping','school','emergency','pregnancy']) assert.ok(files.includes(id+'.js'));
  for (const file of files) a.run(fs.readFileSync(path.join(root,'packs',file),'utf8'));
  a.run('Object.values(PACKS).forEach(registerPack);');
  for (const file of files) for (const target of languages) for (const base of languages.filter(lang=>lang!==target)) {
    a.context.pair = {target,base,pack:file.slice(0,-3),dir:'rec',diff:1};
    const result = a.run("(()=>{const c=ctx(pair),x=c.pool[0];return {size:c.pool.length,missing:c.pool.some(w=>!w.words[pair.target]||!w.words[pair.base]),options:makeOptions(c,x,'rec').map(w=>w.words[pair.base])}})()");
    assert.ok(result.size >= 30, JSON.stringify(a.context.pair));
    assert.equal(result.missing,false);
    assert.equal(result.options.length,4);
    assert.equal(new Set(result.options).size,4);
  }
});

test('six-language dictionary and separate licensed collection preserve source references when saved', async () => {
  const data = JSON.parse(fs.readFileSync(path.join(root,'lexicon-v3.json'),'utf8'));
  const common = JSON.parse(fs.readFileSync(path.join(root,'dictionary/common-words.json'),'utf8'));
  const a = app({target:'pl',base:'ro',pack:'hotel',dir:'rec',diff:1});
  a.context.LEXICON_INDEX = {file:'lexicon-v3.json',version:'test'};
  a.context.fetch = async url => ({ok:true,json:async()=>structuredClone(String(url).startsWith('dictionary/')?common:data)});
  a.run("wordLibrary.add('hotel:en hotelgæst');");
  await a.run('loadDictionary()');
  const saved = a.run('wordLibrary.data.favorites[0]');
  assert.match(saved,/^lex:/);
  assert.equal(typeof a.run("canonicalWord('hotel:en hotelgæst')"),'string');
  assert.ok(a.run('ITEM[wordLibrary.data.favorites[0]].words.pl'));
  assert.ok(a.run('ITEM[wordLibrary.data.favorites[0]].words.ro'));
  assert.equal(a.run('dictionaryData.entries.length'),data.entries.length+common.entries.length);
  assert.equal(a.run("listPool('favorites',state.settings).length"),1);
  const commonId = common.entries[0][0];
  assert.ok(a.run(`ITEM[${JSON.stringify(commonId)}].words.da`));
  assert.equal(a.run(`ITEM[${JSON.stringify(commonId)}].words.pl`),'');
  assert.equal(data.supplements.length,1);
  assert.equal(common.license.name,'CC BY-SA 4.0');
  assert.equal(Object.keys(common.sources).length,540);
});

test('Polish and Romanian custom words survive backup and use the correct speech language', () => {
  const a = app(undefined,{stubSpeech:false});
  const spoken = [];
  const synthesis = {getVoices:()=>[],cancel(){},speak:utterance=>spoken.push(utterance)};
  Object.assign(a.context,{speechSynthesis:synthesis,SpeechSynthesisUtterance:class{constructor(text){this.text=text;}}});
  a.context.window.speechSynthesis=synthesis;
  for(const [lang,text,expected] of [['pl','gość','pl-PL'],['ro','oaspete','ro-RO'],['lt','svečias','lt-LT'],['bg','гост','bg-BG']]) {
    a.run(`speak(${JSON.stringify(text)},${JSON.stringify(lang)},true);`);
    assert.equal(spoken.at(-1).lang,expected);
  }
  a.run("const added=wordLibrary.addCustom({pl:'gość',ro:'oaspete'});wordLibrary.add(added);");
  const Library = require('../library');
  const copy = new Library();
  copy.mergeBackup(JSON.parse(JSON.stringify(a.run("({format:'jobvocabulary-library',version:1,library:wordLibrary.data})"))));
  assert.equal(Object.values(copy.data.custom)[0].words.pl,'gość');
  assert.equal(Object.values(copy.data.custom)[0].words.ro,'oaspete');
});

test('six language pages have reciprocal alternates and retain existing published paths', () => {
  const paths = ['/da/restaurant-og-koekken/','/en/restaurant-and-kitchen/','/ru/restaurant/','/uk/restaurant/','/pl/restauracja-i-kuchnia/','/ro/restaurant-si-bucatarie/'];
  for(const location of paths) {
    const html=fs.readFileSync(path.join(root,location,'index.html'),'utf8');
    for(const lang of languages) assert.match(html,new RegExp('hreflang="'+lang+'"'));
    for(const alternate of paths) assert.ok(html.includes('https://jobvocabulary.com'+alternate));
    assert.ok(!html.includes('undefined'));
  }
});

test('the original dictionary URL stays compatible with already-open four-language clients', () => {
  const old = JSON.parse(fs.readFileSync(path.join(root,'lexicon.json'),'utf8'));
  const current = JSON.parse(fs.readFileSync(path.join(root,'lexicon-v3.json'),'utf8'));
  assert.equal(old.version,2);
  assert.deepEqual(old.languages,['da','en','ru','uk']);
  assert.deepEqual(old.aliases,current.aliases);
  assert.deepEqual(old.entries.map(row=>row[0]),current.entries.map(row=>row[0]));
  for(let i=0;i<old.entries.length;i++) {
    assert.equal(old.entries[i][5],current.entries[i][7]);
    assert.equal(old.entries[i][6],current.entries[i][8]);
    assert.equal(old.entries[i].length,7);
  }
});

test('core words work in every language pair and keep accented letters on the writing keyboard', () => {
  const a = app();
  a.run(fs.readFileSync(path.join(root,'images/words/manifest.js'),'utf8'));
  a.run('Object.assign(IMG,IMAGES);');
  for(const target of languages) for(const base of languages.filter(l=>l!==target)) {
    a.context.pair = {target,base,pack:'top',dir:'write',diff:3};
    const count=a.run('buildPool(pair).length');
    assert.ok(count>=350,`${target}/${base}: ${count}`);
  }
  for(const target of ['pl','ro','lt','bg']) {
    a.context.pair={target,base:'en',pack:'top',dir:'write',diff:3};
    const missing=a.run("buildPool(pair).flatMap(word=>{const c=ctx(pair),spec=writeSpec(c,word);if(!spec)return [];const keys=makeKeys(c,spec).keys;return spec.chars.filter(ch=>isLetter(ch)&&!keys.includes(ch.toLowerCase()))})");
    assert.equal(missing.length,0,target);
    a.run(`state.settings={target:${JSON.stringify(target)},base:'en',pack:'pics',dir:'path',diff:3};`);
    assert.ok(a.run('buildPool(state.settings).length')>=180);
  }
});

test('meaning annotations stay out of exercises, speech, spelling and false alternatives', () => {
  const a=app({target:'pl',base:'en',pack:'top',dir:'write',diff:3},{stubSpeech:false});
  const spoken=[];
  const synthesis={getVoices:()=>[],cancel(){},speak:utterance=>spoken.push(utterance)};
  Object.assign(a.context,{speechSynthesis:synthesis,SpeechSynthesisUtterance:class{constructor(text){this.text=text;}}});
  a.context.window.speechSynthesis=synthesis;
  const result=a.run("(()=>{const x={id:'sample',words:{pl:'tak (odpowiedź)',en:'yes'},phrase:false};speakTarget(x,true);return {html:wordHTML(x,'pl'),spec:writeSpec(ctx(),x)}})()");
  assert.equal(spoken[0].text,'tak');
  assert.equal(result.spec.chars.join(''),'tak');
  assert.doesNotMatch(result.html,/word-sense|odpowiedź/);
  assert.match(result.html,/>tak<\/span>/);
  assert.equal(a.run("lexicalForm({phrase:true,words:{pl:'Znalazłem(-am) telefon.'}},'pl')"),'Znalazłem(-am) telefon.');
  a.run("state.settings.target='ro';");
  assert.equal(a.run("writeSpec(ctx(),{phrase:false,words:{ro:'a face (a crea)'}}).chars.join('')"),'face');
  assert.equal(a.run("splitPrefix(ctx(),{phrase:false,words:{ro:'a face (a crea)'}}).prefix"),'a');
  a.run("state.settings.target='pl'; current=null;");
  const choices=a.run("makeOptions(ctx(),ITEM.yes,'rec').map(x=>lexicalForm(x,'pl'))");
  assert.equal(choices.filter(value=>value==='tak').length,1);
});

test('automatic word lookup offers every annotated meaning instead of selecting an unannotated homograph', () => {
  const WordEntry=require('../word-entry');
  const entries=[{id:'lex:yes',words:{pl:'tak (odpowiedź)',en:'yes'}},{id:'lex:so',words:{pl:'tak',en:'so'}}];
  const draft=new WordEntry(entries,{target:'pl',base:'en'});
  draft.setWord('tak');
  assert.equal(draft.hint,'chooseMeaning');
  assert.equal(draft.matches.length,2);
  assert.equal(draft.translation,'');
  draft.select('lex:yes');
  assert.equal(draft.translation,'yes');
  assert.equal(draft.knownId(),'lex:yes');
});
