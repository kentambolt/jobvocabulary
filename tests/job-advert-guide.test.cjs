const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const guide=require('../data/guides/job-advert');
const app=require('./helpers/app.cjs');
const langs=['da','en','ru','uk','pl','ro','lt','bg'];
const context={};vm.runInNewContext(fs.readFileSync(require.resolve('../packs/jobsearch.js'),'utf8'),context);
const rows=context.PACKS.jobsearch.categories.filter(category=>guide.startTopics.includes(category.key)).flatMap(category=>category.rows);

test('job-advert guide examples are actual selected course words and phrases in every language',()=>{
  assert.equal(guide.examples.length,9);
  for(let i=0;i<guide.examples.length;i++){
    const row=rows.find(row=>row[1]===guide.examples[i][0]);
    assert.ok(row,guide.examples[i][0]);
    assert.equal(guide.examples[i][1],row[2]);
    for(const lang of langs.filter(lang=>lang!=='da'))assert.equal(guide[lang].exampleTranslations[i],row[langs.indexOf(lang)+1]);
  }
});

test('each translated job-advert guide starts focused job-search practice with its own helper',()=>{
  for(const lang of langs){
    const html=fs.readFileSync(require.resolve('../'+lang+'/guides/'+guide[lang].slug+'/index.html'),'utf8');
    const href=html.match(/<a class="primary cta" href="([^"]+)"/)[1].replaceAll('&amp;','&');
    const url=new URL(href,'https://jobvocabulary.com');
    const a=app(undefined,{initialState:{},search:url.search,hash:url.hash});
    assert.deepEqual(JSON.parse(a.run('JSON.stringify('+ (lang==='da'?'draft.cats':'state.settings.cats') +')')),guide.startTopics);
    if(lang==='da'){assert.equal(a.run('view'),'setup');continue;}
    assert.equal(a.run('view'),'play');
    assert.equal(a.run('state.settings.base'),lang);
    a.run(fs.readFileSync(require.resolve('../packs/jobsearch.js'),'utf8')+';registerPack(PACKS.jobsearch);renderPlay();');
    assert.equal(a.run('current.concept.cat'),'findingJobs');
  }
});
