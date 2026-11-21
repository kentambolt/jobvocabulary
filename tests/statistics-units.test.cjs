const test=require('node:test'),assert=require('node:assert/strict'),app=require('./helpers/app.cjs');
test('statistics intervals have localized minute, hour and day units in every interface language',()=>{
 const expected={da:['5 min','1,5 t','2,5 d'],en:['5 min','1.5 h','2.5 d'],ru:['5 мин','1,5 ч','2,5 дн'],uk:['5 хв','1,5 год','2,5 дн'],pl:['5 min','1,5 godz.','2,5 d'],ro:['5 min','1,5 h','2,5 z'],lt:['5 min','1,5 val.','2,5 d.'],bg:['5 мин','1,5 ч','2,5 дн']};
 for(const [lang,values]of Object.entries(expected)){
  const a=app(undefined,{search:'?ui='+lang});
  const actual=a.run('[fmtDuration(5),fmtDuration(90),fmtDuration(3600)]');
  assert.deepEqual([...actual],values,lang);assert.doesNotMatch(actual.join(' '),/undefined/);
 }
});

test('statistics omit unavailable frequency columns while retaining core corpus measurements',()=>{
 const fs=require('node:fs');
 for(const [pack,target,show]of [['worklife','da',false],['top','pl',false],['top','ro',false],['top','da',true],['top','en',true],['list:favorites','da',false]]){
  const a=app({pack,target,base:target==='en'?'da':'en',dir:'rec',diff:1});
  if(pack==='worklife')a.run(fs.readFileSync(require.resolve('../packs/worklife.js'),'utf8')+';registerPack(PACKS.worklife);');
  if(pack==='list:favorites')a.run(`wordLibrary.addCustom({da:'mit testord',en:'my test word'});const id=Object.keys(wordLibrary.data.custom)[0];wordLibrary.add(id);registerOwnWords();`);
  const html=a.run(`(()=>{const c=ctx(),x=c.pool[0];c.prog.cards[x.id]={lvl:2,ok:true,right:1,wrong:0,time:Date.now()-1000,task:1};renderStats();return document.getElementById('app').innerHTML;})()`);
  const header=html.match(/<thead>([\s\S]*?)<\/thead>/)[1],row=html.match(/<tbody>\s*<tr>([\s\S]*?)<\/tr>/)[1];
  assert.equal((header.match(/<th scope="col">/g)||[]).length,show?8:7,pack+'/'+target);
  assert.equal((row.match(/<td\b/g)||[]).length,show?8:7,pack+'/'+target);
  assert.equal(header.includes(a.run("t('cols')[2]")),show,pack+'/'+target);
  assert.ok(row.includes(`<td class="wrap" lang="${target}">`));
  assert.ok(row.includes(`<td class="wrap" lang="${target==='en'?'da':'en'}">`));
 }
});
