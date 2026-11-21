const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Resume=require('../practice-resume'),app=require('./helpers/app.cjs');
const languages=Object.keys(Resume.languages),names={salon:'Salon',gardening:'Gardening',top:'Common words',pics:'Pictures',favorites:'Saved words'};

test('contextual course starts preserve every supported target/helper pair instead of forcing Danish',()=>{
  for(const target of languages)for(const base of languages.filter(lang=>lang!==target)){
    const pair={target,base},link=new URL(Resume.startLink(pair,'salon',names),'https://jobvocabulary.com');
    const a=app(undefined,{initialState:{},search:link.search,hash:link.hash});
    assert.equal(a.run('view'),'play');assert.equal(a.run('state.settings.target'),target);assert.equal(a.run('state.settings.base'),base);
    assert.equal(a.run('state.settings.pack'),'salon');assert.equal(a.run('placement'),null);
    a.context.pair=pair;
    assert.equal(a.run('catalogueHref(uiLang(),pair)'),`/${base}/?target=${target}&base=${base}`);
  }
});

test('switching courses restores that pair preferences and retains existing records',()=>{
  const saved={pack:'gardening',target:'pl',base:'lt',dir:'write',modes:['rec','write'],diff:2,cats:['materials'],repeatLearned:false};
  const initialState={settings:{pack:'salon',target:'pl',base:'lt',dir:'rec',diff:1},courseSettings:{'gardening|pl|lt':saved},progress:{untouched:{task:7,cards:{word:{right:7,wrong:3,time:123}}}}};
  const link=new URL(Resume.startLink(saved,'gardening',names),'https://jobvocabulary.com');
  const a=app(undefined,{initialState,search:link.search,hash:link.hash});
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings)')),saved);
  assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.progress.untouched)')),initialState.progress.untouched);
  const legacy=app(undefined,{initialState,hash:'#start=salon&base=lt'});
  assert.equal(legacy.run('state.settings.target'),'da');
});

test('native picture starts retain their language and native job starts request a helper rather than loading absent pictures',()=>{
  for(const lang of languages){
    for(const pack of ['top','pics']){
      const a=app(undefined,{initialState:{},hash:`#start=${pack}&target=${lang}&base=${lang}`});
      assert.equal(a.run('view'),'play');assert.equal(a.run('state.settings.target'),lang);assert.equal(a.run('state.settings.base'),lang);
    }
    const a=app(undefined,{initialState:{},hash:`#start=salon&target=${lang}&base=${lang}`});
    assert.equal(a.run('view'),'setup');assert.equal(a.run('draft.target'),lang);assert.equal(a.run('draft.base'),null);assert.equal(a.run('draft.pack'),'salon');
  }
});

test('unsupported target/context parameters cannot alter an existing language pair or create an external course link',()=>{
  for(const invalid of ['__proto__','constructor','xx','https://example.com']){
    assert.equal(Resume.switchContext('?target='+encodeURIComponent(invalid)+'&base=en'),null);
    assert.equal(Resume.switchContext('?target=pl&base='+encodeURIComponent(invalid)),null);
    const a=app({pack:'salon',target:'pl',base:'lt',dir:'write',diff:2},{hash:'#start=gardening&target='+encodeURIComponent(invalid)+'&base=en'});
    assert.equal(a.run('state.settings.target'),'pl');assert.equal(a.run('state.settings.base'),'lt');assert.equal(a.run('state.settings.pack'),'salon');
  }
  for(const pack of ['favorites','__proto__','constructor','https://example.com','salon/elsewhere'])assert.equal(Resume.startLink({target:'pl',base:'lt'},pack,names),null);
  assert.equal(Resume.startLink({target:'pl',base:'lt'},'salon',null),null);
});

function catalogue(search){
  const intro={textContent:'Danish vocabulary'},action={textContent:'Explore the course'};
  const hero={dataset:{switchIntro:'Learning language: {target}. Choose a course.',switchTitle:'Choose your course | JobVocabulary',switchAction:'Start practising'},querySelector:()=>intro};
  const panel={dataset:{names:JSON.stringify(names)},hidden:true};
  const link={dataset:{pack:'salon'},href:'/en/hairdressing-and-salon-work/',setAttribute(name,value){this[name]=value;},querySelector:()=>action};
  const language={href:'/ru/',getAttribute(name){return this[name];},setAttribute(name,value){this[name]=value;}};
  const nodes=new Map([['catalogueHero',hero],['resumePanel',panel]]),meta=new Map();
  const document={title:'Danish vocabulary courses',getElementById:id=>nodes.get(id)||null,querySelector:selector=>{if(!selector.startsWith('meta'))return null;if(!meta.has(selector))meta.set(selector,{setAttribute(name,value){this[name]=value;}});return meta.get(selector);},querySelectorAll:selector=>selector==='.course-card-link[data-pack]'?[link]:selector==='.language-nav a, .language-choices a'?[language]:[]};
  let storageReads=0;const window={location:{search,hash:''},localStorage:{getItem(){storageReads++;return null;}},addEventListener(){}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../catalog-search.js'),'utf8'),{document,window,PracticeResume:Resume,URLSearchParams});
  return{intro,action,panel,link,language,document,storageReads};
}

test('catalogue context starts directly with the chosen pair while public and invalid contexts keep static course links',()=>{
  const contextual=catalogue('?target=pl&base=lt');
  assert.equal(contextual.link.href,'/?ui=lt#start=salon&target=pl&base=lt');
  assert.equal(contextual.intro.textContent,'Learning language: Polski. Choose a course.');
  assert.equal(contextual.action.textContent,'Start practising');assert.equal(contextual.panel.hidden,true);assert.equal(contextual.storageReads,0);
  assert.equal(contextual.language.href,'/ru/?target=pl&base=lt');
  assert.equal(contextual.document.title,'Choose your course | JobVocabulary');
  for(const search of ['', '?target=constructor&base=en','?target=pl']){
    const ordinary=catalogue(search);assert.equal(ordinary.link.href,'/en/hairdressing-and-salon-work/');assert.equal(ordinary.intro.textContent,'Danish vocabulary');
  }
});

test('landing course links refresh when the target changes while the helper interface stays the same',()=>{
  const a=app({pack:'salon',target:'pl',base:'lt',dir:'rec',diff:1});
  const children=new Map(['h1','.lead','.jobs'].map(key=>[key,{setAttribute(){}}]));
  const intro={dataset:{},querySelectorAll:()=>[],querySelector:key=>children.get(key)};
  const get=a.context.document.getElementById;
  a.context.document.getElementById=id=>id==='intro'?intro:Object.assign(get(id),{setAttribute(){}});
  a.context.document.querySelectorAll=()=>[];
  a.run('view="home";renderIntro("lt");');
  assert.match(children.get('.jobs').innerHTML,/target=pl&amp;base=lt#work/);
  a.run('state.settings.target="ru";renderIntro("lt");');
  assert.match(children.get('.jobs').innerHTML,/target=ru&amp;base=lt#work/);
});
