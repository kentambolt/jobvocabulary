const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const WordEntry=require('../word-entry'),app=require('./helpers/app.cjs');
const words={da:'saks',en:'scissors',ru:'ножницы',uk:'ножиці',pl:'nożyczki',ro:'foarfecă',lt:'žirklės',bg:'ножица'};
const core={id:'lex:core',words,phrase:false};
const course={id:'lex:course',words:{...words,da:'en saks'},phrase:false};
const pair={target:'pl',base:'lt'};

test('dictionary search groups complete eight-language article variants without mutating IDs or forms',()=>{
  const entries=[core,course],before=JSON.stringify(entries);
  assert.equal(WordEntry.equivalenceKey(core),WordEntry.equivalenceKey(course));
  assert.equal(WordEntry.search(entries,'nożyczki',pair).length,1);
  assert.equal(WordEntry.search(entries,'en saks',{target:'da',base:'en'})[0].id,course.id);
  const draft=new WordEntry(entries,pair);draft.setWord('nożyczki');
  assert.equal(draft.hint,'found');assert.equal(draft.translation,'žirklės');assert.equal(draft.knownId(),core.id);
  assert.equal(JSON.stringify(entries),before);
});

test('a matching saved variant is the result even when the query contains the other Danish article form',()=>{
  assert.equal(WordEntry.search([core,course],'nożyczki',pair,20,[course.id])[0].id,course.id);
  assert.equal(WordEntry.search([core,course],'en saks',{target:'da',base:'en'},20,[core.id])[0].id,core.id);
  const draft=new WordEntry([core,course],{target:'da',base:'lt'});draft.setWord('en saks');
  assert.equal(draft.selectedId,course.id);assert.equal(draft.knownId(),course.id);
});

test('same visible pair never collapses different senses, qualifiers, phrases or incomplete translations',()=>{
  for(const other of [
    {...course,words:{...course.words,bg:'друго значение'}},
    {...course,words:{...course.words,en:'scissors (hairdressing)'}},
    {...course,phrase:true},
    {...course,words:{...course.words,bg:''}},
  ])assert.equal(WordEntry.search([core,other],'nożyczki',pair).length,2);
  assert.notEqual(WordEntry.equivalenceKey({...core,words:{...words,da:'klippe'}}),WordEntry.equivalenceKey({...core,words:{...words,da:'at klippe'}}));
  assert.equal(WordEntry.equivalenceKey(null),null);
  assert.equal(WordEntry.search([null,core],'nożyczki',pair).length,1);
});

test('real scissors lookup returns one saved result while all dictionary records and list IDs remain intact',async()=>{
  const dictionary=JSON.parse(fs.readFileSync(require.resolve('../lexicon-v4.json'),'utf8'));
  const common=JSON.parse(fs.readFileSync(require.resolve('../dictionary/common-words-v2.json'),'utf8'));
  const a=app({pack:'salon',...pair,dir:'rec',diff:1});
  a.context.LEXICON_INDEX={file:'lexicon-v4.json',version:'test'};
  a.context.fetch=async url=>({ok:true,json:async()=>structuredClone(String(url).startsWith('dictionary/')?common:dictionary)});
  await a.run('loadDictionary()');
  a.run("wordLibrary.add(canonicalWord('salon:en saks'));");
  const saved=a.run('wordLibrary.data.favorites[0]');
  const result=JSON.parse(a.run('JSON.stringify(dictionaryMatches("nożyczki",state.settings))'));
  assert.equal(result.length,1);assert.equal(result[0].id,saved);
  assert.equal(a.run('wordLibrary.data.favorites.length'),1);
  assert.equal(a.run('dictionaryData.entries.length'),dictionary.entries.length+common.entries.length);
});
