const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const guide=require('../data/guides/shift-work');
const app=require('./helpers/app.cjs');
const languages=['da','en','ru','uk','pl','ro','lt','bg'];

test('the shift guide reuses exact translations and opens hours/shift practice in all eight languages',()=>{
  const a=app();a.run(fs.readFileSync(require.resolve('../packs/worklife.js'),'utf8')+';registerPack(PACKS.worklife);');
  for(const [index,example]of guide.examples.entries()){
    a.context.source=example[0];
    const words=JSON.parse(a.run('JSON.stringify(PACK_ITEMS.worklife.find(word=>word.words.da===source).words)'));
    assert.equal(example[1],words.en);
    for(const lang of languages.filter(l=>l!=='da'))assert.equal(guide[lang].exampleTranslations[index],words[lang]);
  }
  for(const lang of languages){
    const html=fs.readFileSync(require.resolve('../'+lang+'/guides/'+guide[lang].slug+'/index.html'),'utf8');
    const start=new URL(html.match(/<a class="primary cta" href="([^"]+)"/)[1].replaceAll('&amp;','&'),'https://jobvocabulary.com');
    const fresh=app(undefined,{initialState:{},search:start.search,hash:start.hash});
    assert.deepEqual(JSON.parse(fresh.run('JSON.stringify('+(lang==='da'?'draft.cats':'state.settings.cats')+')')),['hours','shifts']);
    if(lang==='da'){assert.equal(fresh.run('view'),'setup');continue;}
    assert.equal(fresh.run('view'),'play');assert.equal(fresh.run('state.settings.base'),lang);
    fresh.run(fs.readFileSync(require.resolve('../packs/worklife.js'),'utf8')+';registerPack(PACKS.worklife);renderPlay();');
    assert.ok(['hours','shifts'].includes(fresh.run('current.concept.cat')));
  }
});

test('working-life pages prioritize their focused shift guide without adding a longer guide list',()=>{
 const routes=require('../data/course-urls.json').worklife;
 for(const lang of languages){
  const html=fs.readFileSync(require.resolve('../'+routes[lang].slice(1)+'index.html'),'utf8');
  const section=html.match(/<section class="related-guides">([\s\S]*?)<\/section>/)[1];
  const links=[...section.matchAll(/<a href="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(links.length,3);assert.equal(links[0],'/'+lang+'/guides/'+guide[lang].slug+'/');
 }
});
