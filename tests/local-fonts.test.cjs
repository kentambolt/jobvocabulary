const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
test('fonts are hosted locally with their licences and correct binary format',()=>{
  const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
  const urls=[...css.matchAll(/url\((\/fonts\/[^)]+)\)/g)].map(m=>m[1]);
  assert.equal(urls.length,9);
  for(const url of urls) assert.equal(fs.readFileSync(path.join(root,url)).subarray(0,4).toString(),'wOF2');
  for(const name of ['DM-Sans','Lora'])assert.match(fs.readFileSync(path.join(root,'fonts',name+'-OFL.txt'),'utf8'),/SIL OPEN FONT LICENSE Version 1.1/);
  assert.match(css,/font-weight: 400 700/);assert.match(css,/font-weight: 400 600/);
});
test('generated pages do not send font requests or preconnects to Google',()=>{
  const files=['index.html','404.html','dictionary/attribution.html'];
  for(const lang of ['da','en','ru','uk','pl','ro','lt','bg'])for(const file of fs.readdirSync(path.join(root,lang),{recursive:true}))if(file.endsWith('.html'))files.push(path.join(lang,file));
  for(const file of files)assert.doesNotMatch(fs.readFileSync(path.join(root,file),'utf8'),/fonts\.(googleapis|gstatic)\.com/,file);
});
