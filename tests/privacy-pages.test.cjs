const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const privacy=require('../data/privacy-pages'),transport=require('../aggregate-transport');
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
        assert.ok(html.includes(enabled?copy.on:copy.off));
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
