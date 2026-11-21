const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const CourseKnowledge=require('../course-knowledge'),MemoryScheduler=require('../memory-scheduler');
const app=require('./helpers/app.cjs');
const NOW=Date.UTC(2026,10,21),DAY=86400000;
const key=s=>[s.pack,s.target,s.base,s.dir].join('|');
const learned=card=>card.ok&&card.lvl>=2;
const group={key:'current-meaning',ids:['first:word','second:word','third:word']};
function realCard(extra={}){
  const card={lvl:5,ok:true,right:7,wrong:0,time:NOW-DAY,task:7,...extra};
  MemoryScheduler.ensure(card,NOW);card.memory.log=[[Math.floor(card.time/1000),card.ok?3:1,1]];
  return card;
}
function fixture(){
  const helper=CourseKnowledge.create([group]);
  const settings={pack:'third',target:'da',base:'en',dir:'rec',diff:1};
  const progress={task:0,cards:{}};
  const state={progress:{[key({...settings,pack:'first'})]:{task:7,cards:{'first:word':realCard()}},[key(settings)]:progress}};
  const options={state,settings,pool:[{id:'third:word'}],progress,learned,progressKey:key,now:NOW};
  return {helper,settings,progress,state,options,seed:()=>helper.seed(options)};
}

test('identical course words carry scheduling confidence without invented answers or source mutations',()=>{
  const f=fixture(),source=f.state.progress['first|da|en|rec'].cards['first:word'];
  const before=JSON.stringify(source);
  assert.equal(f.seed(),1);
  const card=f.progress.cards['third:word'];
  assert.equal(card.memory.due,source.memory.due);
  assert.equal(card.memory.s,source.memory.s);
  assert.equal(card.memory.reps,source.memory.reps);
  assert.deepEqual(card.memory.log,[]);
  assert.equal(card.memory.estimated,true);
  assert.equal(card.right,0);assert.equal(card.wrong,0);assert.equal(f.progress.task,0);
  assert.equal(card.time,source.time);
  assert.equal(JSON.stringify(source),before);
  assert.equal(MemoryScheduler.valid(card.memory),true);
  assert.equal(f.seed(),0);
});

test('language pairs, task types, pictures and deliberate personal-list practice stay separate',()=>{
  for(const change of [{base:'pl'},{target:'ru'},{dir:'write'},{pack:'pics'},{pack:'list:favorites'},{base:'da'}]){
    const f=fixture();Object.assign(f.settings,change);assert.equal(f.seed(),0,JSON.stringify(change));
  }
});

test('an existing target error is never replaced by another course confidence',()=>{
  const f=fixture(),failed=realCard({lvl:0,ok:false,right:0,wrong:1});
  f.progress.cards['third:word']=failed;
  assert.equal(f.seed(),0);
  assert.equal(f.progress.cards['third:word'],failed);
});

test('the latest actual failure blocks older knowledge, including same-time conservative ties',()=>{
  for(const time of [NOW-DAY,NOW-1]){
    const f=fixture();f.state.progress['second|da|en|rec']={cards:{'second:word':realCard({time,lvl:0,ok:false,right:0,wrong:1})}};
    assert.equal(f.seed(),0);
    assert.equal(f.progress.cards['third:word'],undefined);
  }
});

test('inferred-only cards and future-dated events cannot spread knowledge',()=>{
  for(const extra of [{right:0,wrong:0},{time:NOW+1}]){
    const f=fixture();f.state.progress['first|da|en|rec'].cards['first:word']=realCard(extra);
    assert.equal(f.seed(),0);
  }
});

test('reset cutoffs reject old evidence and allow genuinely later practice',()=>{
  const f=fixture();f.progress.knowledgeResetAt=NOW;
  assert.equal(f.seed(),0);
  f.options.now=NOW+2;
  f.state.progress['first|da|en|rec'].cards['first:word']=realCard({time:NOW+1});
  assert.equal(f.seed(),1);
});

