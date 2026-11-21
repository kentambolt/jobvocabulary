const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const counts=require('../data/course-counts');
test('course count labels remain independent of numeral inflection in every language',()=>{
 for(const lang of ['da','en','ru','uk','pl','ro','lt','bg'])for(const total of [0,1,2,11,21,24,108,201,393,690]){
  const text=counts.count(lang,total,21);assert.equal(text,counts.labels[lang][0]+': '+total+' · '+counts.labels[lang][1]+': 21');
  assert.ok(counts.intro(lang,total,21).startsWith(text+'. '));
 }
 assert.throws(()=>counts.count('unknown',1),/Unknown count language/);
 for(const n of [-1,NaN,1.5])assert.throws(()=>counts.count('en',n),/nonnegative integers/);
});
test('catalogue cards and course metadata contain accurate counts from the real course rows',()=>{
 const routes=require('../data/course-urls.json');
 for(const[id,paths]of Object.entries(routes)){
  const ctx={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../packs/'+id+'.js'),'utf8'),ctx);
  const pack=ctx.PACKS[id],total=pack.categories.reduce((n,c)=>n+c.rows.length,0);
  for(const[lang,route]of Object.entries(paths)){
   const html=fs.readFileSync(path.join(__dirname,'..',route,'index.html'),'utf8');
   assert.ok(html.includes(counts.count(lang,total)+'.'),id+'/'+lang);
   assert.ok(html.includes(counts.count(lang,total,pack.categories.length)),id+'/'+lang);
   const catalogue=fs.readFileSync(path.join(__dirname,'..',lang,'index.html'),'utf8');
   assert.ok(catalogue.includes(counts.count(lang,total,pack.categories.length)),id+'/'+lang);
  }
 }
});
