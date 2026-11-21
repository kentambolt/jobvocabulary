const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const guide=require('../data/guides/customer-talk'),app=require('./helpers/app.cjs');
const languages=['da','en','ru','uk','pl','ro','lt','bg'];
test('customer conversations reuse exact eight-language phrases and start focused customer practice',()=>{
 const a=app();a.run(fs.readFileSync(require.resolve('../packs/retail.js'),'utf8')+';registerPack(PACKS.retail);');
 for(const[index,example]of guide.examples.entries()){
  a.context.source=example[0];const word=JSON.parse(a.run('JSON.stringify(PACK_ITEMS.retail.find(word=>word.words.da===source))'));
  assert.ok(guide.startTopics.includes(word.cat));assert.equal(example[1],word.words.en);
  for(const lang of languages.filter(l=>l!=='da'))assert.equal(guide[lang].exampleTranslations[index],word.words[lang]);
 }
 for(const lang of languages){
  const html=fs.readFileSync(require.resolve('../'+lang+'/guides/'+guide[lang].slug+'/index.html'),'utf8');
  const start=new URL(html.match(/<a class="primary cta" href="([^"]+)"/)[1].replaceAll('&amp;','&'),'https://jobvocabulary.com');
  const fresh=app(undefined,{initialState:{},search:start.search,hash:start.hash});
  assert.deepEqual(JSON.parse(fresh.run('JSON.stringify('+(lang==='da'?'draft.cats':'state.settings.cats')+')')),['polite','help']);
  if(lang==='da'){assert.equal(fresh.run('view'),'setup');continue;}
  assert.equal(fresh.run('view'),'play');assert.equal(fresh.run('state.settings.base'),lang);
  fresh.run(fs.readFileSync(require.resolve('../packs/retail.js'),'utf8')+';registerPack(PACKS.retail);renderPlay();');
  assert.ok(guide.startTopics.includes(fresh.run('current.concept.cat')));
 }
});
test('shop course pages prioritize their customer guide and retain a compact guide list',()=>{
 const routes=require('../data/course-urls.json').retail;
 for(const lang of languages){
  const html=fs.readFileSync(require.resolve('../'+routes[lang].slice(1)+'index.html'),'utf8'),section=html.match(/<section class="related-guides">([\s\S]*?)<\/section>/)[1];
  const links=[...section.matchAll(/<a href="([^"]+)"/g)].map(m=>m[1]);
  assert.ok(links.length<=3);assert.equal(links[0],'/'+lang+'/guides/'+guide[lang].slug+'/');
 }
});
