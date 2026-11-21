const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const app=require('./helpers/app.cjs');
const samples=[['da','construction','construction:en arbejdsmiljørepræsentant'],['en','foodindustry','foodindustry:krydskontamination'],['ru','jobsearch','jobsearch:servicemindet'],['uk','jobsearch','jobsearch:servicemindet'],['pl','jobsearch','jobsearch:ufaglært'],['ro','jobsearch','jobsearch:ansvar'],['lt','trucking','trucking:en lastbilkran'],['bg','childcare','childcare:en souschef']];
test('long real terms in every language start spelling and record actual typed answers',()=>{
 for(const [target,pack,id]of samples){
  const a=app({target,base:target==='en'?'da':'en',pack,diff:3,dir:'write',modes:['write']});
  a.context.wordId=id;
  a.run(fs.readFileSync(require.resolve('../packs/'+pack+'.js'),'utf8')+`;registerPack(PACKS.${pack});`);
  a.run('const c=ctx();current=pickNext({...c,pool:[ITEM[wordId]]});');
  assert.equal(a.run('current.kind'),'write',target);
  assert.equal(a.run('current.isNew'),true,target);
  a.run('startWrite(ctx(),current.concept);const letters=current.spec.chars.filter(isLetter).map(x=>x.toLowerCase());for(const letter of letters)pressKey(letter);');
  assert.equal(a.run('ctx().prog.cards[wordId].right'),1,target);
  assert.equal(a.run('ctx().prog.cards[wordId].wrong'),0,target);
  assert.equal(a.run('ctx().prog.cards[wordId].memory.log[0][2]'),2,target);
 }
});
test('one-letter words remain writable and bounded long forms do not admit unbounded response strips',()=>{
 const a=app();
 a.context.forms=['i','abcdefgh-ijklmnop-qrstuvwx-yzabcdef-','a'.repeat(33),'a'.repeat(32)+'-----','two words'];
 const result=a.run('forms.map(text=>writeSpec(ctx(),{phrase:false,words:{da:text,en:"example"}}))');
 assert.equal(result[0].chars.length,1);
 assert.equal(result[1].chars.length,36);
 assert.equal(result[2],null);
 assert.equal(result[3],null);
 assert.equal(result[4],null);
});
