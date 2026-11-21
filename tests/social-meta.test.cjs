const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {imageInfo,courseImage,guideImage}=require('../data/social-meta');
const root=path.resolve(__dirname,'..');
const urls=[...fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);
const value=(html,name)=>html.match(new RegExp('<meta (?:property|name)="'+name+'" content="([^"]*)"'))?.[1];

test('every indexed page has one complete static social image with a real local asset',()=>{
  for(const url of urls){
    const page=new URL(url),html=fs.readFileSync(path.join(root,page.pathname,'index.html'),'utf8');
    const image=value(html,'og:image');
    assert.ok(image,url);
    assert.equal((html.match(/property="og:image"/g)||[]).length,1,url);
    assert.equal((html.match(/name="twitter:card"/g)||[]).length,1,url);
    assert.equal(value(html,'og:url'),url,url);
    assert.equal(value(html,'og:site_name'),'JobVocabulary',url);
    assert.equal(value(html,'twitter:image'),image,url);
    assert.ok(value(html,'og:image:alt'),url);
    assert.equal(value(html,'twitter:image:alt'),value(html,'og:image:alt'),url);
    assert.ok(+value(html,'og:image:width')>=1024,url);
    assert.ok(+value(html,'og:image:height')>=1024,url);
    const asset=new URL(image);
    assert.equal(asset.origin,page.origin,url);
    assert.ok(fs.existsSync(path.join(root,asset.pathname)),image);
    assert.doesNotMatch(asset.pathname,/favicon|logo/,url);
  }
});

test('topic images have all eight descriptions and new PNG dimensions match metadata',()=>{
  const routes=require('../data/course-urls.json'),{guides}=require('../data/seo-content');
  for(const lang of ['da','en','ru','uk','pl','ro','lt','bg']){
    for(const id of Object.keys(routes))assert.ok(imageInfo(courseImage(id),lang).alt,id+'/'+lang);
    for(const guide of guides)assert.ok(imageInfo(guideImage(guide.id),lang).alt,guide.id+'/'+lang);
  }
  for(const key of ['cleaning','warehouse','trucking']){
    const image=imageInfo(key,'en'),bytes=fs.readFileSync(path.join(root,image.file));
    assert.equal(bytes.subarray(1,4).toString(),'PNG');
    assert.equal(bytes.readUInt32BE(16),image.width);
    assert.equal(bytes.readUInt32BE(20),image.height);
    assert.ok(bytes.length<5000000);
  }
  assert.throws(()=>courseImage('missing-course'),/Missing course/);
  assert.throws(()=>guideImage('missing-guide'),/Missing guide/);
});
