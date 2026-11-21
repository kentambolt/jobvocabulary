const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const app=require('./helpers/app.cjs'),WordEntry=require('../word-entry');
const dictionary=JSON.parse(fs.readFileSync(require.resolve('../lexicon-v4.json'),'utf8'));
const entries=dictionary.entries.map(row=>({id:row[0],words:Object.fromEntries(dictionary.languages.map((lang,i)=>[lang,row[i+1]])),phrase:!!row[9]}));

test('a garden path and an animal pen remain distinct meanings of Danish sti',()=>{
  const pathId=dictionary.entries[dictionary.aliases['gardening:en sti']][0];
  const penId=dictionary.entries[dictionary.aliases['agriculture:en sti']][0];
  assert.notEqual(pathId,penId);
  const draft=new WordEntry(entries,{target:'da',base:'en'});draft.setWord('sti');
  assert.equal(draft.hint,'chooseMeaning');
  assert.ok(draft.matches.some(entry=>entry.id===pathId));
  assert.ok(draft.matches.some(entry=>entry.id===penId));
  draft.select(pathId);assert.equal(draft.translation,'path');assert.equal(draft.knownId(),pathId);
});

test('knowing the animal-pen meaning does not seed the unrelated garden path',()=>{
  const a=app({pack:'agriculture',target:'da',base:'en',dir:'rec',diff:3});
  for(const pack of ['agriculture','gardening'])a.run(fs.readFileSync(require.resolve('../packs/'+pack+'.js'),'utf8')+`;registerPack(PACKS.${pack});`);
  a.run('const farm=ctx();farm.prog.cards["agriculture:en sti"]={lvl:5,ok:true,right:7,wrong:0,time:Date.now()-1000,task:7};CourseKnowledge.mark(farm.prog.cards["agriculture:en sti"],"agriculture:en sti");state.settings={...state.settings,pack:"gardening"};');
  assert.equal(a.run('Object.hasOwn(ctx().prog.cards,"gardening:en sti")'),false);
});

test('overlapping soil and digging-tool terms cannot become wrong alternatives in gardening',()=>{
  const a=app();a.run(fs.readFileSync(require.resolve('../packs/gardening.js'),'utf8')+';registerPack(PACKS.gardening);');
  const languages=['da','en','ru','uk','pl','ro','lt','bg'];
  for(const target of languages)for(const base of languages.filter(lang=>lang!==target))for(const group of [['spade','skovl'],['jord','muld']])for(const source of group)for(const direction of ['rec','prod']){
    Object.assign(a.context,{pair:{pack:'gardening',target,base,diff:3,dir:'rec'},group,source,direction});
    const result=a.run(`(()=>{const c=ctx(pair),word=c.pool.find(x=>answerSource(x)===source);return {choices:makeOptions(c,word,direction).length,wrongOverlap:pickDistractors(c,word,direction,1000).some(x=>group.includes(answerSource(x)))};})()`);
    assert.equal(result.choices,4);assert.equal(result.wrongOverlap,false,JSON.stringify({target,base,source,direction}));
  }
});
