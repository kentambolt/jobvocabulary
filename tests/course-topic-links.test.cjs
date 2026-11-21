const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const routes=require('../data/course-urls.json');
const app=require('./helpers/app.cjs');
const languages=['da','en','ru','uk','pl','ro','lt','bg'];
const read=(id,lang)=>fs.readFileSync(require.resolve('..'+routes[id][lang]+'index.html'),'utf8');
const topicLinks=html=>[...html.match(/<ul class="topics">([\s\S]*?)<\/ul>/)[1].matchAll(/<a href="([^"]+)"/g)].map(match=>new URL(match[1].replaceAll('&amp;','&'),'https://jobvocabulary.com'));

test('every published course topic links directly to its real category with the matching interface and helper language',()=>{
  const a=app();
  for(const id of Object.keys(routes))for(const lang of languages){
    const links=topicLinks(read(id,lang));
    a.context.course=id;
    const keys=JSON.parse(a.run('JSON.stringify(PACK_INDEX.find(pack=>pack.id===course).categories.map(category=>category.key))'));
    assert.equal(links.length,keys.length,id+'/'+lang);
    for(const [index,link]of links.entries()){
      const params=new URLSearchParams(link.hash.slice(1));
      assert.equal(link.pathname,'/');assert.equal(link.searchParams.get('ui'),lang);
      assert.equal(params.get('start'),id);assert.equal(params.get('topics'),keys[index]);
      assert.equal(params.get('base'),lang==='da'?null:lang);
    }
  }
});

test('a clicked topic starts only that topic and retains returning learner cards',()=>{
  for(const lang of languages){
    const link=topicLinks(read('salon',lang))[1];
    const a=app(undefined,{initialState:{settings:{target:'da',base:'en',pack:'hotel',dir:'write',diff:2},progress:{'saved-other-course':{cards:{example:{right:7,wrong:1,due:12345}}}}},search:link.search,hash:link.hash});
    assert.equal(a.run('state.progress["saved-other-course"].cards.example.right'),7);
    assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings.cats)')),['tools']);
    assert.equal(a.run('view'),'play');assert.equal(a.run('state.settings.base'),lang==='da'?'en':lang);
    a.run(fs.readFileSync(require.resolve('../packs/salon.js'),'utf8')+';registerPack(PACKS.salon);renderPlay();');
    assert.equal(a.run('ctx().pool.every(word=>word.cat==="tools")'),true);
    assert.equal(a.run('current.concept.cat'),'tools');
    assert.equal(a.run('placement'),null);
  }
});

test('bilingual example columns expose language-aware column headings',()=>{
  for(const lang of languages){
    const html=read('salon',lang);
    assert.match(html,/<th scope="col" lang="da">Dansk<\/th>/);
    assert.ok(html.includes(`<th scope="col" lang="${lang==='da'?'en':lang}">`));
  }
});
