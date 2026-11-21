const test=require('node:test'),assert=require('node:assert/strict'),app=require('./helpers/app.cjs');
function fixture(){
 const a=app({pack:'list:favorites',target:'pl',base:'lt',dir:'rec',diff:3});
 a.run(`Object.assign(ITEM,Object.fromEntries([
 ['answer','nożyczki','žirklės'],['saved','fryzjer','kirpėjas'],
 ['one','dom','namas'],['two','ogród','sodas'],['three','klient','klientas'],
 ['four','stół','stalas'],['five','but','batas'],['six','woda','vanduo'],
 ['long','bardzo długi wniosek o wydanie dokumentu','prašymas išduoti vairuotojo pažymėjimą']
 ].map(([id,pl,lt])=>['lex:'+id,{id:'lex:'+id,words:{pl,lt,da:id},phrase:false,pos:'dictionary',diff:1}])));
 wordLibrary.add('lex:answer');wordLibrary.add('lex:saved');`);
 return a;
}
test('short personal lists keep saved choices first and fill from varied readable alternatives',()=>{
 const a=fixture(),seen=new Set();
 for(const qdir of ['rec','prod'])for(let i=0;i<60;i++){
  a.context.qdir=qdir;
  const result=a.run(`(()=>{const c=ctx(),options=makeOptions(c,ITEM['lex:answer'],qdir);return {ids:options.map(x=>x.id),labels:options.map(x=>optionLabel(c,x,qdir)),pool:c.pool.map(x=>x.id)};})()`);
  assert.equal(result.ids.length,4);assert.equal(new Set(result.labels).size,4);
  assert.ok(result.ids.includes('lex:saved'));assert.ok(!result.ids.includes('lex:long'));
  assert.deepEqual([...result.pool],['lex:answer','lex:saved']);
  result.ids.forEach(id=>seen.add(id));
 }
 assert.ok(seen.size>=7,'fallbacks vary instead of using the same three shortest words');
});
test('sparse personal dictionaries still get four choices when only long fallbacks exist',()=>{
 const a=fixture();
 a.run(`for(const id of ['one','two','three','four','five','six'])delete ITEM['lex:'+id];ITEM['lex:longer']={id:'lex:longer',words:{pl:'inny długi termin techniczny',lt:'kitas ilgas techninis terminas',da:'other'},phrase:false,pos:'dictionary',diff:1};`);
 assert.equal(a.run(`makeOptions(ctx(),ITEM['lex:answer'],'rec').length`),4);
});
