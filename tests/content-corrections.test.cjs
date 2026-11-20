const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=require('./helpers/app.cjs');
const root=path.resolve(__dirname,'..');
const oldId='restaurant:Varm mad skal holdes over 65 grader.';
const corrected='Mad, der varmholdes uden særskilt dokumentation, skal være mindst 56 grader.';
const newSource='restaurant:'+corrected;
const packSource=fs.readFileSync(path.join(root,'packs/restaurant.js'),'utf8');
const settings={target:'da',base:'en',pack:'restaurant',dir:'rec',diff:2};

test('a corrected Danish sentence keeps the existing practice identity and stored learning history',()=>{
  const a=app(settings);
  a.run(packSource+'; registerPack(PACKS.restaurant);');
  a.context.previousCard={lvl:3,ok:true,right:7,wrong:2,task:42,time:1780000000000,memory:{due:1799999999999,log:[{result:'correct'}]}};
  a.run(`ctx().prog.cards[${JSON.stringify(oldId)}]=previousCard; saveState();`);
  const b=app(settings,{rawState:a.storage.get('topwords.v2')});
  b.run(packSource+'; registerPack(PACKS.restaurant);');
  assert.equal(b.run(`ITEM[${JSON.stringify(oldId)}].words.da`),corrected);
  assert.ok(b.run(`ctx().pool.some(item=>item.id===${JSON.stringify(oldId)})`));
  assert.deepEqual(JSON.parse(b.run(`JSON.stringify(ctx().prog.cards[${JSON.stringify(oldId)}])`)),a.context.previousCard);
  assert.equal(b.run(`Boolean(ITEM[${JSON.stringify(newSource)}])`),false);
});

test('retired source references and saved dictionary words resolve to the corrected six-language sentence',async()=>{
  const dictionary=JSON.parse(fs.readFileSync(path.join(root,'lexicon-v3.json'),'utf8'));
  const common=JSON.parse(fs.readFileSync(path.join(root,'dictionary/common-words.json'),'utf8'));
  const record=dictionary.entries[dictionary.aliases[oldId]];
  assert.ok(record);
  assert.equal(dictionary.aliases[newSource],dictionary.aliases[oldId]);
  assert.equal(record[1],corrected);
  for(const text of record.slice(1,7)){assert.match(text,/56/);assert.doesNotMatch(text,/65/);}
  const a=app(settings);
  a.context.LEXICON_INDEX={file:'lexicon-v3.json',version:'test'};
  a.context.fetch=async url=>({ok:true,json:async()=>structuredClone(String(url).startsWith('dictionary/')?common:dictionary)});
  a.run(`wordLibrary.add(${JSON.stringify(oldId)});`);
  await a.run('loadDictionary()');
  assert.equal(a.run('wordLibrary.data.favorites[0]'),record[0]);
  assert.equal(a.run('ITEM[wordLibrary.data.favorites[0]].words.da'),corrected);
});
