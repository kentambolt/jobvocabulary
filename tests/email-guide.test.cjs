const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const guide=require('../data/guides/email-work');
const app=require('./helpers/app.cjs');
const languages=['da','en','ru','uk','pl','ro','lt','bg'];

test('the workplace email guide reuses exact translations and opens email/follow-up practice in all eight languages',()=>{
  const a=app();a.run(fs.readFileSync(require.resolve('../packs/office.js'),'utf8')+';registerPack(PACKS.office);');
  for(const [index,example]of guide.examples.entries()){
    a.context.source=example[0];
    const words=JSON.parse(a.run('JSON.stringify(PACK_ITEMS.office.find(word=>word.words.da===source).words)'));
    assert.equal(example[1],words.en);
    for(const lang of languages.filter(l=>l!=='da'))assert.equal(guide[lang].exampleTranslations[index],words[lang]);
  }
  for(const lang of languages){
    const html=fs.readFileSync(require.resolve('../'+lang+'/guides/'+guide[lang].slug+'/index.html'),'utf8');
    const start=new URL(html.match(/<a class="primary cta" href="([^"]+)"/)[1].replaceAll('&amp;','&'),'https://jobvocabulary.com');
    const fresh=app(undefined,{initialState:{},search:start.search,hash:start.hash});
    assert.deepEqual(JSON.parse(fresh.run('JSON.stringify('+(lang==='da'?'draft.cats':'state.settings.cats')+')')),['email','followup']);
    if(lang==='da'){assert.equal(fresh.run('view'),'setup');continue;}
    assert.equal(fresh.run('view'),'play');assert.equal(fresh.run('state.settings.base'),lang);
    fresh.run(fs.readFileSync(require.resolve('../packs/office.js'),'utf8')+';registerPack(PACKS.office);renderPlay();');
    assert.ok(['email','followup'].includes(fresh.run('current.concept.cat')));
  }
});
