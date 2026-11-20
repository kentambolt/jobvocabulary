const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=require('./helpers/app.cjs');

test('small topics have four unambiguous choices without widening their question pool or difficulty',()=>{
  const a=app();
  for(const pack of ['cleaning','jobsearch'])a.run(fs.readFileSync(path.join(__dirname,'../packs',pack+'.js'),'utf8')+`;registerPack(PACKS.${pack});`);
  for(const pack of ['cleaning','jobsearch'])for(const [target,base]of [['da','en'],['ru','uk'],['pl','ro'],['lt','bg']])for(const direction of ['rec','prod']){
    a.context.pair={pack,target,base,diff:1,dir:'rec',cats:[pack==='cleaning'?'sorting':a.run('PACKS.jobsearch.categories[0].key')]};
    a.context.direction=direction;
    const result=a.run(`(()=>{state.settings=pair;const c=ctx(),ids=c.pool.map(x=>x.id);const options=makeOptions(c,c.pool[0],direction);c.prog.offered=true;current=null;renderPlay();return {n:options.length,unique:new Set(options.map(x=>optionLabel(c,x,direction))).size,withinCourse:options.every(x=>x.id.startsWith(pair.pack+':')),withinLevel:options.every(x=>x.diff<=pair.diff),primaryInScope:ids.includes(current.concept.id),poolUnchanged:JSON.stringify(buildPool(pair).map(x=>x.id))===JSON.stringify(ids)}})()`);
    assert.equal(result.n,4,JSON.stringify(a.context.pair));
    assert.equal(result.unique,4);
    assert.equal(result.withinCourse,true);
    assert.equal(result.withinLevel,true);
    assert.equal(result.primaryInScope,true);
    assert.equal(result.poolUnchanged,true);
  }
});
