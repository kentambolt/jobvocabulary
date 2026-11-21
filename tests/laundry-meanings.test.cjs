const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),app=require('./helpers/app.cjs');
test('laundry questions exclude overlapping detergent, workwear and label answers in every language pair',()=>{
 const a=app();a.run(fs.readFileSync(require.resolve('../packs/laundry.js'),'utf8')+';registerPack(PACKS.laundry);');
 const langs=['da','en','ru','uk','pl','ro','lt','bg'];
 for(const target of langs)for(const base of langs.filter(l=>l!==target))for(const group of [['vaskepulver','vaskemiddel'],['etiket','vaskemærkning'],['arbejdstøj','uniform']])for(const source of group)for(const direction of ['rec','prod']){
  Object.assign(a.context,{target,base,group,source,direction});
  const r=a.run(`(()=>{const c=ctx({pack:'laundry',target,base,diff:3,dir:'rec'}),x=c.pool.find(x=>answerSource(x)===source);return {n:makeOptions(c,x,direction).length,overlap:pickDistractors(c,x,direction,1000).some(x=>group.includes(answerSource(x)))};})()`);
  assert.equal(r.n,4);assert.equal(r.overlap,false,JSON.stringify({target,base,source,direction}));
 }
});
