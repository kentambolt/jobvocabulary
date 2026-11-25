const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const privacy=require('../data/privacy-pages'),transport=require('../traffic-metrics');
test('privacy pages cover eight languages and reflect the actual measurement switch',()=>{
  const temporaryRoot=path.join(__dirname,'.tmp');fs.mkdirSync(temporaryRoot,{recursive:true});
  const dir=fs.mkdtempSync(path.join(temporaryRoot,'jv-privacy-'));
  const original=transport.enabled;
  try {
    for(const enabled of [false,true]) {
      transport.enabled=enabled;const files=privacy.build(dir);assert.equal(files.length,8);
      for(const [lang,copy] of Object.entries(privacy.copy)){
        const html=fs.readFileSync(path.join(dir,lang,'privacy/index.html'),'utf8');
        assert.match(html,new RegExp('<html lang="'+lang+'">'));
        assert.ok(html.includes(enabled?require('../data/statistics-privacy-copy')[lang].usage:require('../statistics-copy')[lang].off));
        assert.match(html,/id="statisticsControls"/);
        assert.ok(html.includes(require('../data/statistics-privacy-copy')[lang].noscript));
        if (enabled) for (const days of [30,90,14,180]) assert.ok(html.includes(String(days)));
        assert.doesNotMatch(html,/not stored in the statistics or sent to Umami/);
        assert.match(html,/noindex,follow/);assert.match(html,/contact@jobvocabulary\.com/);
        assert.match(html,/Munthe Systems ApS/);assert.match(html,/Zoho EU/);assert.match(html,/Gmail/);
        assert.doesNotMatch(html,/fonts\.(googleapis|gstatic)\.com/);
        assert.doesNotMatch(html,/[→←–—]/);
      }
    }
  } finally {
    transport.enabled=original;
    const actual=path.resolve(dir),temp=path.resolve(temporaryRoot);
    assert.equal(path.dirname(actual),temp);assert.ok(path.basename(actual).startsWith('jv-privacy-'));
    fs.rmSync(actual,{recursive:true});
  }
});

test('every built public page has one local consent integration and a persistent route to its privacy choice',()=>{
 const root=path.resolve(__dirname,'..');const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
 const routes=[...sitemap.matchAll(/<loc>https:\/\/jobvocabulary\.com([^<]+)<\/loc>/g)].map(m=>m[1]);
 for(const route of ['/',...routes,...Object.keys(privacy.copy).map(lang=>'/'+lang+'/privacy/')]){
  const file=path.join(root,route,'index.html');const html=fs.readFileSync(file,'utf8');
  assert.equal((html.match(/src="\/measurement-policy\.js\?v=/g)||[]).length,1,route);
  assert.equal((html.match(/src="\/statistics-controls\.js\?v=/g)||[]).length,1,route);
  assert.doesNotMatch(html,/src="https:\/\/[^\"]*(?:umami|tracker\.)/i,route);
  if(route!=='/'&&!route.includes('/privacy/')) assert.match(html,/href="\/[a-z]{2}\/privacy\/"/,route);
 }
 const html=fs.readFileSync(path.join(root,'en/privacy/index.html'),'utf8');
 assert.ok(html.indexOf('id="statisticsControls"')<html.indexOf('Umami visit history'));
 assert.match(html,/Umami visit history does not yet have automatic expiry/);
 assert.match(html,/<noscript>/);
});

test('consent integration and privacy navigation do not reset learning-content sitemap dates',()=>{
 const {pageDigest}=require('../data/build-sitemap');
 const old='<html><head></head><body><main><h1>Learn useful words</h1></main></body></html>';
 const updated=old.replace('</head>','<!-- STATISTICS --><script src="/traffic-metrics.js?v=new" defer></script><!-- /STATISTICS --></head>').replace('</body>','<footer class="statistics-footer"><a href="/en/privacy/">Privacy</a></footer></body>');
 assert.equal(pageDigest(old),pageDigest(updated));
 assert.notEqual(pageDigest(old),pageDigest(updated.replace('Learn useful words','Learn useful phrases')));
});