test('a changed meaning fingerprint needs fresh evidence before transfer',()=>{
  const f=fixture(),source=f.state.progress['first|da|en|rec'].cards['first:word'];
  source.meaningKey='old-meaning';assert.equal(f.seed(),0);
  f.helper.mark(source,'first:word');assert.equal(source.meaningKey,group.key);
  assert.equal(f.seed(),1);
});

test('the generated compact index groups exact eight-language meanings and preserves phrase distinctions',()=>{
  const groups=require('../shared-word-groups'),records=new Map(),languages=['da','en','ru','uk','pl','ro','lt','bg'];
  const signature=(words,phrase)=>crypto.createHash('sha256').update(JSON.stringify(languages.map(lang=>(words[lang]||'').trim().toLocaleLowerCase()))+'|'+Number(phrase)).digest('hex').slice(0,16);
  for(const word of require('../words').CONCEPTS)records.set(word.id,signature(word.words,false));
  const context={};for(const file of fs.readdirSync(require('node:path').join(__dirname,'../packs')).filter(file=>file.endsWith('.js')&&file!=='index.js'))vm.runInNewContext(fs.readFileSync(require.resolve('../packs/'+file),'utf8'),context);
  const stable=require('../data/stable-word-ids.json');
  for(const pack of Object.values(context.PACKS))for(const category of pack.categories)for(const row of category.rows){
    const id=stable[pack.id]?.[row[1]]||pack.id+':'+row[1];
    records.set(id,signature(Object.fromEntries(languages.map((lang,i)=>[lang,row[i+1]])),category.type==='phrase'));
  }
  const seen=new Set();
  for(const group of groups){assert.ok(group.ids.length>1);for(const id of group.ids){assert.equal(records.get(id),group.key,id);assert.equal(seen.has(id),false,id);seen.add(id);}}
  assert.ok(groups.length>300);assert.ok(fs.statSync(require.resolve('../shared-word-groups')).size<100000);
});

test('real recognition and spelling evidence transfer independently while resets retain source history',()=>{
  const a=app({pack:'itsupport',target:'da',base:'en',dir:'rec',diff:1},{now:NOW});
  for(const id of ['itsupport','office'])a.run(fs.readFileSync(require.resolve('../packs/'+id+'.js'),'utf8')+`;registerPack(PACKS.${id});`);
  a.run('const word=ITEM["itsupport:en computer"];current={kind:"new",concept:word,qdir:"rec",options:[word]};choose(0);');
  const source=a.run('JSON.stringify(state.progress["itsupport|da|en|rec"].cards["itsupport:en computer"])');
  a.run('state.settings={pack:"office",target:"da",base:"en",dir:"rec",diff:1,modes:["rec","write"]};current=null;');
  assert.equal(a.run('combinedCards(state.settings,ctx().pool)["office:en computer"].ok'),false);
  assert.equal(a.run('ctx().prog.cards["office:en computer"].right'),0);
  assert.equal(a.run('ctx().prog.cards["office:en computer"].memory.log.length'),0);
  assert.equal(a.run('JSON.stringify(state.progress["itsupport|da|en|rec"].cards["itsupport:en computer"])'),source);
  a.run('state.settings={pack:"itsupport",target:"da",base:"en",dir:"write",diff:1};current={kind:"write",concept:word,qdir:"prod",isNew:true};startWrite(ctx(),word);const letters=current.spec.chars.filter(isLetter);for(const letter of letters)pressKey(letter);');
  a.run('state.settings={pack:"office",target:"da",base:"en",dir:"rec",diff:1,modes:["rec","write"]};current=null;');
  assert.equal(a.run('combinedCards(state.settings,ctx().pool)["office:en computer"].ok'),true);
  a.context.confirm=()=>true;a.run('render=()=>{};renderStats();document.getElementById("resetBtn").onclick();');
  assert.equal(a.run('ctx().prog.cards["office:en computer"]'),undefined);
  assert.equal(a.run('state.progress["itsupport|da|en|rec"].cards["itsupport:en computer"].right'),1);
});
