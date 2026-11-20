const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {guides}=require('../data/seo-content');
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

test('public learning pages have no broken internal navigation links',()=>{
  for(const url of urls) for(const match of read(url).matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)){
    const target=new URL(match[1].replace(/&amp;/g,'&'),url);
    if(target.origin!==site)continue;
    const file=path.join(root,target.pathname,target.pathname.endsWith('/')?'index.html':'');
    assert.ok(fs.existsSync(file),url+' links to missing '+target.pathname);
  }
});

test('guides are discoverable, reciprocal and link directly into real course practice',()=>{
  for(const g of guides)for(const lang of ['da','en']){
    const url=`${site}/${lang}/guides/${g[lang].slug}/`,html=read(url);
    assert.ok(urls.includes(url));
    for(const other of ['da','en'])assert.ok(html.includes(`hreflang="${other}" href="${site}/${other}/guides/${g[other].slug}/"`));
    assert.match(html,/<a class="primary cta" href="\/\?ui=(da|en)#start=/);
    assert.match(html,/"@type":"Article"/);
    assert.match(html,/"@type":"BreadcrumbList"/);
    assert.ok(read(`${site}/${lang}/guides/`).includes(`/${lang}/guides/${g[lang].slug}/`));
  }
  const app=read(site+'/');
  assert.match(app,/id="guidesLink"/);
  const webApp=JSON.parse(app.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(webApp.inLanguage,['da','en','ru','uk','pl','ro']);
});
