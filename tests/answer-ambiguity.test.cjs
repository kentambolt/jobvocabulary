const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const app=require('./helpers/app.cjs');

test('job and position remain separate learning words without appearing as wrong answers for one another',()=>{
  const a=app();
  a.run(fs.readFileSync(path.join(__dirname,'../packs/jobsearch.js'),'utf8')+';registerPack(PACKS.jobsearch);');
  for(const pair of [{target:'da',base:'en'},{target:'en',base:'da'},{target:'lt',base:'bg'},{target:'pl',base:'ro'}]){
    a.context.pair={...pair,pack:'jobsearch',diff:3,dir:'rec'};
    for(const source of ['et job','en stilling','en ledig stilling'])for(const direction of ['rec','prod']){
      a.context.source=source;a.context.direction=direction;
      const result=a.run(`(()=>{const c=ctx(pair),word=c.pool.find(x=>x.words.da===source),other=c.pool.filter(x=>['et job','en stilling','en ledig stilling'].includes(x.words.da)&&x.id!==word.id);const all=pickDistractors(c,word,direction,1000);const options=makeOptions(c,word,direction);return {correct:options.filter(x=>x.id===word.id).length,options:options.length,wrongOverlap:all.some(x=>other.some(y=>y.id===x.id)),separate:other.every(x=>word.id!==x.id)}})()`);
      assert.equal(result.separate,true);
      assert.equal(result.correct,1);
      assert.equal(result.options,4);
      assert.equal(result.wrongOverlap,false,JSON.stringify({pair,source,direction}));
    }
  }
});
