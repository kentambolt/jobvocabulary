const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const script=fs.readFileSync(require.resolve('../not-found.js'),'utf8');
const languages=['da','en','ru','uk','pl','ro','lt','bg'];
function render(pathname,search='',preferred=['en-US']){
 const elements=Object.fromEntries(['errorTitle','errorText','errorCourses','errorHome','errorBrand'].map(id=>[id,{}]));
 const document={documentElement:{},getElementById:id=>elements[id]};
 vm.runInNewContext(script,{document,location:{pathname,search},navigator:{languages:preferred},URLSearchParams});
 return {elements,document};
}
test('missing localized paths keep the intended language and offer valid recovery links',()=>{
 for(const language of languages){
  const {document,elements}=render('/'+language+'/missing-course/');
  assert.equal(document.documentElement.lang,language);
  assert.ok(elements.errorTitle.textContent);
  assert.ok(elements.errorText.textContent);
  assert.equal(elements.errorCourses.href,'/'+language+'/');
  assert.equal(elements.errorHome.href,'/?ui='+language+'#forside');
  assert.equal(elements.errorBrand.href,elements.errorHome.href);
  assert.ok(fs.existsSync(require.resolve('../'+language+'/index.html')));
 }
});
test('explicit supported UI choices win while unknown parameters cannot change recovery destinations',()=>{
 assert.equal(render('/ru/missing/','?ui=pl').document.documentElement.lang,'pl');
 for(const value of ['constructor','__proto__','https://example.com','%3Cscript%3E']){
  const result=render('/uk/missing/','?ui='+value);
  assert.equal(result.document.documentElement.lang,'uk');
  assert.equal(result.elements.errorCourses.href,'/uk/');
 }
});
test('unknown paths use a supported browser language or English without redirecting',()=>{
 assert.equal(render('/unknown/','',['fr-FR','lt-LT','en']).document.documentElement.lang,'lt');
 assert.equal(render('/unknown/','',['fr-FR']).document.documentElement.lang,'en');
 assert.doesNotMatch(script,/location\.(?:href|replace|assign)\s*[=(]/);
});
test('the custom error page is excluded from indexing and the sitemap and uses root-relative assets',()=>{
 const html=fs.readFileSync(require.resolve('../404.html'),'utf8');
 assert.match(html,/<meta name="robots" content="noindex,follow">/);
 assert.doesNotMatch(html,/http-equiv="refresh"|rel="canonical"/);
 assert.doesNotMatch(fs.readFileSync(require.resolve('../sitemap.xml'),'utf8'),/404\.html/);
 for(const [,url]of html.matchAll(/(?:href|src)="([^"]+)"/g))assert.ok(url.startsWith('/')||url.startsWith('https://'),url);
 assert.match(html,/<script src="\/not-found\.js(?:\?v=[^"]+)?" defer><\/script>/);
});
