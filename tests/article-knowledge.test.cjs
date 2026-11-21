const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('crypto'),fs=require('fs'),app=require('./helpers/app.cjs');
const signature=words=>crypto.createHash('sha256').update(JSON.stringify(['da','en','ru','uk','pl','ro','lt','bg'].map(l=>words[l].trim().toLocaleLowerCase()))+'|0').digest('hex').slice(0,16);
const groups=require('../shared-word-groups');
test('core noun knowledge transfers across optional Danish articles with legacy fingerprints',()=>{
 for(const [sourcePack,targetPack,sourceId,targetId]of [['top','salon','scissors','salon:en saks'],['salon','top','salon:en saks','scissors']])for(const dir of ['rec','write']){
  const a=app({pack:sourcePack,target:'da',base:'en',dir,diff:3});
  a.run(fs.readFileSync(require.resolve('../packs/salon.js'),'utf8')+';registerPack(PACKS.salon);');
  Object.assign(a.context,{sourceId,targetId,targetPack,signature});
  a.run(`const card={lvl:5,ok:true,right:7,wrong:0,time:Date.now()-1000,task:7,meaningKey:signature(ITEM[sourceId].words)};ctx().prog.cards[sourceId]=card;`);
  const before=a.run('JSON.stringify(ctx().prog.cards[sourceId])');
  a.run('state.settings={...state.settings,pack:targetPack};');
  assert.equal(a.run('ctx().prog.cards[targetId].ok'),true);
  assert.equal(a.run('ctx().prog.cards[targetId].right'),0);
  assert.equal(a.run('ctx().prog.cards[targetId].wrong'),0);
  assert.equal(a.run('ctx().prog.cards[targetId].memory.log.length'),0);
  assert.equal(a.run('JSON.stringify(state.progress[progKey({...state.settings,pack:targetPack===\'top\'?\'salon\':\'top\'})].cards[sourceId])'),before);
 }
});
test('article bridging preserves qualifiers and different meanings',()=>{
 assert.equal(groups.some(g=>g.ids.includes('gardening:en sti')&&g.ids.includes('agriculture:en sti')),false);
 for(const g of groups.filter(g=>g.ids.includes('scissors'))){assert.ok(g.keys.length);assert.equal(new Set([g.key,...g.keys]).size,g.keys.length+1);}
});
test('a changed translation fingerprint still requires fresh evidence after article bridging',()=>{
 const a=app({pack:'top',target:'da',base:'en',dir:'rec',diff:3});
 a.run(fs.readFileSync(require.resolve('../packs/salon.js'),'utf8')+';registerPack(PACKS.salon);ctx().prog.cards.scissors={lvl:5,ok:true,right:7,wrong:0,time:Date.now()-1000,task:7,meaningKey:"changed-meaning"};state.settings={...state.settings,pack:"salon"};');
 assert.equal(a.run('Object.hasOwn(ctx().prog.cards,"salon:en saks")'),false);
});
