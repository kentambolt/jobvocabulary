const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const catalog=require('../catalog'),app=require('./helpers/app.cjs');
const html=fs.readFileSync(require.resolve('../index.html'),'utf8');
const languages=['da','en','ru','uk','pl','ro','lt','bg'];
const structured=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];

test('the static root has a complete general-language fallback and exactly one unchanged canonical',()=>{
  const count=JSON.parse(structured).inLanguage.length;
  assert.equal(count,languages.length);
  assert.ok(html.includes('<title>'+catalog.metadata.da.title+'</title>'));
  assert.ok(html.includes('property="og:title" content="'+catalog.metadata.da.title+'"'));
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
  assert.match(html,/<link rel="canonical" href="https:\/\/jobvocabulary.com\/">/);
  assert.equal(JSON.parse(structured).name,'JobVocabulary');
  assert.doesNotMatch(JSON.parse(structured).description,/\{(?:courses|languages)\}/);
});

test('rendered root metadata follows all eight interface languages without changing learning settings or canonical identity',()=>{
  const settings={pack:'salon',target:'pl',base:'lt',dir:'write',diff:2};
  for(const lang of languages){
    const a=app(settings,{search:'?ui='+lang});
    const nodes=new Map();
    for(const selector of ['meta[name="description"]','meta[property="og:title"]','meta[property="og:description"]','meta[property="og:locale"]','meta[property="og:image:alt"]','meta[name="twitter:image:alt"]'])nodes.set(selector,{setAttribute(name,value){this[name]=value;}});
    const schema={textContent:structured};nodes.set('script[type="application/ld+json"]',schema);
    const canonical={href:'https://jobvocabulary.com/'};nodes.set('link[rel="canonical"]',canonical);
    a.context.document.querySelector=selector=>nodes.get(selector)||null;
    a.run('renderSiteMetadata(uiLang());');
    const copy=catalog.siteMetadata(lang,a.run('PACK_INDEX.length'));
    assert.equal(a.context.document.title,copy.title);
    assert.equal(nodes.get('meta[name="description"]').content,copy.description);
    assert.equal(nodes.get('meta[property="og:title"]').content,copy.title);
    assert.equal(nodes.get('meta[property="og:description"]').content,copy.description);
    assert.equal(nodes.get('meta[property="og:locale"]').content,copy.locale);
    assert.equal(nodes.get('meta[property="og:image:alt"]').content,copy.imageAlt);
    assert.equal(nodes.get('meta[name="twitter:image:alt"]').content,copy.imageAlt);
    assert.equal(JSON.parse(schema.textContent).description,copy.description);
    assert.equal(JSON.parse(schema.textContent).url,canonical.href);
    assert.equal(canonical.href,'https://jobvocabulary.com/');
    assert.deepEqual(JSON.parse(a.run('JSON.stringify(state.settings)')),settings);
  }
});
