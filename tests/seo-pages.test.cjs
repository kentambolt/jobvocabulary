const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {guides}=require('../data/seo-content');
const {guideLanguages}=require('../data/seo-pages');
const app=require('./helpers/app.cjs');
const root=path.resolve(__dirname,'..');
const site='https://jobvocabulary.com';
const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const read=url=>fs.readFileSync(path.join(root,new URL(url).pathname,'index.html'),'utf8');

test('every sitemap page has a unique title, description and self canonical',()=>{
  assert.equal(new Set(urls).size,urls.length);
  const titles=new Set(),descriptions=new Set();
  for(const url of urls){
    const html=read(url);
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`),url);
    assert.doesNotMatch(html,/<meta[^>]+name="robots"[^>]+noindex/i,url);
    assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,url);
    for(const [re,seen] of [[/<title>(.*?)<\/title>/s,titles],[/<meta name="description" content="([^"]+)"/,descriptions]]){
      const value=html.match(re)?.[1]; assert.ok(value,url); assert.ok(!seen.has(value),'Duplicate metadata: '+url);seen.add(value);
    }
    for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) assert.doesNotThrow(()=>JSON.parse(match[1]),url);
  }
});

test('each interface opens its own guides and guide starts preserve the correct helper language',()=>{
  for(const lang of guideLanguages){
    const menu=app(undefined,{initialState:{},search:'?ui='+lang});
    const getElement=menu.context.document.getElementById;
    menu.context.document.documentElement={};
    menu.context.document.getElementById=id=>Object.assign(getElement(id),{setAttribute(){},classList:{toggle(){}}});
    menu.run('view="home";renderIntro=()=>{};renderHomeStart=()=>{};render();');
    assert.equal(menu.context.document.getElementById('guidesLink').href,`/${lang}/guides/`);
    const guide=guides[0];
    const html=read(`${site}/${lang}/guides/${guide[lang].slug}/`);
    const start=new URL(html.match(/<a class="primary cta" href="([^"]+)"/)[1].replace(/&amp;/g,'&'),site);
    const newcomer=app(undefined,{initialState:{},search:start.search,hash:start.hash});
    assert.equal(newcomer.run('uiLang()'),lang);
    assert.equal(newcomer.run('draft.target'),'da');
    assert.equal(newcomer.run('draft.base'),lang==='da'?null:lang);
    assert.equal(newcomer.run('draft.pack'),guide.courses[0]);
    if(lang==='da')continue;
    const returning=app({target:'pl',base:'en',pack:'hotel',dir:'write',diff:2},{search:start.search,hash:start.hash});
    assert.equal(returning.run('state.settings.target'),'da');
    assert.equal(returning.run('state.settings.base'),lang);
    assert.equal(returning.run('state.settings.pack'),guide.courses[0]);
  }
});

test('public learning pages have no broken internal navigation links',()=>{
  for(const url of urls) for(const match of read(url).matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)){
    const target=new URL(match[1].replace(/&amp;/g,'&'),url);
    if(target.origin!==site)continue;
    const file=path.join(root,target.pathname,target.pathname.endsWith('/')?'index.html':'');
    assert.ok(fs.existsSync(file),url+' links to missing '+target.pathname);
  }
});

test('guides are discoverable, reciprocal and link directly into real course practice',()=>{
  for(const g of guides)for(const lang of guideLanguages){
    const url=`${site}/${lang}/guides/${g[lang].slug}/`,html=read(url);
    assert.ok(urls.includes(url));
    for(const other of guideLanguages)assert.ok(html.includes(`hreflang="${other}" href="${site}/${other}/guides/${g[other].slug}/"`));
    const start=html.match(/<a class="primary cta" href="([^"]+)"/)[1].replace(/&amp;/g,'&');
    const target=new URL(start,site);
    assert.equal(target.searchParams.get('ui'),lang);
    assert.equal(new URLSearchParams(target.hash.slice(1)).get('start'),g.courses[0]);
    if(lang!=='da')assert.equal(new URLSearchParams(target.hash.slice(1)).get('base'),lang);
    assert.match(html,/"@type":"Article"/);
    assert.match(html,/"@type":"BreadcrumbList"/);
    assert.ok(read(`${site}/${lang}/guides/`).includes(`/${lang}/guides/${g[lang].slug}/`));
    for(const other of guideLanguages)assert.ok(read(`${site}/${lang}/guides/`).includes(`hreflang="${other}" href="${site}/${other}/guides/"`));
    for(const example of g[lang].exampleTranslations||[]){
      const escaped=example.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      assert.ok(html.includes(`<td lang="${lang}">${escaped}</td>`));
    }
    assert.ok(html.includes(`<a href="/${lang}/">`));
  }
  const app=read(site+'/');
  assert.match(app,/id="guidesLink"/);
  const webApp=JSON.parse(app.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(webApp.inLanguage,['da','en','ru','uk','pl','ro','lt','bg']);
});
