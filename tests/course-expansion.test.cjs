const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const app=require('./helpers/app.cjs');
const catalogue=require('../catalog');
const newCourses=['carowner','community','fish','harbour','medicaldanish','pets','removals','security','trades','traditions','wellbeing'];
const expanded=['automotive','salon','gardening','bakery','restaurant','office','itsupport'];
const register=(a,id)=>a.run(fs.readFileSync(require.resolve('../packs/'+id+'.js'),'utf8')+`;registerPack(PACKS.${id});`);

test('new courses belong to one group and start with four distinct choices in every language direction',()=>{
 const languages=['da','en','ru','uk','pl','ro','lt','bg'];
 for(const id of newCourses){
  assert.equal(catalogue.groups.filter(g=>g.packs.includes(id)).length,1);
  const a=app();register(a,id);
  for(const target of languages)for(const base of languages.filter(l=>l!==target)){
   a.context.pair={target,base,pack:id,dir:'rec',diff:3};
   const result=a.run(`(()=>{const c=ctx(pair);return ['word','phrase'].map(type=>{const word=c.pool.find(x=>Boolean(x.phrase)===(type==='phrase'));return ['rec','prod'].map(dir=>{const choices=makeOptions(c,word,dir);return {count:choices.length,labels:new Set(choices.map(x=>optionLabel(c,x,dir))).size,correct:choices.filter(x=>x.id===word.id).length};});}).flat();})()`);
   for(const choices of result){assert.equal(choices.count,4,id+'/'+target+'/'+base);assert.equal(choices.labels,4);assert.equal(choices.correct,1);}
  }
 }
 for(const id of ['mechanic','hairdresser','parks','takeaway','intloffice'])assert.equal(catalogue.groups.some(g=>g.packs.includes(id)),false);
});

test('expanded courses restore existing cards and topic selections without resetting memory',()=>{
 const manifest={};require('node:vm').runInNewContext(fs.readFileSync(require.resolve('../packs/index.js'),'utf8'),manifest);
 for(const id of expanded){
  const category=manifest.PACK_INDEX.find(p=>p.id===id).categories[0].key;
  const saved={pack:id,target:'pl',base:'lt',dir:'write',diff:2,cats:[category],repeatLearned:false};
  const a=app(saved);register(a,id);
  a.run('const oldWord=ctx().pool[0];ctx().prog.cards[oldWord.id]={lvl:3,ok:true,right:7,wrong:2,time:123456,memory:{due:1999999999999,stability:42,difficulty:3}};saveState();');
  const expected=JSON.parse(a.run('JSON.stringify(ctx().prog.cards[oldWord.id])')),word=a.run('oldWord.id');
  const b=app(saved,{rawState:a.storage.get('topwords.v2')});register(b,id);b.context.word=word;
  assert.deepEqual(JSON.parse(b.run('JSON.stringify(ctx().prog.cards[word])')),expected,id);
  assert.deepEqual(JSON.parse(b.run('JSON.stringify(state.settings.cats)')),[category]);
  assert.equal(b.run('state.settings.repeatLearned'),false);
 }
});

test('closely related new workshop and bakery terms never compete as wrong answers',()=>{
 for(const [id,sources]of [['automotive',['en skruenøgle','en gaffelnøgle']],['bakery',['et rundstykke','en bolle']],['security',['en vagtmand','en vagtfunktionær']]]){
  const a=app({pack:id,target:'da',base:'pl',dir:'rec',diff:3});register(a,id);a.context.sources=sources;
  assert.equal(a.run(`(()=>{const c=ctx(),word=c.pool.find(x=>x.words.da===sources[0]);return pickDistractors(c,word,'prod',1000).some(x=>x.words.da===sources[1]);})()`),false);
 }
});
